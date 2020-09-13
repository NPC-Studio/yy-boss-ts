import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput } from './core';
import { ShutdownCommand } from './shutdown';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError, YyParseError } from './error';
import * as path from 'path';
import { stdout } from 'process';
import { StartupOutputError } from './startup';
import extract from 'extract-zip';
import * as fs from 'fs-extra';
import * as Axios from 'axios';

const axios = Axios.default;
const CURRENT_VERSION = '0.4.7';

abstract class Logging {
    abstract logLevel: Log;
}

export class LogToFile extends Logging {
    logLevel = Log.LogToFile;
    constructor(public file: string) {
        super();
    }
}

export class LogToStdErr extends Logging {
    logLevel = Log.LogToStdErr;
}

export const enum Log {
    DoNotLog,
    LogToFile,
    LogToStdErr,
}

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;
    private closureStatus: boolean;
    public error: CommandOutputError | undefined;

    hasError(): this is { error: CommandOutputError } {
        return this.error !== undefined;
    }

    get hasClosed(): boolean {
        return this.closureStatus;
    }

    private constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;
        this.closureStatus = false;

        yyBossHandle.on('close', (code, signal) => {
            console.log(`SHUTDOWN: ${signal} ${code}`);
        });
        yyBossHandle.on('error', error => {
            console.log(error);
        });
    }

    static async create(
        yyBossPath: string,
        yypPath: string,
        wd: string,
        log?: Logging | undefined
    ): Promise<[Output, YyBoss | undefined]> {
        yypPath = path.resolve(yypPath);
        wd = path.resolve(wd);

        if (this.getVersion(yyBossPath) !== CURRENT_VERSION) {
            return [
                new StartupOutputError(`incorrect version of yy-boss exe given. we need ${CURRENT_VERSION}`),
                undefined,
            ];
        }

        let args = [yypPath, wd];

        // PHEW THIS ISN'T GREAT CODE JACK
        if (log !== undefined) {
            switch (log.logLevel) {
                case Log.DoNotLog:
                    break;

                case Log.LogToFile:
                    args.push('-l');
                    let file_log = log as LogToFile;
                    args.push(file_log.file);

                    break;

                case Log.LogToStdErr:
                    args.push('-s');
                    break;
            }
        }

        let yyBossHandle = spawn(yyBossPath, args);

        return new Promise((resolve, _) => {
            yyBossHandle.stdout.once('data', (chonk: string) => {
                // if we boof the command somehow, JSON.parse will throw
                let output: Output = JSON.parse(chonk);
                assert(output.type === OutputType.Startup);

                // output
                let yyp_boss = output.success ? new YyBoss(yyBossHandle) : undefined;

                resolve([output, yyp_boss]);
            });
        });
    }

    writeCommand<T extends Command>(command: T): Promise<CommandToOutput<T>> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', (chonk: string) => {
                let cmd: CommandOutput = JSON.parse(chonk);

                if (cmd.success === false) {
                    this.error = cmd as CommandOutputError;
                    resolve();
                } else {
                    resolve(cmd as CommandToOutput<T>);
                }
            });

            let gonna_write = JSON.stringify(command) + '\n';
            this.yyBossHandle.stdin.write(gonna_write);
            this.error = undefined;
        });
    }

    shutdown(): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                let output: Output = JSON.parse(chonk);
                if (output.success) {
                    this.closureStatus = true;
                }

                resolve(output);
            });

            this.yyBossHandle.stdin.write(JSON.stringify(new ShutdownCommand()) + '\n');
        });
    }

    static async fetchYyBoss(bossDirectory: string, force?: boolean | undefined): Promise<string> {
        // Fetches a compatible release of YYBoss from Github
        async function download(url: string, dest: string): Promise<void> {
            const response = await axios.get(url, { responseType: 'stream' });
            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);
            return new Promise<undefined>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }

        // resolve it to the full path...not really necessary, but good for debugging
        bossDirectory = path.resolve(bossDirectory);
        force = force === undefined ? false : force;

        // make sure the directory is valid, so we can write and read below
        await fs.ensureDir(bossDirectory);

        let bosspath = undefined;
        let update = false;

        let bossurl = `https://github.com/NPC-Studio/yy-boss/releases/download/v${CURRENT_VERSION}/YyBoss`;

        if (process.platform == 'win32') {
            bosspath = path.join(bossDirectory, 'yy-boss-cli.exe');
            bossurl = `${bossurl}.zip`;
        } else if (process.platform == 'darwin') {
            bosspath = path.join(bossDirectory, 'yy-boss-cli_darwin');
            bossurl = `${bossurl}-Darwin.zip`;
        } else {
            throw 'Fetch does not have support for Linux!';
        }

        if (!fs.existsSync(bosspath)) {
            console.log('We need to download');
            update = true;
        } else {
            console.log('Check versions');
            const output = this.getVersion(bosspath);
            update = output !== CURRENT_VERSION;

            if (update) {
                console.log(`Version mismatch, have ${output}, require ${CURRENT_VERSION}`);
            } else {
                console.log(`Local version is current`);
            }
        }

        // check for a forced update
        if (force) {
            console.log('Forced update by parameter');
            update = true;
        }

        if (update) {
            // file either doesn't exist, or we have the wrong version
            const output_zip = path.join(bossDirectory, 'yy-boss-cli.zip');
            console.log(`Updating from ${bossurl}`);

            try {
                await download(bossurl, output_zip);
            } catch (e) {
                throw `Update from GitHub releases failed! -- ${e}`;
            }

            await extract(output_zip, { dir: bossDirectory });
            await fs.remove(output_zip);

            // only unix will need the chmod but windows can have some chmod
            // as a treat
            await fs.chmod(bosspath, 0o777);

            console.log('Updated succesfully');
        }
        return bosspath;
    }

    static getVersion(yyBossPath: string): string | undefined {
        try {
            const yyBossVersionCheck = spawnSync(yyBossPath, ['-v']);
            return yyBossVersionCheck.stdout.toString().replace(/[a-z-]*\s/g, '');
        } catch (_) {
            return undefined;
        }
    }
}
