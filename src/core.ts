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

export abstract class Command {
    protected abstract type: CommandType;
}

export interface ViewPath {
    name: String;
    path: String;
}

export interface FilesystemPath {
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

export abstract class Output {
    abstract type: OutputType;
    abstract success: Boolean;
}

export enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}

export enum Item {
    Folder = 'Folder',
    Resource = 'Resource',
}

export abstract class CommandOutput extends Output {
    get type(): OutputType {
        return OutputType.Command;
    }
    get success(): Boolean {
        return true;
    }
}

export class CommandOutputSuccessVoid extends CommandOutput {}
