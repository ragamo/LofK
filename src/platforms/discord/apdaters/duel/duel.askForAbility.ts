import { table } from "table";
import DuelState from "../../../../modes/duel/DuelState";
import DuelPlayer from "../../../../modes/duel/DuelPlayer";
import { DuelWeaponAbility } from "../../../../modes/duel/DuelWeapon";
import { transposed, abilitiesMatrix } from '../../helpers/helper.duel';

const askForAbility = (player: DuelPlayer, duelState: DuelState): Promise<DuelWeaponAbility> => {
  const discordChannel = duelState.context.channel;

  // Display abilities
  const abilities = table(transposed(abilitiesMatrix(player.weapon.abilities)));

  return new Promise(resolve => {
    resolve();
  });
}

export default async (player: DuelPlayer, state: DuelState) =>
  askForAbility(player, state);