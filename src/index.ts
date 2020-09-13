import {
    ViewPath,
    Resource,
    SerializedDataDefault,
    SerializedDataFilepath,
    SerializedDataValue,
    FilesystemPath,
    CommandOutputSuccessVoid,
    Item,
} from './core';
import * as core from './core';
import * as utilities from './utilities';
import * as errors from './error';
import * as resourceCommand from './resource';
import * as serializationCommand from './serialization';
import * as startupOutput from './startup';
import * as vfsCommand from './vfs';
import { YyBoss } from './yy_boss';

export {
    // re-exports...
    core,
    utilities,
    errors,
    resourceCommand,
    serializationCommand,
    startupOutput,
    vfsCommand,
    // simple re-exports...
    YyBoss,
    ViewPath,
    Resource,
    SerializedDataDefault,
    SerializedDataFilepath,
    SerializedDataValue,
    FilesystemPath,
    CommandOutputSuccessVoid,
    Item,
};

/**
 * Creates a YyBoss, or throws an error on startup.
 * Use this as a convenient startup method, or invoke the YyBoss directly with `YyBoss.create`.
 */
export async function quickstartYyBoss(
    yyBossExePath: string,
    yypPath: string,
    workingDirectory: string
): Promise<YyBoss> {
    let [output, maybe_boss] = await YyBoss.create(yyBossExePath, yypPath, workingDirectory);

    if (output.success == false) {
        throw output;
    }

    return maybe_boss as YyBoss;
}
