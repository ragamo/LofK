import Discord from 'discord.js';
import { table } from "table";
import DuelState from "../../../../modes/duel/DuelState";
import DuelWeapon from '../../../../modes/duel/DuelWeapon';
import { transposed, abilitiesMatrix } from '../../helpers/helper.duel';

const weaponsMatrix = (weapons: DuelWeapon[]) => {
  const weaponNames = [];
  const weaponAbilities = [];
  
  for(const weapon of weapons) {
    weaponNames.push(`${weapon.name} (${weapon.icon})`);
    weaponAbilities.push(table(transposed(abilitiesMatrix(weapon.abilities))).replace(/\n$/,''));
  }

  return [
    weaponNames,
    weaponAbilities,
  ];
};

const announceNewDuel = async (duelState: DuelState): Promise<any> => {
  const discordChannel: Discord.TextChannel = duelState.context.channel;
  
  // Generate vs table
  const vs = table([[`${duelState.player1.name}`, 'vs', `${duelState.player2.name}`]]);

  // Display weapons
  const weapons = table(weaponsMatrix(duelState.weapons));

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
