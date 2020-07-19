import Discord from 'discord.js';
import Platform from "../../interfaces/Platform";
import MatchManager from "../../core/MatchManager";
import Player from "../../core/Player";
import { table } from "table";
import Match from '../../core/Match';

export default class PlatformAdapter implements Platform {
  private matchManager: MatchManager;
  private match: Match;
  
  constructor(matchManager: MatchManager) {
    this.matchManager = matchManager;
  }
  
  createMatch(player1: any, player2: any, context:any) {
    this.match = this.matchManager.createMatch({player1, player2, context, platform: this });
  }

  async announceFigthBegan(player1: Player, player2: Player) {
    const discordChannel = this.matchManager.findMatchByPlayer(player1).context.channel;

    // Announce new fight
    const vs = table([[player1.name, 'vs', player2.name]]);
    const announcement = `New Fight!\n${vs}\nBegin?`;
    const message: Discord.Message = await discordChannel.send(announcement, {
      code: true,
    });

    // Prepare reaction button
    await message.react('👍');

    // Filter for players on match
    const filter = (reaction: any, user: Discord.User) => {
      return reaction.emoji.name === '👍' && 
        (user.id === player1.id || user.id === player2.id);
    };

    // Create reaction collector
    const collector = message.createReactionCollector(filter, { 
      max: 3,
      time: 5000,
    });

    // Wait for responses
    return new Promise((resolve, reject) => {
      collector.on('collect', (reaction: Discord.MessageReaction) => {
        if (reaction.count === 2) {
          resolve();
        }
      });

      collector.on('end', collected => {
        if (collected.size < 3) {
          reject('your opponent its a 🐣. Shame.');
        }
      });
    });
  }

  async announceFightError(error: string) {
    const discordChannel = this.match.context.channel;
    await discordChannel.send(error);
  }

};