import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './config';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput } from './core';
import { ShutdownCommand } from './shutdown';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError } from './error';
import { rejects } from 'assert';

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;
    private closureStatus: Boolean;

    private constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;
        this.closureStatus = false;

        yyBossHandle.on('close', code => {
            console.log(`Yy-Boss has shut down! Exited with ${code}`);
        });
    }

    static create(yypPath: string, wd: string): Promise<[Output, YyBoss | undefined]> {
        let yyBossHandle = spawn(YY_BOSS_PATH, [yypPath, wd]);

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

    writeCommand<T extends Command>(
        command: T,
        on_err?: (err: CommandOutputError) => void
    ): Promise<CommandToOutput<T>> {
        return new Promise((resolve, reject) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                let cmd: CommandOutput = JSON.parse(chonk);
                if (cmd.success == false) {
                    if (on_err !== undefined) {
                        on_err(cmd as CommandOutputError);
                        resolve();
                    } else {
                        reject('no error handler was given, but an error occured');
                    }
                } else {
                    resolve(cmd as CommandToOutput<T>);
                }
            });

            this.yyBossHandle.stdin.write(JSON.stringify(command));
            this.yyBossHandle.stdin.write('\n');
        });
    }

    shutdown(): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                var output: Output = JSON.parse(chonk);
                if (output.success) {
                    this.closureStatus = true;
                }

                resolve(output);
            });

            this.yyBossHandle.stdin.write(JSON.stringify(new ShutdownCommand()));
            this.yyBossHandle.stdin.write('\n');
        });
    }

    get hasClosed(): Boolean {
        return this.closureStatus;
    }
}
