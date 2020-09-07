import { SerializationCommand } from './serialization';
import { ShutdownCommand } from './shutdown';
import {
    AddResource,
    RemoveResource,
    GetResource,
    ExistsResource,
    outputs as resourceOutputs,
    GetAssociatedDataResource,
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
} from './vfs';
import { CommandOutputSuccessVoid, Command } from './core';
import { CreateCommand, PrettyEventNames, outputs as utilOutputs } from './utilities';

// prettier-ignore
export type CommandToOutput<T extends Command> = T extends
    // Returns for Nulls
    SerializationCommand
    | ShutdownCommand
    | AddResource
    | MoveResourceVfs
    | MoveFolderVfs
    | RemoveFolderVfs
    ? CommandOutputSuccessVoid

    // full returns
    : T extends RemoveResource
    ? resourceOutputs.ResourceFullDataOutput
    
    // pretty
    : T extends PrettyEventNames
    ? utilOutputs.PrettyEventOutput
    
    : T extends GetResource | CreateCommand
    ? resourceOutputs.ResourceDataOutput
    
    : T extends GetAssociatedDataResource
    ? resourceOutputs.ResourceAssociatedDataOutput

    
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

    // should never be seen!
    : never;
