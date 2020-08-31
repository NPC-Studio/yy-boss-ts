import { YyBoss } from './yy_boss';
import { YYP_PATH, WD_PATH } from './config';
import { CreateFolderVfs, SerializationCommand, ShutdownCommand } from './input';
import { assert } from 'console';
import { exit } from 'process';

async function create_yy_boss(): Promise<YyBoss> {
    const [status, yy_boss] = await YyBoss.create(YYP_PATH, WD_PATH);

    if (status.success) {
        console.log('Succesfully started up!');

        return yy_boss as YyBoss;
    } else {
        console.log(`Error on startup ${JSON.stringify(status, undefined, 4)}`);
        exit();
    }
}

async function main() {
    const yyp_boss = await create_yy_boss();

    assert(yyp_boss.hasClosed == false, 'huh');

    await yyp_boss.writeCommand(new CreateFolderVfs('folders/Test.yy', 'Test2'));
    await yyp_boss.writeCommand(new SerializationCommand());
    await yyp_boss.shutdown();

    assert(yyp_boss.hasClosed, 'should be closed..');
    console.log('Goodbye!');
}

main();
