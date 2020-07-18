import Player from "../core/Player";
import PlayerStats from "./interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "./interface.player.weapon";

export default interface {
  askForStatsSelection(player: Player): PlayerStats;
  askForWeaponSelection(player: Player): PlayerWeapon;
  askForWeaponAbilitySelection(player: Player): WeaponAbility;

  announceFigthBegan(player1: Player, player2: Player): any;
  announceFightDamage(opponent: Player): any;
  announceFightFinished(winner: Player, loser: Player): any;
  announceError(player: Player): any;
}