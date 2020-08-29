import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, Input } from './yy_boss_typings';

export class YyBoss {
    private yyBossHandle: ChildProcessWithoutNullStreams;

    constructor(yypPath: string, wd: string) {
        this.yyBossHandle = spawn(YY_BOSS_PATH, [yypPath, wd]);
    }

    writeCommand(
        command: Input,
    ): Promise<Output> {
        return new Promise((resolve, _) => {
            this.yyBossHandle.stdout.once("data", chonk => {
                var output: Output = JSON.parse(chonk);
                resolve(output);
            });

            this.yyBossHandle.stdin.write(JSON.stringify(command));
        });
    }
}
