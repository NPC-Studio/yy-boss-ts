import { Command, CommandType, Resource, ViewPath, CommandOutput } from './core';

export enum UtilitiesCommandType {
    Create = 'Create',
    PrettyEventNames = 'PrettyEventNames',
    ScriptGmlPath = 'ScriptGmlPath',
    EventGmlPath = 'EventGmlPath',
}

abstract class UtilitiesCommand extends Command {
    protected type: CommandType = CommandType.Utilities;
    protected abstract subCommand: UtilitiesCommandType;
}

export class CreateCommand extends UtilitiesCommand {
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
}
