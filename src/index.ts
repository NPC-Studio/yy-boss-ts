import 'child_process';
import { spawn } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, OutputType } from './yy_boss_typings';

const yy_boss_handle = spawn(YY_BOSS_PATH, ['examples/test_proj/test_proj.yyp', 'examples/wd']);

yy_boss_handle.stdout.on('data', (data: string) => {
    let parse: Output = JSON.parse(data);
    console.log(parse);
});

yy_boss_handle.stderr.on('data', data => {
    console.log(data.toString());
});
