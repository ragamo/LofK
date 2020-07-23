import PlayerStats from "./interface.player.stats";
import PlayerWeapon from "./interface.player.weapon";
import Player from "../core/Player";

export default interface PlayerInterface {
  id: string,
  name: string,
  race?: string,
  stats?: PlayerStats,
  weapon?: PlayerWeapon,
  opponent?: Player,
}