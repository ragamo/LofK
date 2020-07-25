import Discord from 'discord.js';
import DuelState from "../../../../modes/duel/DuelState";
import { transposed, playersMatrix } from '../../helpers/helper.duel';
import { table } from 'table';

const announceDuelDamage = async (duelState: DuelState, attackResult:any): Promise<any> => {
  const discordChannel = duelState.context.channel;

  // Announce the dmg done
  let announcement = '';

  const rollMap = attackResult.roll
    .map((r: number) => r === 1 ? '✅' : '❌')
    .join(', ');

  const hits = attackResult.roll.reduce((carry: number, current: number) => carry + current, 0);

  const critOrMiss = attackResult.isCritical
    ? '= CRITICAL 💥'
    : attackResult.isMiss 
      ? '= MISS' : '';

  announcement += `\`\`\``;
  announcement += `Roll: [${rollMap}] = ${hits}/${attackResult.roll.length} ${critOrMiss}\n`;
  announcement += `Damage dealt: ${attackResult.dmg}`;
  announcement += `\`\`\``;

  // Stats
  const duelStats = table(transposed(playersMatrix([duelState.player1, duelState.player2])));
  announcement += `\nCurrent stats\`\`\`${duelStats}\`\`\``;

  const message: Discord.Message = await discordChannel.send(announcement);
  return Promise.resolve();
};
  
export default async (state: DuelState, attackResult: any) =>
  announceDuelDamage(state, attackResult);
