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
      throw new Error(`${player1.name} is already on a match`);
    }

    // Validate if player2 can play
    if (player2.onMatch) {
      throw new Error(`${player2.name} is already on a match`);
    }

    // Create new match
    const match = new Match(player1, player2, context, platform);
    this.matches.set(match.id, match);

    match.begin();
    return match;

    // Next state
    // this.eventManager.emit('selectStats', match);
  }

  findMatchByPlayer(player: Player) {
    for(const match of this.matches.values()) {
      if (match.state.player1 === player) {
        return match;
      }
      if (match.state.player2 === player) {
        return match;
      }
    }
    return null;
  }
};
