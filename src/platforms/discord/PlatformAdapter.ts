import Discord from 'discord.js';
import Platform from "../../interfaces/Platform";
import MatchManager from "../../core/MatchManager";
import { table } from "table";
import MatchState from '../../core/MatchState';
import Match from '../../core/Match';

export default class PlatformAdapter implements Platform { // extends PlatformAdapter
  private matchManager: MatchManager;
  
  constructor(matchManager: MatchManager) {
    this.matchManager = matchManager;
  }
  
  createMatch(player1: any, player2: any, context:any) {
    try {
      const match = this.matchManager.createMatch({player1, player2, context, platform: this });
      match.begin();
    } catch ({ busyPlayer }) {
      context.reply(`<@${busyPlayer.id}> is already on a match.`);
    }
  }

  async announceNewMatch(matchState: MatchState) {
    const discordChannel = matchState.context.channel;

    // Announce new fight
    const vs = table([[matchState.player1.name, 'vs', matchState.player2.name]]);
    const announcement = `New Fight!\n${vs}\nBegin?`;
    const message: Discord.Message = await discordChannel.send(announcement, {
      code: true,
    });

    // Prepare reaction button
    await message.react('👍');

    // Collect for only players involved
    const filter = (reaction: any, user: Discord.User) => {
      return reaction.emoji.name === '👍' && 
        (user.id === matchState.player1.id || user.id === matchState.player2.id);
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

  announceFightError(matchState: MatchState, error: string) {
    const message = matchState.context;

    if (matchState.timeout) {
      message.reply(error);
      return;
    }

    message.channel.send(error);
  }

  finishMatch(idMatch: string) {
    this.matchManager.finishMatch(idMatch);
  }

};