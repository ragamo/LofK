import PlatformAdapter from "../core/PlatformAdapter";
import MatchState from "./MatchState";
import Match from "./Match";
import Player from "./Player";

import matchAnnounceNewMatch from "../platforms/discord/apdaters/match/match.announceNewMatch";
import matchSelectStats from "../platforms/discord/apdaters/match/match.selectStats";
import matchSelectWeapon from "../platforms/discord/apdaters/match/match.selectWeapon";
import matchAnnounceError from "../platforms/discord/apdaters/match/match.announceError";
import { WeaponAbility } from "../interfaces/interface.player.weapon";

export default class MatchManager {
  private matches: Map<string, Match> = new Map<string, Match>();
  private players: Map<string, Player> = new Map<string, Player>();

  constructor() {
  }

  private findOrCreatePlayer(playerInfo: any) {
    if (!this.players.has(playerInfo.id)) {
      const player = new Player(playerInfo);
      this.players.set(player.id, player);
    }

    return this.players.get(playerInfo.id);
  }

  public createMatch(
    { player1: player1Info, player2: player2Info, platform, context }: 
    { player1: any, player2: any, platform: PlatformAdapter, context: any}
  ) {
    // Create players
    const player1: Player = this.findOrCreatePlayer(player1Info);
    const player2: Player = this.findOrCreatePlayer(player2Info);

    try {
      // Validate if player1 can play
      if (player1.busy) {
        throw { busyPlayer: player1 };
      }

      // Validate if player2 can play
      if (player2.busy) {
        throw { busyPlayer: player1 };
      }
    } catch ({ busyPlayer }) {
      context.reply(`<@${busyPlayer.id}> is already on a match.`);
      return;
    }
    

    // Create new match
    const match = new Match(player1, player2, context, platform);
    this.matches.set(match.id, match);

    match.begin();

    return match;
  }

  async announceNewMatch(matchState: MatchState) {
    return matchAnnounceNewMatch(matchState);
  }

  async askForStatsSelection(player: Player, matchState: MatchState) {
    return matchSelectStats(player, matchState);
  }

  async askForWeaponSelection(player: Player, matchState: MatchState) {
    return matchSelectWeapon(player, matchState);
  }

  async announceMatchError(matchState: MatchState, error: string) {
    return matchAnnounceError(matchState, error);
  }

  async announceMatchBegan(matchState: MatchState) {

  }

  async askForWeaponAbilitySelection(player: Player, matchState: MatchState): Promise<WeaponAbility> {
    return {
      name: 'blade',
      rolls: 3,
      rollDmg: 1,
    };
  }

  async announceMatchDamage(matchState: MatchState) {

  }

  async announceMatchFinished(matchState: MatchState) {

  }

  finishMatch(idMatch: string) {
    this.matches.delete(idMatch);
  }
};
