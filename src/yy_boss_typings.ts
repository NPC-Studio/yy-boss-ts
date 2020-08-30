export enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}

export interface Output {
    type: OutputType;
    success: Boolean;
    error: String | undefined;
}

export interface Input {
    okay: number
}