import PlayerStats from "./interface.player.stats";
import PlayerWeapon from "./interface.player.weapon";
import Player from "../core/Player";

export default interface PlayerInterface {
  name: string,
  race: string,
  stats: PlayerStats,
  weapon: PlayerWeapon,
  oponent?: Player,
}