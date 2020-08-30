import 'child_process';
import { YyBoss } from './yy_boss';
import { YYP_PATH, WD_PATH } from './config';

async function main() {
    const [output, maybe_yyp_boss] = await YyBoss.create(YYP_PATH, WD_PATH);

    if (output.success) {
        const yyp_boss: YyBoss = maybe_yyp_boss as YyBoss;
        console.log('Succesfully started up!');
    } else {
        console.log(`Error on startup ${JSON.stringify(output, undefined, 4)}`);
    }
}

main();
