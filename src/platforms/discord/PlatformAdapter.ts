import Platform from "../../interfaces/Platform";
import MatchManager from "../../core/MatchManager";
import MatchState from '../../core/MatchState';
import Player from '../../core/Player';

import matchAnnounceError from "./apdaters/match/match.announceError";
import matchAnnounceNewMatch from './apdaters/match/match.announceNewMatch';
import matchSelectStats from './apdaters/match/match.selectStats';
import matchSelectWeapon from './apdaters/match/match.selectWeapon';

export default class PlatformAdapter implements Platform { // extends PlatformAdapter
  private matchManager: MatchManager;
  
  constructor(matchManager: MatchManager) {
    this.matchManager = matchManager;
  }
  
  createMatch(player1: any, player2: any, context:any) {
    try {
      const match = this.matchManager.createMatch({player1, player2, context, platform: this });
      match.begin();
    } catch ({ busyPlayer }) {
      context.reply(`<@${busyPlayer.id}> is already on a match.`);
    }
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

  announceMatchError(matchState: MatchState, error: string) {
    return matchAnnounceError(matchState, error);
  }

  finishMatch(idMatch: string) {
    this.matchManager.finishMatch(idMatch);
  }

};