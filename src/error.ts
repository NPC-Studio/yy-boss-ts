import { exit } from 'process';
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
    protected abstract type: YypBossErrorType;
}

export class CouldNotReadCommand extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.CouldNotReadCommand;
    constructor(public data: String) {
        super();
    }
}

export class ResourceManipulation extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.ResourceManipulation;
    constructor(public resourceManipulationError: resourceManipulationErrors.ResourceManipulationError) {
        super();
    }
}

export class FolderGraphError extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.ResourceManipulation;
    constructor(folderGraphError: never) {
        // A WHOLE THING
        super();
    }
}

export class YyParseError extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.YyParseError;
    constructor(public data: String) {
        super();
    }
}

export class AssociatedDataParseError extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.AssociatedDataParseError;
    constructor(public data: String) {
        super();
    }
}

export class CouldNotOutputData extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.CouldNotOutputData;
    constructor(public data: String) {
        super();
    }
}

export class CouldNotSerializeYypBoss extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.CouldNotSerializeYypBoss;
    constructor(public data: String) {
        super();
    }
}

export class InternalError extends YypBossError {
    protected type: YypBossErrorType = YypBossErrorType.InternalError;
    constructor(public fatal: Boolean) {
        super();
    }
}

export module resourceManipulationErrors {
    export enum ResourceManipulationErrorType {
        FolderGraphError = 'FolderGraphError',
        BadAdd = 'BadAdd',
        BadGet = 'BadGet',
        InternalError = 'InternalError',
    }

    export abstract class ResourceManipulationError {
        protected abstract type: ResourceManipulationErrorType;
    }

    export class FolderGraph extends ResourceManipulationError {
        protected type = ResourceManipulationErrorType.FolderGraphError;
        // other stuff!
    }

    export class BadAdd extends ResourceManipulationError {
        protected type = ResourceManipulationErrorType.BadAdd;
        constructor(public existingResource: Resource) {
            super();
        }
    }

    export class BadGet extends ResourceManipulationError {
        protected type = ResourceManipulationErrorType.BadGet;
    }

    export class InternalError extends ResourceManipulationError {
        protected type = ResourceManipulationErrorType.BadAdd;
    }
}

export module fodlerGraphErrors {
    
}