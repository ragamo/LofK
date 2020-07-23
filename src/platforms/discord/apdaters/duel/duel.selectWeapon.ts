import DuelState from "../../../../modes/duel/DuelState";
import DuelPlayer from "../../../../modes/duel/DuelPlayer";
import { DuelWeaponAbility } from "../../../../modes/duel/DuelWeapon";

const askForWeaponSelection = (player: DuelPlayer, state: DuelState): Promise<DuelWeaponAbility> => {
  return new Promise(resolve => {
    resolve();
  });
}

export default async (player: DuelPlayer, state: DuelState) =>
  askForWeaponSelection(player, state);