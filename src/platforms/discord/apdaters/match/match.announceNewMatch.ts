import Discord from 'discord.js';
import MatchState from "../../../../core/MatchState";
import { table } from "table";

const announceNewMatch = async (matchState: MatchState): Promise<any> => {
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
};
  
export default async (state: MatchState) =>
  announceNewMatch(state);
