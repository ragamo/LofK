import Player from "./Player";

export default class Match {
  private guid: string;
  private player1: Player;
  private player2: Player;
  private log: any;

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
  }
  
  public getPlayer1() {
    return this.player1;
  }
  
  public getPlayer2() {
    return this.player2;
  }
}