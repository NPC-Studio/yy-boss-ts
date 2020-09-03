import { Command, CommandType, Resource, ViewPath } from './core';

export class CreateCommand extends Command {
    protected type: CommandType = CommandType.Create;
    constructor(private resource: Resource, private name?: string, private parent?: ViewPath) {
        super();
    }
}
