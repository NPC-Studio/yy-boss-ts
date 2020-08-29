export enum OutputType {
    Startup,
    CommandOutput,
    Shutdown,
}

export interface Output {
    type: OutputType;
    success: Boolean;
    error: String | undefined;
}

export interface Input {
    okay: number
}