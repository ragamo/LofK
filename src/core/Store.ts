import Player from "./Player";
import Match from "./MatchManager";

export default class Store {
  private matches: any = [{
    id: 1,
    player1: null,
    player2: null,
    history: [] 
  }];
  private players: Map<string, Player> = new Map<string, Player>();

  public constructor() {
    // persistent connection
  }

  public registerPlayer(player: Player) {
    if (!this.players.has(player.name)) {
      this.players.set(player.name, player);
    }
  }
};
