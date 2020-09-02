import { Command, CommandType } from './core';

export class SerializationCommand extends Command {
    protected type: CommandType = CommandType.Serialize;
}
