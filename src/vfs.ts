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

    private resourceToMove: String;
    private resource: Resource;
    private newParent: ViewPath;

    constructor(resourceToMove: String, resource: Resource, newParent: ViewPath) {
        super();
        this.resourceToMove = resourceToMove;
        this.resource = resource;
        this.newParent = newParent;
    }
}

export class MoveFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.MoveFolder;

    private folder: String;
    private newParent: ViewPath;

    constructor(folder: String, newParent: ViewPath) {
        super();
        this.folder = folder;
        this.newParent = newParent;
    }
}

export class CreateFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.CreateFolder;

    private parentFolder: String;
    private folderName: String;

    constructor(parentFolder: String, folderName: String) {
        super();
        this.parentFolder = parentFolder;
        this.folderName = folderName;
    }
}

export class RemoveFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.RemoveFolder;

    private folder: String;
    private recursive: Boolean;

    constructor(folder: String, recursive: Boolean) {
        super();
        this.folder = folder;
        this.recursive = recursive;
    }
}

export class GetFolderVfs extends VfsCommand {
    protected subCommand: VfsCommandType = VfsCommandType.GetFolder;

    private folder: String;

    constructor(folder: String) {
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
        folderGraph: FolderGraph;

        constructor(folderGraph: FolderGraph) {
            super();
            this.folderGraph = folderGraph;
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

    export interface FolderGraph {
        name: string;
        pathToParent: string;
        tags: string[];
        order: number;
        folders: FolderGraph[];
        files: FilesystemPath[];
    }
}
