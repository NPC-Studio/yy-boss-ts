import 'child_process';
import { spawn } from 'child_process';
import { YY_BOSS_PATH } from './boss_path';
import { Output, OutputType, Input } from './yy_boss_typings';
import { YyBoss } from './yy_boss';

async function main() {
    const [output, maybe_yyp_boss] = await YyBoss.create(
        '/Users/jjspira/Documents/TypeScript/yy-boss-ts/test_proj/test_proj.yyp',
        '/Users/jjspira/Documents/TypeScript/yy-boss-ts/wd'
    );

    if (output.success) {
        const yyp_boss: YyBoss = maybe_yyp_boss as YyBoss;
        console.log('Succesfully started up!');
    } else {
        console.log(`Error on startup ${JSON.stringify(output)}`);
    }
}

main();
