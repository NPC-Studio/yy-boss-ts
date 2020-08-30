interface Output {
    type: OutputType;
    success: Boolean;
    error: String | undefined;
}

enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}

interface Command {
    type: CommandType;
    resourceCommandType: ResourceCommandType | undefined;
    resource: Resource | undefined;
}

enum CommandType {
    Resource = 'Resource',
    VirtualFileSystem = 'VirtualFileSystem',
}

enum ResourceCommandType {
    Add = 'Add',
    Remove = 'Remove',
    Get = 'Get',
    Exists = 'Exists',
}

enum Resource {
    Sprite = 'Sprite',
    Script = 'Script',
    Object = 'Object',
}

interface NewResource {}

enum SerializedDataType {
    Value = 'Value',
    Filepath = 'Filepath',
    DefaultValue = 'DefaultValue',
}

interface SerializedData {
    dataType: SerializedDataType;
}

export { OutputType, Output, Command, CommandType };
