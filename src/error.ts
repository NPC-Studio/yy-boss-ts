import { CommandOutput, Resource } from './core';

export class CommandOutputError extends CommandOutput {
    error: YypBossError;

    get success(): Boolean {
        return false;
    }

    constructor(error: YypBossError) {
        super();
        this.error = error;
    }
}

export enum YypBossErrorType {
    CouldNotReadCommand = 'CouldNotReadCommand',
    ResourceManipulation = 'ResourceManipulation',
    FolderGraphError = 'FolderGraphError',
    YyParseError = 'YyParseError',
    AssociatedDataParseError = 'AssociatedDataParseError',
    CouldNotOutputData = 'CouldNotOutputData',
    CouldNotSerializeYypBoss = 'CouldNotSerializeYypBoss',
    InternalError = 'InternalError',
}

export abstract class YypBossError {
    public abstract type: YypBossErrorType;
}

export class CouldNotReadCommand extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.CouldNotReadCommand;
    constructor(public data: string) {
        super();
    }
}

export class ResourceManipulation extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.ResourceManipulation;
    constructor(public data: string) {
        super();
    }
}

abstract class FolderGraphError extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.FolderGraphError;
    constructor(public data: string) {
        super();
    }
}

export class YyParseError extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.YyParseError;
    constructor(public data: string) {
        super();
    }
}

export class AssociatedDataParseError extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.AssociatedDataParseError;
    constructor(public data: string) {
        super();
    }
}

export class CouldNotOutputData extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.CouldNotOutputData;
    constructor(public data: string) {
        super();
    }
}

export class CouldNotSerializeYypBoss extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.CouldNotSerializeYypBoss;
    constructor(public data: string) {
        super();
    }
}

export class InternalError extends YypBossError {
    type: YypBossErrorType = YypBossErrorType.InternalError;
    constructor(public fatal: Boolean) {
        super();
    }
}
