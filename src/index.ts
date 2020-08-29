import 'child_process';
import { spawn } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, OutputType, Input } from './yy_boss_typings';
import { YyBoss, createYypBoss } from './yy_boss';

async function main() {
    const yy_boss_handle = await createYypBoss('examples/test_proj/test_proj.yyp', 'examples/wd');
}

main();
