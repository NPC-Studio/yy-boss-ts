import { Output, OutputType, ProjectMetadata } from './core';

export class StartupOutputSuccess extends Output {
    get type(): OutputType {
        return OutputType.Startup;
    }
    get success(): boolean {
        return true;
    }

    constructor(public projectMetadata: ProjectMetadata) {
        super();
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
