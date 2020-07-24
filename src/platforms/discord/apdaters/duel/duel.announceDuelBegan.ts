import Discord from 'discord.js';
import DuelState from "../../../../modes/duel/DuelState";

const announceDuelBegan = async (duelState: DuelState): Promise<any> => {
  const discordChannel = duelState.context.channel;

  // Announce new fight
  const announcement = `<@${duelState.playerOnTurn.id}> begins.\n\nFight! 👊`;
  const message: Discord.Message = await discordChannel.send(announcement);

  return Promise.resolve();
};
  
export default async (state: DuelState) =>
  announceDuelBegan(state);
