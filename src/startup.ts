import { Output, OutputType } from './core';

export class StartupOutputSuccess extends Output {
    get type(): OutputType {
        return OutputType.Startup;
    }
    get success(): Boolean {
        return true;
    }
}

export class StartupOutputError extends Output {
    get type(): OutputType {
        return OutputType.Startup;
    }
    startupError: String;

    get success(): Boolean {
        return false;
    }

    constructor(error: String) {
        super();
        this.startupError = error;
    }
}
