import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './config';
import { assert } from 'console';
import { Output, OutputType, Command } from './core';
import { ShutdownCommand } from './shutdown';
import { CommandToOutput } from './input_to_output';

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
                var output: Output = JSON.parse(chonk);
                assert(output.type === OutputType.Startup);

                // output
                let yyp_boss = output.success ? new YyBoss(yyBossHandle) : undefined;

                resolve([output, yyp_boss]);
            });
        });
    }

    writeCommand<T extends Command>(command: T): Promise<CommandToOutput<T>> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                var output: CommandToOutput<T> = JSON.parse(chonk);

                resolve(output);
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
