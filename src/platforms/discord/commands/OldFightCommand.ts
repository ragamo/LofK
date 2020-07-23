import Discord from 'discord.js';
import PlatformAdapter from '../../../core/PlatformAdapter';

export default class FightCommand {
  public name: string = 'fight';
  public description: string = 'Start a new match';

  private platformAdapter: PlatformAdapter;

  constructor(platformAdapter: PlatformAdapter) {
    this.platformAdapter = platformAdapter;
  }

  public async execute(message: Discord.Message) {
    if (!message.mentions.users.size) {
      message.reply('you need to mention someone.');
      return;
    }

    // Obtain players info
    const author = message.author;
    const opponent = message.mentions.users.first();

    // Control self fighting
    /*
    if (author.id === opponent.id) {
      message.reply('the fight with yourself is already lost my friend.');
      return;
    }
    */

    // Control singularities
    if (opponent.bot) {
      message.reply('bots dont fight :(');
      return;
    }

    const player1 = {
      id: author.id,
      name: author.username,
    };

    const player2 = {
      id: opponent.id,
      name: opponent.username,
    };

    try {
      this.platformAdapter.match.createMatch({ 
        player1, 
        player2, 
        platform: this.platformAdapter, // TODO: mejorar esto
        context: message
      });
    } catch (err) {
      console.error(err);
      message.reply(err);
    }
  }
};
