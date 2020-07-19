import Player from "../core/Player";
import PlayerStats from "./interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "./interface.player.weapon";
import MatchState from "../core/MatchState";

export default interface Platform {
  createMatch(player1: any, player2: any, context: any): void;
  finishMatch(idMatch: string): void;

  askForStatsSelection(player: Player, matchState: MatchState): Promise<PlayerStats>;
  askForWeaponSelection(player: Player, matchState: MatchState): Promise<PlayerWeapon>;
  askForWeaponAbilitySelection?(player: Player): WeaponAbility;

  announceNewMatch(matchState: MatchState): any;
  announceMatchBegan?(matchState: MatchState): any;
  announceMatchDamage?(matchState: MatchState): any;
  announceMatchFinished?(matchState: MatchState): any;
  announceMatchError(matchState: MatchState, error: string): void;
}