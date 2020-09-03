import { YyBoss } from './yy_boss';
import { YYP_PATH, WD_PATH } from './config';
import { exit } from 'process';
import { CreateFolderVfs, CreatedFolderOutput } from './vfs';
import { SerializationCommand } from './serialization';
import {
    CommandOutputSuccessVoid,
    Resource,
    SerializedData,
    SerializedDataDefault,
    SerializedDataType,
    SerializedDataValue,
    OutputType,
} from './core';
import { CommandOutputError } from './error';
import { AddResource } from './resource';
import { CreateCommand } from './create';
import { assert } from 'console';

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

    // STEP 1: CREATE A NEW SCRIPTS FOLDER
    let new_folder = await yyp_boss.writeCommand(new CreateFolderVfs('folders', 'Scripts'));

    // STEP 2.0: ASK THE YYBOSS TO MAKE A SCRIPT.YY FILE FOR US.
    // This doesn't commit it to the project -- it just makes the file for us. We tell it to customize it a bit though,
    // with a name, "YyBossProof", and tell it to make its path to the folder we just made
    let new_script_yy_file = await yyp_boss.writeCommand(
        new CreateCommand(Resource.Script, 'YyBossProof', new_folder.createdFolder)
    );

    /// STEP 2.1: WE MAKE A GML SCRIPT TOO. IT'S A GOOD ONE
    let new_script = `var x = "check it out guys, making a script from outside Gms2.";
var y = "probably you'll not be creating these manually like this, but just moving things around."
var z = "if that becomes common though, I'll add better support for that eventually";

show_debug_message("booyah")`;

    /// STEP 2.2: WE CREATE THE COMMAND TO ACTUALLY ADD THE RESOURCE TO THE PROJECT
    let new_resource_cmd = new AddResource(
        Resource.Script,
        new_script_yy_file.resource,
        new SerializedDataValue(new_script)
    );
    /// WE HANDLE ERRORS WITH AN OPTIONAL CALLBACK!
    let output = await yyp_boss.writeCommand(new_resource_cmd, err => console.log(err));

    /// STEP 3: SERIALIZE OUR CHANGES WE'VE MADE
    await yyp_boss.writeCommand(new SerializationCommand());

    /// STEP 4: SHUT IT DOWN...
    let _shutdown: CommandOutputSuccessVoid = await yyp_boss.shutdown();

    console.log('Goodbye!');
}

main();
