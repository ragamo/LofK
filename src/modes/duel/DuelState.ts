import Player from "./DuelPlayer";
import DuelWeapon from "./DuelWeapon";

export default class DuelState {
  public context: any;
  public timeout: boolean = false;

  public player1: Player;
  public player2: Player;
  public playerOnTurn: Player;
  public winner: Player;

  public weapons: DuelWeapon[];

  constructor(player1: Player, player2: Player, context: any) {
    this.context = context;

    this.player1 = player1;
    this.player2 = player2;

    this.player1.setBusy(true);
    this.player2.setBusy(true);

    this.player1.setOpponent(player2);
    this.player2.setOpponent(player1);
  }

  clear() {
    this.player1.setBusy(false);
    this.player2.setBusy(false);

    this.player1.setOpponent(undefined);
    this.player2.setOpponent(undefined);
  }
};
