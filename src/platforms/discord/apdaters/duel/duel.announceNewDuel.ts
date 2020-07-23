import Discord from 'discord.js';
import DuelState from "../../../../modes/duel/DuelState";
import { table } from "table";

const options = ['🏹', '🗡', '🔪'];

const announceNewDuel = async (duelState: DuelState): Promise<any> => {
  const discordChannel = duelState.context.channel;
  
  // Generate vs table
  const vs = table([[duelState.player1.name, 'vs', duelState.player2.name]]);

  // Display weapons


  // Announce new fight
  const announcement = `New Fight!\n${vs}\nChoose your weapon`;
  const message: Discord.Message = await discordChannel.send(announcement, {
    code: true,
  });
  
  // Prepare reaction button
  await message.react('👍');
  
  // Collect for only players involved
  const filter = (reaction: any, user: Discord.User) => {
    return reaction.emoji.name === '👍' && 
    (user.id === duelState.player1.id || user.id === duelState.player2.id);
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
};
  
export default async (state: DuelState) =>
  announceNewDuel(state);
