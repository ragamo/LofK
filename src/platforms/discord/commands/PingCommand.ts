import Discord from 'discord.js';

export default class PingCommand {
	public name: string = 'ping';
	public description: string = 'Ping!';

	public execute(message: Discord.Message) {
		message.channel.send('Pong.');
	}
};
