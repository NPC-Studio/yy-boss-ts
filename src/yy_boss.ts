import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { assert } from 'console';
import { Output, OutputType, Command, CommandOutput } from './core';
import { ShutdownCommand } from './shutdown';
import { CommandToOutput } from './input_to_output';
import { CommandOutputError } from './error';
import * as path from 'path';
import { stdout } from 'process';

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;
    private closureStatus: Boolean;
    error: CommandOutputError | undefined;

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

    writeCommand<T extends Command>(command: T): Promise<CommandToOutput<T>> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', (chonk: string) => {
                console.log(chonk.toString());
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
            console.log(`command written, ${gonna_write}`);
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

            this.yyBossHandle.stdin.write(JSON.stringify(new ShutdownCommand()));
            this.yyBossHandle.stdin.write('\n');
        });
    }

    static create(yyBossPath: string, yypPath: string, wd: string): Promise<[Output, YyBoss | undefined]> {
        yypPath = path.resolve(yypPath);
        wd = path.resolve(wd);

        let yyBossHandle = spawn(yyBossPath, [yypPath, wd]);

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
}
