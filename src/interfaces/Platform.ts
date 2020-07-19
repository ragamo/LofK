import Player from "../core/Player";
import PlayerStats from "./interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "./interface.player.weapon";
import MatchState from "../core/MatchState";

export default interface Platform {
  createMatch(player1: any, player2: any, context: any): void;
  finishMatch(idMatch: string): void;

  askForStatsSelection?(player: Player): PlayerStats;
  askForWeaponSelection?(player: Player): PlayerWeapon;
  askForWeaponAbilitySelection?(player: Player): WeaponAbility;

  announceNewMatch(matchState: MatchState): any;
  announceFigthBegan?(matchState: MatchState): any;
  announceFightDamage?(matchState: MatchState): any;
  announceFightFinished?(matchState: MatchState): any;
  announceFightError(state: MatchState, error: string): any;
}