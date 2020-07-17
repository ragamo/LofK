import Discord from 'discord.js';
import { EventEmitter } from 'events';

export default interface DiscordCommand {
    name: string,
    description: string,
    execute: (msg: Discord.Message, eventManager: EventEmitter) => void,
  };