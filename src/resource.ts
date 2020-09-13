import { Command, CommandType, Resource, CommandOutput, SerializedData, SerializedDataType } from './core';

export const enum ResourceCommandType {
    Add = 'Add',
    Remove = 'Remove',
    Rename = 'Rename',
    Get = 'Get',
    GetAssociatedData = 'GetAssociatedData',
    Exists = 'Exists',
}

abstract class ResourceCommand extends Command {
    protected type: CommandType = CommandType.Resource;
    protected abstract subCommand: ResourceCommandType;
    private resource: Resource;

    constructor(resource: Resource) {
        super();
        this.resource = resource;
    }
}

export class AddResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Add;
    private newResource: SerializedData;
    private associatedData: SerializedData;

    constructor(resource: Resource, newResource: SerializedData, associatedData: SerializedData) {
        super(resource);

        this.newResource = newResource;
        this.associatedData = associatedData;
    }
}

export class RemoveResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Remove;
    protected identifier: string;

    constructor(resource: Resource, identifier: string) {
        super(resource);
        this.identifier = identifier;
    }
}

export class RenameResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Rename;

    constructor(resource: Resource, protected identifier: string, protected newName: string) {
        super(resource);
    }
}

export class GetResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Get;
    protected identifier: string;

    constructor(resource: Resource, identifier: string) {
        super(resource);
        this.identifier = identifier;
    }
}

export class GetAssociatedDataResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.GetAssociatedData;

    constructor(resource: Resource, protected identifier: string, protected force: boolean) {
        super(resource);
    }
}

export class ExistsResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Exists;
    protected identifier: string;

    constructor(resource: Resource, identifier: string) {
        super(resource);
        this.identifier = identifier;
    }
}

export module outputs {
    export class ResourceExistsOutput extends CommandOutput {
        constructor(public exists: boolean) {
            super();
        }
    }

    export class ResourceFullDataOutput extends CommandOutput {
        constructor(public resource: SerializedData, public associatedData: SerializedData) {
            super();
        }
    }

    export class ResourceDataOutput extends CommandOutput {
        constructor(public resource: SerializedData) {
            super();
        }
    }

    export class ResourceAssociatedDataOutput extends CommandOutput {
        constructor(public associatedData: SerializedData) {
            super();
        }
    }
}
