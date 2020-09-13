import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput, CommandType } from './core';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError, YypBossError } from './error';
import * as path from 'path';
import { StartupOutputError } from './startup';
import extract from 'extract-zip';
import * as fs from 'fs-extra';
import * as Axios from 'axios';
import { stdout } from 'process';

const AXIOS = Axios.default;
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

export const enum ClosureStatus {
    Open,
    ExpectedShutdown,
    UnexpectedShutdown,
}

export const enum YyBossDownloadStatus {
    NoBoss,
    IncorrectVersion,
    Success,
}

class ShutdownCommand extends Command {
    protected type: CommandType = CommandType.Shutdown;
}

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;
    private _closureStatus: ClosureStatus = ClosureStatus.Open;
    private onUnexpectedShutdown: (() => Promise<void>)[] = [];
    private _error: YypBossError | undefined;

    /**
     * The error the last command may have returned.
     */
    public get error(): YypBossError | undefined {
        return this._error;
    }

    /**
     * Checks if the last command issued an error.
     */
    public hasError(): this is { error: YypBossError } {
        return this._error !== undefined;
    }

    /**
     * Polls the current closure status.
     */
    public get closureStatus(): ClosureStatus {
        return this._closureStatus;
    }

    private constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;

        yyBossHandle.on('close', async (code, signal) => {
            if (this.closureStatus == ClosureStatus.Open) {
                this._closureStatus = ClosureStatus.UnexpectedShutdown;

                for (const cback of this.onUnexpectedShutdown) {
                    await cback();
                }
            }
            console.log(`SHUTDOWN: ${signal} ${code}`);
        });
        yyBossHandle.stderr.pipe(stdout);
    }

    /**
     * Creates a new YyBoss.
     *
     * @param yyBossPath The path to the YyBoss server executable. If you do not have the binary, please download it using
     * `YyBoss.fetchYyBoss`.
     * @param yypPath The path to the yyp for the yyBoss to operate on. In the future, the YyBoss will be able to operate
     * in a headless manner, but not currently.
     * @param wd The path to the working directory. The YyBoss occasionally reads and writes files, rather than talking
     * exclusively over stdio, and this directory is a safe place for it to read and write.
     * @param log The log level that the YyBoss should use. Please note, by default, logs to `stderr` are piped into the current
     * NodeJs `stdout` log. In the future, this behavior will be customizable.
     */
    public static async create(
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

    /**
     * Write a new command to the YyBoss. This is the core function of the library.
     *
     * Each command is found in separate modules, grouped by their type. A command's type
     * will **appear** to always return some value -- in actuality, however, a command **can**
     * return undefined, but we bend the type system so they appear to not.
     *
     * We do this so that users who are confident that their commands will not cause an error
     * can press on, disregarding the possibility of an undefined, without using ugly casts around
     * `await` calls. Because we *do* return an undefined, most of the time, users will immediately
     * encounter their error.
     *
     * To make sure that your command succeeded without error, check `YyBoss.hasError()`, which will
     * inform you of the current error status. If there is an error, you can view the error using `YyBoss.error`, which
     * will be reset to undefined on each new command (so past errors *can* be lost if you issue successive commands).
     * Right now, errors are untyped -- most commands only issue a subset of the possible sphere of errors, and some errors
     * should never be seen by users. In the future, errors will be typed by the command issued, like how this function handles
     * return types.
     *
     * Finally, this commands has a variadic return type. You **do** have static typing, however; see `CommandToOutput` for
     * a listing of each Command to CommandOutput. In short, whatever type of Command you input will instruct Typescript as to
     * the return type of the output. In practice, this allows for successive calls, such as:
     *
     * ```ts
     * const root = await yyBoss.writeCommand(new vfsCommands.GetFullVfs());
     * const new_folder = await yyBoss.writeCommand(new vfsCommands.CreateFolderVfs(root.flatFolderGraph.viewPath, "Sprites"));
     * const new_sprite = await yyBoss.writeCommand(new utilities.CreateResourceYyFile(Resource.Sprite, "spr_player", new_folder));
     * await yyBoss.writeCommand(new resourceCommands.AddResource(Resource.Sprite, new_sprite, new SerializedDataDefault()));
     * ```
     * For more information, please see the project's Github page.
     *
     * @param command The command to send to the YyBoss. The return type of this function
     * is dependent on the command issued.
     */
    public writeCommand<T extends Command>(command: T): Promise<CommandToOutput<T>> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', (chonk: string) => {
                let cmd: CommandOutput = JSON.parse(chonk);

                if (cmd.success === false) {
                    this._error = (cmd as CommandOutputError).error;
                    resolve();
                } else {
                    resolve(cmd as CommandToOutput<T>);
                }
            });

            let gonna_write = JSON.stringify(command) + '\n';
            this.yyBossHandle.stdin.write(gonna_write);
            this._error = undefined;
        });
    }

    /**
     * Shuts the YyBoss down internally, and safely. Callbacks attached with `YyBoss.attachUnexpectedShutdownCallback`
     * will **not** be called.
     */
    public shutdown(): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                let output: Output = JSON.parse(chonk);
                if (output.success) {
                    this._closureStatus = ClosureStatus.ExpectedShutdown;
                }

                resolve(output);
            });

            this.yyBossHandle.stdin.write(JSON.stringify(new ShutdownCommand()) + '\n');
        });
    }

    /**
     * Attaches a callback to be fired when an unexpected shutdown occurs.
     *
     * This isn't an excellent design, so please submit a PR or an issue if you know
     * a better, more idiomatic way to handle this.
     *
     * @param cback The callback to fire when an unexpected shutdown occurs.
     */
    public attachUnexpectedShutdownCallback(cback: () => Promise<void>) {
        this.onUnexpectedShutdown.push(cback);
    }

    /**
     * Downloads a YyBoss from the Github release pages to a directory of a users choosing. This allows
     * downstream crates to avoid packaging the server exe with them. Thanks to Sidorakh for contributing
     * this work!
     *
     * @param bossDirectory The directory to download the YyBoss to. The filename will depend on the version
     * of the boss.
     * @param force If true, forces a download of a new YyBoss, even if the current boss is of the correct
     * version number.
     */
    public static async fetchYyBoss(bossDirectory: string, force?: boolean | undefined): Promise<string> {
        // Fetches a compatible release of YYBoss from Github
        async function download(url: string, dest: string): Promise<void> {
            const response = await AXIOS.get(url, { responseType: 'stream' });
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

    /**
     * Checks if a YyBoss is at the given path, and if it is the correct version. This is basically
     * the first half of `fetch`, and it should be merged together in some subroutine somehow.
     *
     * @param bossDirectory The directory to downlad the YyBoss to. The Filename will depend on the version
     * of the boss.
     */
    public static async downloadStatus(bossDirectory: string): Promise<YyBossDownloadStatus> {
        // resolve it to the full path...not really necessary, but good for debugging
        bossDirectory = path.resolve(bossDirectory);

        // make sure the directory is valid, so we can write and read below
        await fs.ensureDir(bossDirectory);

        let bosspath = undefined;

        if (process.platform == 'win32') {
            bosspath = path.join(bossDirectory, 'yy-boss-cli.exe');
        } else if (process.platform == 'darwin') {
            bosspath = path.join(bossDirectory, 'yy-boss-cli_darwin');
        } else {
            throw 'Fetch does not have support for Linux!';
        }

        if (!fs.existsSync(bosspath)) {
            return YyBossDownloadStatus.NoBoss;
        } else {
            const output = this.getVersion(bosspath);
            if (output !== CURRENT_VERSION) {
                return YyBossDownloadStatus.IncorrectVersion;
            } else {
                return YyBossDownloadStatus.Success;
            }
        }
    }

    public static getVersion(yyBossPath: string): string | undefined {
        try {
            const yyBossVersionCheck = spawnSync(yyBossPath, ['-v']);
            return yyBossVersionCheck.stdout.toString().replace(/[a-z-]*\s/g, '');
        } catch (_) {
            return undefined;
        }
    }
}
