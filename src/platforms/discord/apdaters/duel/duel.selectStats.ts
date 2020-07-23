import Discord from 'discord.js';
import Player from "../../../../core/Player";
import PlayerStats from "../../../../interfaces/interface.player.stats";
import MatchState from "../../../../core/MatchState";
import { table } from "table";

const options = ['🍩', '🍖', '🍔', '🍟', '🍬'];

const statsTable = (eligibleStats: PlayerStats[]) => {
  const header = ['', 'str', 'dex', 'int'];
  
  const entries = eligibleStats.reduce((carry: any, current: PlayerStats, index: number) => {
    carry.push([options[index], current.str, current.dex, current.int]);
    return carry;
  }, [header]);

  const transposed = entries[0].map(
    (_: any, colIndex: string | number) => 
      entries.map((row: { [x: string]: any; }) => row[colIndex])
    );
  
  return transposed;
}

const askForSelection = async (player: Player, message: Discord.Message): Promise<PlayerStats> => {
    const statsEntries = statsTable(player.eligibleStats);
    const statsSelection = table(statsEntries);
    const msg = await message.channel.send(`Choose your stats by reacting to this message <@${player.id}>\`\`\`${statsSelection}\`\`\``);

    for (let i=0; i < statsEntries.length - 1; i++) {
      msg.react(options[i]);
    }

    // await new ReactionAwaiter(msg);
    return new Promise((resolve, reject) => {
      resolve(player.eligibleStats[0]);
    });
}

export default async (player: Player, state: MatchState) =>
  askForSelection(player, state.context);