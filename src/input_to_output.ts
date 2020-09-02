import { SerializationCommand } from './serialization';
import { ShutdownCommand } from './shutdown';
import {
    AddResource,
    RemoveResource,
    GetResource,
    ResourceDataOutput,
    ExistsResource,
    ResourceExistsOutput,
} from './resource';
import {
    MoveResourceVfs,
    MoveFolderVfs,
    RemoveFolderVfs,
    CreateFolderVfs,
    CreatedFolderOutput,
    GetFolderVfs,
    GetFullVfs,
    FolderGraphOutput,
    GetPathTypeVfs,
} from './vfs';
import { CommandOutputSuccessVoid } from './core';

// prettier-ignore
export type CommandToOutput<T> = T extends
    // Returns for Nulls
    | SerializationCommand
    | ShutdownCommand
    | AddResource
    | MoveResourceVfs
    | MoveFolderVfs
    | RemoveFolderVfs
    ? CommandOutputSuccessVoid

    // returns for getters
    : T extends RemoveResource | GetResource
    ? ResourceDataOutput
    
    // returns for boolean exists
    : T extends ExistsResource
    ? ResourceExistsOutput
    
    // returns a path
    : T extends CreateFolderVfs
    ? CreatedFolderOutput
    
    // returns a folder graph
    : T extends GetFolderVfs | GetFullVfs
    ? FolderGraphOutput

    // returns a pathkind
    : T extends GetPathTypeVfs
    ? GetPathTypeVfs

    // should never be seen!
    : never;
