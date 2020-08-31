import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './config';
import { Command, ShutdownCommand } from './input';
import { Output, OutputType } from './output';
import { assert } from 'console';

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

    writeCommand(command: Command): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                var output: Output = JSON.parse(chonk);

                resolve(output);
            });

            let c = JSON.stringify(command) + '\n';
            this.yyBossHandle.stdin.write(c);
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

            this.yyBossHandle.stdin.write(JSON.stringify(new ShutdownCommand()) + '\n');
        });
    }

    get hasClosed(): Boolean {
        return this.closureStatus;
    }
}
