// const Discord = require('discord.js');
import Discord from 'discord.js';
import { EventEmitter } from 'events';
import { prefix } from './config';

import CommandPing from './commands/ping';

/*
const discordClient = new Discord.Client();

// Connection status
discordClient.once('ready', () => {
  console.log('Discord client connected');
});

// Message mapper
discordClient.on('message', message => {
  // parseMessageContent(eventManager, message);
  // console.log(message);

  if (message.content === 'el tarro') {
    // send back "Pong." to the channel the message was sent in
    // message.channel.send('Pong.');
    message.reply('hola');
  }

  if (message.content === 'el tarro saluda') {
    // send back "Pong." to the channel the message was sent in
    message.channel.send('Me saqué la chucha.');
  }
});*/

interface Command {
  name: string,
  description: string,
  execute: (msg: Discord.Message, args: string[]) => void,
};

export class DiscordImplementation {
  private eventManager: EventEmitter;
  private client: Discord.Client = new Discord.Client();
  private commands: Discord.Collection<string, Command> = new Discord.Collection<string, Command>();

  constructor(eventManager: EventEmitter) {
    this.eventManager = eventManager;
    
    this.registerCommands([
      CommandPing,
    ]);

    this.handleEvents();
    this.start();
  }

  start() {
    this.client.login(process.env.DISCORD_TOKEN);
    console.log('Discord client connected to server');
  }

  registerCommands(commands: Command[]) {
    for(const command of commands) {
      this.commands.set(command.name, command);
      console.log(command.name + ' registered');
    }
  }

  handleEvents() {
    this.client.once('ready', () => {
      console.log('Discord client is ready and listening');
      this.eventManager.emit('ready');
    });

    this.client.on('message', this.processCommand.bind(this));
    console.log(this.commands);
  }

  processCommand(message: Discord.Message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	  const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    console.log(command);
    console.log(this.commands);
    switch(command) {
      case 'ping':
        this.commands.get(command).execute(message, args);
        break;
    }
  }
};
