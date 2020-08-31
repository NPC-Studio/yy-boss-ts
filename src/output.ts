export interface Output {
    type: OutputType;
    success: Boolean;
    error: String | undefined;
}

export enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}
