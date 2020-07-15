import { DiscordAPIError } from "discord.js";

export default {
	name: 'ping',
	description: 'Ping!',
	execute(message: any, args: any) {
		message.channel.send('Pong.');
	},
};
