import {
    Command,
    CommandType,
    ResourceCommandType,
    Resource,
    NewResource,
    CommandOutput,
    SerializedData,
} from './core';

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
    private newResource: NewResource;

    constructor(resource: Resource, newResource: NewResource) {
        super(resource);

        this.newResource = newResource;
    }
}

export class RemoveResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Remove;
    protected identifier: String;

    constructor(resource: Resource, identifier: String) {
        super(resource);
        this.identifier = identifier;
    }
}

export class GetResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Get;
    protected identifier: String;

    constructor(resource: Resource, identifier: String) {
        super(resource);
        this.identifier = identifier;
    }
}

export class ExistsResource extends ResourceCommand {
    protected subCommand: ResourceCommandType = ResourceCommandType.Exists;
    protected identifier: String;

    constructor(resource: Resource, identifier: String) {
        super(resource);
        this.identifier = identifier;
    }
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
