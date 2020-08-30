import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, Input, OutputType } from './yy_boss_typings';
import { assert } from 'console';

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;

    private constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;
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

    writeCommand(command: Input): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once('data', chonk => {
                var output: Output = JSON.parse(chonk);
                resolve(output);
            });

            this.yyBossHandle.stdin.write(JSON.stringify(command));
        });
    }
}
