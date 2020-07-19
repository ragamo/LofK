import PlatformAdapter from "../platforms/discord/PlatformAdapter";
import Player from "./Player";
import Match from "./Match";

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

    // Validate if player1 can play
    if (player1.onMatch) {
      throw { busyPlayer: player1 };
    }

    // Validate if player2 can play
    if (player2.onMatch) {
      throw { busyPlayer: player1 };
    }

    // Create new match
    const match = new Match(player1, player2, context, platform);
    this.matches.set(match.id, match);

    return match;
  }

  finishMatch(idMatch: string) {
    this.matches.delete(idMatch);
  }
};
