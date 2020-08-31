export enum CommandType {
    Resource = 'Resource',
    VirtualFileSystem = 'VirtualFileSystem',
    Serialize = 'Serialize',
    Shutdown = 'Shutdown',
}

export enum ResourceCommandType {
    Add = 'Add',
    Remove = 'Remove',
    Get = 'Get',
    Exists = 'Exists',
}

export enum VfsCommandType {
    MoveResource = 'MoveResource',
    MoveFolder = 'MoveFolder',
    CreateFolder = 'CreateFolder',
    RemoveFolder = 'RemoveFolder',
    GetFolder = 'GetFolder',
    GetFullVfs = 'GetFullVfs',
    GetPathType = 'GetPathType',
}

export interface ViewPath {
    name: String;
    path: String;
}

export enum Resource {
    Sprite = 'Sprite',
    Script = 'Script',
    Object = 'Object',
}

export interface NewResource {
    new_resource: SerializedData;
    associated_data: SerializedData;
}

export enum SerializedDataType {
    Value = 'Value',
    Filepath = 'Filepath',
    DefaultValue = 'DefaultValue',
}

export abstract class SerializedData {
    protected abstract dataType: SerializedDataType;
}

export class SerializedDataValue extends SerializedData {
    protected dataType: SerializedDataType = SerializedDataType.Value;
    protected data: String;

    constructor(data: String) {
        super();
        this.data = data;
    }
}

export class SerializedDataFilepath extends SerializedData {
    protected dataType: SerializedDataType = SerializedDataType.Filepath;
    protected data: String;

    constructor(filepath: String) {
        super();
        this.data = filepath;
    }
}

export class SerializedDataDefault extends SerializedData {
    protected dataType: SerializedDataType = SerializedDataType.DefaultValue;
}

export abstract class Command {
    protected abstract type: CommandType;
}

export class SerializationCommand extends Command {
    protected type: CommandType = CommandType.Serialize;
}

export class ShutdownCommand extends Command {
    protected type: CommandType = CommandType.Shutdown;
}

abstract class ResourceCommand extends Command {
    protected type: CommandType = CommandType.Resource;
    protected abstract subCommand: ResourceCommandType;
    private resource: Resource;

    constructor(resource: Resource) {
        super();
        this.resource = resource;
    }
}

export class AddResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Add;
    private newResource: NewResource;

    constructor(resource: Resource, newResource: NewResource) {
        super(resource);

        this.newResource = newResource;
    }
}

export class RemoveResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Remove;
    protected identifier: String;

    constructor(resource: Resource, identifier: String) {
        super(resource);
        this.identifier = identifier;
    }
}

export class GetResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Get;
    protected identifier: String;

    constructor(resource: Resource, identifier: String) {
        super(resource);
        this.identifier = identifier;
    }
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
