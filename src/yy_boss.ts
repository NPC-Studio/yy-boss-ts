import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, Input, OutputType } from './yy_boss_typings';
import { assert } from 'console';

export function createYypBoss(yypPath: string, wd: string): Promise<[Output, YyBoss | undefined]> {
    let yyBossHandle = spawn(YY_BOSS_PATH, [yypPath, wd]);

    return new Promise((resolve, _) => {
        yyBossHandle.stdout.once('data', (chonk: string) => {
            // if we boof the command somehow, JSON.parse will throw
            var output: Output = JSON.parse(chonk);
            assert(output.type === OutputType.Startup);

            // output
            if (output.success) {
                resolve(new YyBoss(yyBossHandle));
            } else {
                reject(chonk);
            }
        });
    });
}

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;

    constructor(yyBossHandle: ChildProcessWithoutNullStreams) {
        this.yyBossHandle = yyBossHandle;
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
