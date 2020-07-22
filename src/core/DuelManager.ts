import Player from "./Player";
import Duel from "./Duel";
import PlatformAdapter from "./PlatformAdapter";

export default class DuelManager {
  private duels: Map<string, Duel> = new Map<string, Duel>();
  private players: Map<string, Player> = new Map<string, Player>();

  private findOrCreatePlayer(playerInfo: any) {
    if (!this.players.has(playerInfo.id)) {
      const player = new Player(playerInfo);
      this.players.set(player.id, player);
    }

    return this.players.get(playerInfo.id);
  }

  public create(
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
    const duel = new Duel(player1, player2, context, platform);
    this.duels.set(duel.id, duel);

    duel.begin();

    return duel;
  }
}