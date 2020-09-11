import { Output, OutputType } from './core';

export class StartupOutputSuccess extends Output {
    get type(): OutputType {
        return OutputType.Startup;
    }
    get success(): boolean {
        return true;
    }
}

export class StartupOutputError extends Output {
    get type(): OutputType {
        return OutputType.Startup;
    }
    startupError: string;

    get success(): boolean {
        return false;
    }

    constructor(error: string) {
        super();
        this.startupError = error;
    }
}
