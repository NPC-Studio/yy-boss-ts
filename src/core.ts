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

export interface ProjectMetadata {
    name: string;
    ideVersion: string;
    yypVersion: string;
    rootFile: ViewPath;
}

export enum Resource {
    Sprite = 'Sprite',
    Script = 'Script',
    Object = 'Object',
    Note = 'Note',
    Shader = 'Shader',
    AnimationCurve = 'AnimationCurve',
    Extension = 'Extension',
    Font = 'Font',
    Path = 'Path',
    Room = 'Room',
    Sequence = 'Sequence',
    Sound = 'Sound',
    TileSet = 'TileSet',
    Timeline = 'Timeline',
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
    data: string;

    constructor(data: string) {
        super();
        this.data = data;
    }
}

export class SerializedDataFilepath extends SerializedData {
    protected dataType: SerializedDataType = SerializedDataType.Filepath;
    data: string;

    constructor(filepath: string) {
        super();
        this.data = filepath;
    }
}

export class SerializedDataDefault extends SerializedData {
    protected dataType: SerializedDataType = SerializedDataType.DefaultValue;
}

export abstract class Output {
    abstract type: OutputType;
    abstract success: boolean;
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
    get success(): boolean {
        return true;
    }
}

export class CommandOutputSuccessVoid extends CommandOutput {}
