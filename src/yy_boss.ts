import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { YY_BOSS_PATH } from "./boss_path";

export class YyBoss {
    yyBossHandle: ChildProcessWithoutNullStreams;

    constructor(yypPath: string, wd: string) {
        this.yyBossHandle = spawn(YY_BOSS_PATH, [yypPath, wd]);

        this.yyBossHandle.stdout.addListener("data", () => {
            
        });
    }
}