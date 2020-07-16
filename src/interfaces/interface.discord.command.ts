import Discord from 'discord.js';

export default interface DiscordCommand {
    name: string,
    description: string,
    execute: (msg: Discord.Message, args: string[]) => void,
  };