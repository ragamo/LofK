import Player from "../../../../core/Player";
import MatchState from "../../../../core/MatchState";
import PlayerWeapon from "../../../../interfaces/interface.player.weapon";

const askForWeaponSelection = (player: Player, state: MatchState): Promise<PlayerWeapon> => {
  return new Promise(resolve => {
    resolve();
  });
}

export default async (player: Player, state: MatchState) =>
  askForWeaponSelection(player, state);