import Discord from 'discord.js';
import { EventEmitter } from 'events';

export default class PingCommand {
	public name: string = 'ping';
	public description: string = 'Ping!';

	public execute(message: Discord.Message, eventManager: EventEmitter) {
		message.channel.send('Pong.');
	}
};
