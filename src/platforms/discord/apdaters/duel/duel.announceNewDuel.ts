import Discord from 'discord.js';
import DuelState from "../../../../modes/duel/DuelState";
import { table } from "table";
import DuelWeapon, { DuelWeaponAbility } from '../../../../modes/duel/DuelWeapon';

const transposed = (entries: [[]]) => entries[0].map(
  (_: any, colIndex: string | number) => 
    entries.map((row: { [x: string]: any; }) => row[colIndex])
  );

const abilitiesMatrix = (abilities: DuelWeaponAbility[]) => {
  return abilities.reduce((carry: any, current: DuelWeaponAbility, index: number) => {
    carry.push([current.name, current.rolls, current.dmg, current.crit]);
    return carry;
  }, [['', 'rolls', 'dmg', 'crit']]);
};

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
  const discordChannel = duelState.context.channel;
  
  // Generate vs table
  const vs = table([[duelState.player1.name, 'vs', duelState.player2.name]]);

  // Display weapons
  const weapons = table(weaponsMatrix(duelState.weapons));

  // Announce new fight
  const announcement = `New Fight!\`\`\`${vs}\`\`\`\nChoose your weapon\`\`\`${weapons}\`\`\``;
  const message: Discord.Message = await discordChannel.send(announcement, {
    // code: true,
  });
  
  // Prepare reaction buttons
  for(const weapon of duelState.weapons) {
    await message.react(weapon.icon);
  }
  
  // Collect only for players involved
  const filter = (reaction: any, user: Discord.User) => {
    return duelState.weapons.some(weapon => {
      return weapon.icon === reaction.emoji.name && 
        (user.id === duelState.player1.id || user.id === duelState.player2.id);
    });
  };
  
  // Create reaction collector
  const collector = message.createReactionCollector(filter, { 
    max: 3,
    time: 10000,
  });
  
  // Wait for reactions
  let playersReady = 0;
  return new Promise((resolve, reject) => {
    collector.on('collect', (reaction: Discord.MessageReaction) => {
      if (reaction.count > 1) {
        const playerReady = [...reaction.users.cache]
          .map(([id, user]) => id)
          .some(idUser => 
            idUser === duelState.player1.id || idUser === duelState.player2.id
          );

        if (playerReady) {
          playersReady += 1;
        }

        if (playersReady === 2) {
          resolve();
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
