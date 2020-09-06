import { Command, CommandType, Resource, ViewPath, CommandOutput, Item, FilesystemPath } from './core';

export enum VfsCommandType {
    MoveResource = 'MoveResource',
    MoveFolder = 'MoveFolder',
    CreateFolder = 'CreateFolder',
    RemoveFolder = 'RemoveFolder',
    GetFolder = 'GetFolder',
    GetFullVfs = 'GetFullVfs',
    GetPathType = 'GetPathType',
}

abstract class VfsCommand extends Command {
    protected type: CommandType = CommandType.VirtualFileSystem;
    protected abstract subCommand: VfsCommandType;
}

export class MoveResourceVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.MoveResource;

    private resourceToMove: string;
    private resource: Resource;
    private newParent: ViewPath;

    constructor(resourceToMove: string, resource: Resource, newParent: ViewPath) {
        super();
        this.resourceToMove = resourceToMove;
        this.resource = resource;
        this.newParent = newParent;
    }
}

export class MoveFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.MoveFolder;

    private folder: string;
    private newParent: ViewPath;

    constructor(folder: string, newParent: ViewPath) {
        super();
        this.folder = folder;
        this.newParent = newParent;
    }
}

export class CreateFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.CreateFolder;

    private parentFolder: string;
    private folderName: string;

    constructor(parentFolder: string, folderName: string) {
        super();
        this.parentFolder = parentFolder;
        this.folderName = folderName;
    }
}

export class RemoveFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.RemoveFolder;

    private folder: string;
    private recursive: Boolean;

    constructor(folder: string, recursive: Boolean) {
        super();
        this.folder = folder;
        this.recursive = recursive;
    }
}

export class GetFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.GetFolder;

    private folder: string;

    constructor(folder: string) {
        super();
        this.folder = folder;
    }
}

export class GetFullVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.GetFullVfs;
}

export class GetPathTypeVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.GetPathType;

    private path: ViewPath;

    constructor(path: ViewPath) {
        super();
        this.path = path;
    }
}

export module outputs {
    export class FolderGraphOutput extends CommandOutput {
        flatFolderGraph: FlatFolderGraph;

        constructor(folderGraph: FlatFolderGraph) {
            super();
            this.flatFolderGraph = folderGraph;
        }
    }

    export class PathKindOutput extends CommandOutput {
        constructor(public pathKind: Item) {
            super();
        }
    }

    export class CreatedFolderOutput extends CommandOutput {
        constructor(public createdFolder: ViewPath) {
            super();
        }
    }

    export interface FlatFolderGraph {
        readonly viewPath: ViewPath;
        readonly pathToParent: ViewPath | undefined;
        folders: ViewPath[];
        files: FlatResourceDescriptor[];
    }

    export interface FlatResourceDescriptor {
        filesystemPath: FilesystemPath;
        resourceDescriptor: ResourceDescriptor;
    }

    export interface ResourceDescriptor {
        resource: Resource;
        /** We don't use this at all right now. */
        order: number;
        parentLocation: string;
    }
}
