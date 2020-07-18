import Player from "./Player";

export default class MatchState {
  public player1: Player;
  public player2: Player;
  public playerOnTurn: Player;
  public winner: Player;

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;

    this.player1.setOnMatch(true);
    this.player2.setOnMatch(true);

    this.player1.setOpponent(player2);
    this.player2.setOpponent(player1);

    // Randomize initial stats
    this.player1.generateEligibleStats(3);
    this.player2.generateEligibleStats(3);
  }
}