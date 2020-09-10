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

    public static error(v: YypBossError): string {
        switch (v.type) {
            case YypBossErrorType.CouldNotReadCommand:
            case YypBossErrorType.ResourceManipulation:
            case YypBossErrorType.FolderGraphError:
            case YypBossErrorType.YyParseError:
            case YypBossErrorType.AssociatedDataParseError:
            case YypBossErrorType.CouldNotOutputData:
            case YypBossErrorType.CouldNotSerializeYypBoss:
                const value:
                    | CouldNotReadCommand
                    | ResourceManipulation
                    | FolderGraphError
                    | YyParseError
                    | AssociatedDataParseError
                    | CouldNotOutputData
                    | CouldNotSerializeYypBoss = v as CouldNotReadCommand;

                return `${v.type}, ${value.data}`;

            case YypBossErrorType.InternalError:
                const value_internal = v as InternalError;
                let err;
                if (value_internal.fatal) {
                    err = 'was fatal';
                } else {
                    err = 'was not fatal';
                }

                return `${value_internal.type}, ${err}`;
        }
    }
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

export abstract class FolderGraphError extends YypBossError {
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
