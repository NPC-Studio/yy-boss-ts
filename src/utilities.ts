import { Command, CommandType, Resource, ViewPath, CommandOutput, ProjectMetadata } from './core';

export const enum UtilitiesCommandType {
    ProjectInfo = 'ProjectInfo',
    Create = 'Create',
    CreateEvent = 'CreateEvent',
    DeleteEvent = 'DeleteEvent',
    PrettyEventNames = 'PrettyEventNames',
    ScriptGmlPath = 'ScriptGmlPath',
    EventGmlPath = 'EventGmlPath',
    CanUseResourceName = 'CanUseResourceName',
    CanUseFolderName = 'CanUseFolderName',
    Crash = 'Crash',
}

abstract class UtilitiesCommand extends Command {
    protected type: CommandType = CommandType.Utilities;
    protected abstract subCommand: UtilitiesCommandType;
}

export class ProjectInfo extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.ProjectInfo;
}

export class CreateResourceYyFile extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.Create;

    constructor(private resource: Resource, private name?: string, private parent?: ViewPath) {
        super();
    }
}

export class PrettyEventNames extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.PrettyEventNames;

    constructor(private eventNames: string[]) {
        super();
    }
}

export class CreateEvent extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.CreateEvent;

    constructor(private identifier: string, private eventFileName: string) {
        super();
    }
}

export class DeleteEvent extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.DeleteEvent;

    constructor(private identifier: string, private eventFileName: string) {
        super();
    }
}

export class ScriptGmlPath extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.ScriptGmlPath;

    constructor(private scriptName: string) {
        super();
    }
}

export class EventGmlPath extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.EventGmlPath;

    constructor(private objectName: string, private eventFileName: string) {
        super();
    }
}

export class CanUseResourceName extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.CanUseResourceName;

    constructor(private identifier: string) {
        super();
    }
}

export class CanUseFolderName extends UtilitiesCommand {
    protected subCommand: UtilitiesCommandType = UtilitiesCommandType.CanUseFolderName;

    constructor(private parentFolder: string, private identifier: string) {
        super();
    }
}

export module outputs {
    export class PrettyEventOutput extends CommandOutput {
        constructor(public eventNames: string[]) {
            super();
        }
    }

    export class RequestedPathOutput extends CommandOutput {
        constructor(public requestedPath: string) {
            super();
        }
    }

    export class NameIsValidOutput extends CommandOutput {
        constructor(public nameIsValid: boolean) {
            super();
        }
    }

    export class ProjectMetadataOutput extends CommandOutput {
        constructor(public projectMetadata: ProjectMetadata) {
            super();
        }
    }
}
