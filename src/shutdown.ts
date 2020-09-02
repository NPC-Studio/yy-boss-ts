import { Command, CommandType } from './core';

export class ShutdownCommand extends Command {
    protected type: CommandType = CommandType.Shutdown;
}
