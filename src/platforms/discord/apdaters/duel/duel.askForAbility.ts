import Discord from 'discord.js';
import { table } from "table";
import DuelState from "../../../../modes/duel/DuelState";
import DuelPlayer from "../../../../modes/duel/DuelPlayer";
import { DuelWeaponAbility } from "../../../../modes/duel/DuelWeapon";
import { transposed, abilitiesMatrix } from '../../helpers/helper.duel';

const askForAbility = async (duelState: DuelState): Promise<DuelWeaponAbility> => {
  const discordChannel: Discord.TextChannel = duelState.context.channel;

  const player: DuelPlayer = duelState.playerOnTurn;
  const abilities = player.weapon.abilities;

  // Display abilities
  const abilitiesTable = table(transposed(abilitiesMatrix(abilities, true)));
  console.log(abilitiesTable);
  const announcement = `Choose an ability <@${player.id}>\`\`\`${abilitiesTable}\`\`\``;
  const message: Discord.Message = await discordChannel.send(announcement);

  // Prepare reaction buttons
  for(const ability of player.weapon.abilities) {
    await message.react(ability.icon);
  }

  // Collect only for player involved
  const filter = (reaction: Discord.MessageReaction, user: Discord.User) => {
    return abilities.some(ability => {
      return ability.icon === reaction.emoji.name && user.id === player.id;
    });
  };

  // Create reaction collector
  const collector = message.createReactionCollector(filter, { 
    time: 30000,
  });
  
  // Wait for reactions
  return new Promise((resolve, reject) => {
    collector.on('collect', (reaction: Discord.MessageReaction, user: Discord.User) => {
      if (reaction.count > 1) {
        const selectedAbility = abilities.find(ability => 
          ability.icon === reaction.emoji.name
        );

        if (user.id === player.id) {
          resolve(selectedAbility);
        }
      }
    });
    
    collector.on('end', collected => {
      if (collected.size < 3) {
        reject(`you didn't select anything. <@${duelState.playerOnTurn.opponent.id}> wins.`);
      }
    });
  });
}

export default async (state: DuelState) =>
  askForAbility(state);