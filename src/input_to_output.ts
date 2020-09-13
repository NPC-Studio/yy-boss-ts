import { SerializationCommand } from './serialization';
import {
    AddResource,
    RemoveResource,
    GetResource,
    ExistsResource,
    outputs as resourceOutputs,
    GetAssociatedDataResource,
    RenameResource,
} from './resource';
import {
    MoveResourceVfs,
    MoveFolderVfs,
    RemoveFolderVfs,
    CreateFolderVfs,
    GetFolderVfs,
    GetFullVfs,
    GetPathTypeVfs,
    outputs as vfsOutputs,
    RenameFolderVfs,
} from './vfs';
import { CommandOutputSuccessVoid, Command } from './core';
import {
    CreateResourceYyFile,
    PrettyEventNames,
    outputs as utilOutputs,
    ScriptGmlPath,
    EventGmlPath,
    CanUseResourceName,
    CanUseFolderName,
    CreateEvent,
    DeleteEvent,
} from './utilities';
import { utilities } from '.';

// prettier-ignore
export type CommandToOutput<T extends Command> = T extends
    // Returns for Nulls
    SerializationCommand
    | AddResource
    | MoveResourceVfs
    | MoveFolderVfs
    | RemoveFolderVfs
    | RenameFolderVfs
    | RenameResource
    | CreateEvent
    | DeleteEvent
    ? CommandOutputSuccessVoid

    // full returns
    : T extends RemoveResource
    ? resourceOutputs.ResourceFullDataOutput
    
    // pretty
    : T extends PrettyEventNames
    ? utilOutputs.PrettyEventOutput
    
    : T extends GetResource | CreateResourceYyFile
    ? resourceOutputs.ResourceDataOutput
    
    : T extends GetAssociatedDataResource
    ? resourceOutputs.ResourceAssociatedDataOutput
    
    : T extends ScriptGmlPath | EventGmlPath
    ? utilOutputs.RequestedPathOutput
    
    // returns for boolean exists
    : T extends ExistsResource
    ? resourceOutputs.ResourceExistsOutput
    
    // returns a path
    : T extends CreateFolderVfs
    ? vfsOutputs.CreatedFolderOutput
    
    // returns a folder graph
    : T extends GetFolderVfs | GetFullVfs
    ? vfsOutputs.FolderGraphOutput

    // returns a pathkind
    : T extends GetPathTypeVfs
    ? vfsOutputs.PathKindOutput
    
    : T extends CanUseResourceName | CanUseFolderName
    ? utilities.outputs.NameIsValidOutput

    // should never be seen!
    : never;
