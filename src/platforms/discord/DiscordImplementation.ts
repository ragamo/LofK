import Discord from 'discord.js';
import { EventEmitter } from 'events';
import DiscordCommand from '../../interfaces/interface.discord.command';
import PingCommand from './commands/PingCommand';
import FightCommand from './commands/FightCommand';
import PlatformAdapter from './PlatformAdapter';

export class DiscordImplementation {
  private prefix:string = '!';
  private eventManager: EventEmitter;
  private client: Discord.Client = new Discord.Client();
  private commands: Discord.Collection<string, DiscordCommand> = new Discord.Collection<string, DiscordCommand>();

  /**
   * Constructor
   */
  constructor(platformAdapter: PlatformAdapter) {    
    this.registerCommands([
      new PingCommand(),
      new FightCommand(platformAdapter),
    ]);

    this.handleDiscordEvents();
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
      this.commands.get(command).execute(message);
    } catch (err) {
      console.error(err);
    }
  }
};
