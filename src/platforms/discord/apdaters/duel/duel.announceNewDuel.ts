import Discord from 'discord.js';
import { table } from "table";
import DuelState from "../../../../modes/duel/DuelState";
import DuelWeapon from '../../../../modes/duel/DuelWeapon';
import { transposed, playersMatrix, weaponsMatrix, weaponMatrix } from '../../helpers/helper.duel';

const announceNewDuel = async (duelState: DuelState): Promise<any> => {
  const discordChannel: Discord.TextChannel = duelState.context.channel;
  
  // Generate vs table
  const vs = table(transposed(playersMatrix([duelState.player1, duelState.player2])));

  const newFighters = `New Fight!\`\`\`${vs}\`\`\` \n`;
  // await discordChannel.send(newFighters);

  // Display weapons
  let weapons = '';
  for(const weapon of duelState.weapons) {
    weapons += table(weaponMatrix(weapon));
    weapons += '\n';
  }

  // Announce new fight
  const announcement = `New Fight!\`\`\`${vs}\`\`\`\nChoose your weapon\`\`\`${weapons}\`\`\``;
  const message: Discord.Message = await discordChannel.send(announcement);
  
  // Prepare reaction buttons
  for(const weapon of duelState.weapons) {
    await message.react(weapon.icon);
  }
  
  // Collect only for players involved
  const filter = (reaction: Discord.MessageReaction, user: Discord.User) => {
    return duelState.weapons.some(weapon => {
      return weapon.icon === reaction.emoji.name && 
        (user.id === duelState.player1.id || user.id === duelState.player2.id);
    });
  };
  
  // Create reaction collector
  const collector = message.createReactionCollector(filter, { 
    time: 45000,
  });
  
  
  let p1Weapon: DuelWeapon;
  let p2Weapon: DuelWeapon;

  // Wait for reactions
  return new Promise((resolve, reject) => {
    collector.on('collect', (reaction: Discord.MessageReaction, user: Discord.User) => {
      if (reaction.count > 1) {
        const selectedWeapon = duelState.weapons.find(weapon => 
          weapon.icon === reaction.emoji.name
        );

        if (user.id === duelState.player1.id) {
          p1Weapon = selectedWeapon;
        }

        if (user.id === duelState.player2.id) {
          p2Weapon = selectedWeapon;
        }

        if (p1Weapon && p2Weapon) {
          resolve([p1Weapon, p2Weapon]);
          collector.stop();
        }
      }
    });
    
    collector.on('end', collected => {
      if (collected.size < 3) {
        reject('your opponent its a 🐣.');
      }
    });
  });
};
  
export default async (state: DuelState) =>
  announceNewDuel(state);
