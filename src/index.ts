import { YyBoss } from './yy_boss';
import { YYP_PATH, WD_PATH } from './config';
import { exit } from 'process';
import { CreateFolderVfs, CreatedFolderOutput } from './vfs';
import { SerializationCommand } from './serialization';
import { CommandOutputSuccessVoid } from './core';

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

    let _: CreatedFolderOutput = await yyp_boss.writeCommand(new CreateFolderVfs('folders/Test.yy', 'Test2'));
    let _sco: CommandOutputSuccessVoid = await yyp_boss.writeCommand(new SerializationCommand());
    let _shutdown: CommandOutputSuccessVoid = await yyp_boss.shutdown();

    console.log('Goodbye!');
}

main();
