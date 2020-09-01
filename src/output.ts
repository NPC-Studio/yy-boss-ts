import { exit } from 'process';
import { SerializedData, ViewPath, Resource } from './input';

export enum OutputType {
    Startup = 'Startup',
    Command = 'Command',
    Shutdown = 'Shutdown',
}

export enum Item {
    Folder = 'Folder',
    Resource = 'Resource',
}

export abstract class Output {
    protected abstract type: OutputType;
    protected abstract success: Boolean;
}

export class StartupOutSuccess extends Output {
    protected type: OutputType = OutputType.Startup;
    protected success: Boolean = true;
}

export class StartupOutputError extends Output {
    protected type: OutputType = OutputType.Startup;
    protected success: Boolean = true;
    startupError: String;

    constructor(error: String) {
        super();
        this.startupError = error;
    }
}

abstract class CommandOutput extends Output {
    protected type: OutputType = OutputType.Command;
    protected success: Boolean = true;
}

export class ResourceExistsOutput extends CommandOutput {
    constructor(public exists: Boolean) {
        super();
    }
}

export class ResourceDataOutput extends CommandOutput {
    constructor(public resource: SerializedData, public associatedData: SerializedData) {
        super();
    }
}

export class FolderGraphOutput extends CommandOutput {
    folderGraph: never;

    constructor(folderGraph: never) {
        super();
        this.folderGraph = folderGraph;
    }
}

export class PathKindOutput extends CommandOutput {
    constructor(public pathKind: Item) {
        super();
    }
}

export class CreatedFolderOutput extends CommandOutput {
    constructor(public createdFolder: ViewPath) {
        super();
    }
}

export class CommandOutputError extends CommandOutput {
    protected success: Boolean = false;
    error: YypBossError;

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
    constructor(
        public resourceManipulationError: resourceManipulationErrors.ResourceManipulationError
    ) {
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
