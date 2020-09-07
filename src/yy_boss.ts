import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput } from './core';
import { ShutdownCommand } from './shutdown';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError } from './error';
import * as path from 'path';
import { stdout } from 'process';
import { StartupOutputError } from './startup';

const CURRENT_VERSION = 'yy-boss 0.4.4';

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

export enum Log {
    DoNotLog,
    LogToFile,
    LogToStdErr,
}

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;
    private closureStatus: Boolean;
    error: CommandOutputError | undefined;

    get hasError(): Boolean {
        return this.error !== undefined;
    }

    get hasClosed(): Boolean {
        return this.closureStatus;
    }

    private constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;
        this.closureStatus = false;

        yyBossHandle.on('close', code => {
            console.log(`Yy-Boss has shut down! Exited with ${code}`);
        });
        yyBossHandle.stderr.pipe(stdout);
    }

    static async create(
        yyBossPath: string,
        yypPath: string,
        wd: string,
        log?: Logging | undefined
    ): Promise<[Output, YyBoss | undefined]> {
        yypPath = path.resolve(yypPath);
        wd = path.resolve(wd);

        let yyBossVersionCheck = spawnSync(yyBossPath, ['-v']);
        let output = yyBossVersionCheck.stdout.toString();
        if (output !== CURRENT_VERSION) {
            return [
                new StartupOutputError('incorrect version of yy-boss exe given. we need 0.4.4'),
                undefined,
            ];
        }

        let args = [yypPath, wd];

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
}
