export const enum CommandType {
    Resource = 'Resource',
    VirtualFileSystem = 'VirtualFileSystem',
    Utilities = 'Utilities',
    Serialize = 'Serialize',
    Shutdown = 'Shutdown',
}

export abstract class Command {
    protected abstract type: CommandType;
}

export interface ViewPath {
    name: string;
    path: string;
}

export interface FilesystemPath {
    name: string;
    path: string;
}

export const enum Resource {
    Sprite = 'Sprite',
    Script = 'Script',
    Object = 'Object',
}

export const enum SerializedDataType {
    Value = 'Value',
    Filepath = 'Filepath',
    DefaultValue = 'DefaultValue',
}

export abstract class SerializedData {
    abstract dataType: SerializedDataType;
}

export class SerializedDataValue extends SerializedData {
    dataType: SerializedDataType = SerializedDataType.Value;
    data: string;

    constructor(data: string) {
        super();
        this.data = data;
    }
}

export class SerializedDataFilepath extends SerializedData {
    dataType: SerializedDataType = SerializedDataType.Filepath;
    protected data: string;

    constructor(filepath: string) {
        super();
        this.data = filepath;
    }
}

export class SerializedDataDefault extends SerializedData {
    dataType: SerializedDataType = SerializedDataType.DefaultValue;
}

export abstract class Output {
    abstract type: OutputType;
    abstract success: boolean;
}

export const enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}

export const enum Item {
    Folder = 'Folder',
    Resource = 'Resource',
}

export abstract class CommandOutput extends Output {
    get type(): OutputType {
        return OutputType.Command;
    }
    get success(): boolean {
        return true;
    }
}

export class CommandOutputSuccessVoid extends CommandOutput {}
