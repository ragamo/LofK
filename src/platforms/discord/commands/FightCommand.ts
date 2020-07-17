import Discord from 'discord.js';
import { EventEmitter } from 'events';
import { table } from 'table';

export default class FightCommand {
  public name: string = 'fight';
  public description: string = 'Start a new match';

  public async execute(message: Discord.Message, eventManager: EventEmitter) {
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

    // Control no sense fight
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

    // Initiat match state
    const matchState: any = {
      context: message,
      player1,
      player2,
    };  

    // Announce new fight
    const vs = table([[player1.name, 'vs', player2.name]]);
    const announcement = `New Fight!\n${vs}\nBegin?`;
    const msg = await message.channel.send(announcement, {
      code: true,
    });

    // Prepare react button
    msg.react('👍');

    // Wait for players ready
    const filter = (reaction: any, user: Discord.User) => {
      return reaction.emoji.name === '👍' && 
        (user.id === player1.id || user.id === player2.id);
    };

    const collector = msg.createReactionCollector(filter, { 
      max: 3,
      time: 10000,
    });

    collector.on('collect', (reaction: Discord.MessageReaction) => {
      if (reaction.count === 2) {
        eventManager.emit('createMatch', matchState);
      }
    });

    collector.on('end', collected => {
      if (collected.size < 3) {
        message.reply('your opponent its a 🐣. Shame.')
      }
    });
  }
};
