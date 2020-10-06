import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput, CommandType } from './core';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError, YypBossError } from './error';
import * as path from 'path';
import { StartupOutputError } from './startup';
import { stdout } from 'process';
import { Fetch } from './fetch';

const CURRENT_VERSION = '0.4.8';

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
    Open = 'Open',
    ExpectedShutdown = 'ExpectedShutdown',
    UnexpectedShutdown = 'UnexpectedShutdown',
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
            if (this.closureStatus === ClosureStatus.Open) {
                this._closureStatus = ClosureStatus.UnexpectedShutdown;

                for (const cback of this.onUnexpectedShutdown) {
                    await cback();
                }
            }
            console.log(`${this._closureStatus} Shutdown: ${signal} ${code}`);
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

        if (Fetch.exeIsCurrent(yyBossPath, Fetch.YY_BOSS_CURRENT_VERSION) === false) {
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

            let instruction = JSON.stringify(command) + '\n';
            this.yyBossHandle.stdin.write(instruction);
            this._error = undefined;
        });
    }

    /**
     * Shuts the YyBoss down internally, and safely. Callbacks attached with `YyBoss.attachUnexpectedShutdownCallback`
     * will **not** be called.
     */
    public shutdown(): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', (chonk: Buffer) => {
                console.log('hello from the whatever');
                let output: Output = JSON.parse(chonk.toString());
                // commented out, this never returns control
                // commented in, this returns control
                // console.log('hello again friend');
                resolve(output);
            });

            this._closureStatus = ClosureStatus.ExpectedShutdown;
            const instruction = JSON.stringify(new ShutdownCommand()) + '\n';
            this.yyBossHandle.stdin.write(instruction);
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
}
