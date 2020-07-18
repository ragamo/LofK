import Discord from 'discord.js';
import { EventEmitter } from 'events';
import DiscordCommand from '../../interfaces/interface.discord.command';
import PingCommand from './commands/PingCommand';
import FightCommand from './commands/FightCommand';
import StatSelection from './commands/StatsSelection';
import IPlatform from '../../interfaces/IPlatform';

export class DiscordImplementation implements IPlatform {
  private prefix:string = '!';
  private eventManager: EventEmitter;
  private client: Discord.Client = new Discord.Client();
  private commands: Discord.Collection<string, DiscordCommand> = new Discord.Collection<string, DiscordCommand>();

  /**
   * Constructor
   */
  constructor(eventManager: EventEmitter) {
    this.eventManager = eventManager;
    
    this.registerCommands([
      new PingCommand(),
      new FightCommand(),
    ]);

    this.handleDiscordEvents();
    this.handleLofkEvents();
    this.start();
  }

  /**
   * Launch implementation by connecting to server
   */
  public start() {
    this.client.login(process.env.DISCORD_TOKEN);
    console.log('🧐 Discord client connected to server');
  }

  /**
   * Register bot commands
   * @param commands 
   */
  private registerCommands(commands: DiscordCommand[]) {
    for(const command of commands) {
      this.commands.set(command.name, command);
      console.log(`🏷  ${command.name} command registered`);
    }
  }

  /**
   * Handle discord events
   */
  private handleDiscordEvents() {
    // Ready
    this.client.once('ready', () => {
      console.log('🙂 Discord client is ready and listening');
      this.eventManager.emit('ready');
    });

    // Message
    this.client.on('message', this.processRequest.bind(this));
  }

  /**
   * Parse a message string and indentify the command with args
   * @param message discord chat message
   */
  private parseCommand(message: string) {
    const args = message.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    return { command, args };
  }

  /**
   * Detect which command was invoked and execute it
   * @param message incomming message
   */
  private processRequest(message: Discord.Message) {
    if (!message.content.startsWith(this.prefix) || message.author.bot) 
      return;

    const { command } = this.parseCommand(message.content);

    if (!this.commands.has(command)) 
      return;

    try {
      this.commands.get(command).execute(message, this.eventManager);
    } catch (err) {
      console.error(err);
    }
  }

  /** 
   * Handle game events
   */
  private handleLofkEvents() {
    const statSelector = new StatSelection(this.eventManager);
    this.eventManager.on('selectStats', statSelector.execute.bind(statSelector));
  }
};
