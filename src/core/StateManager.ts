import Player from "./Player";
import PlayerStats from "../interfaces/interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "../interfaces/interface.player.weapon";

export default class StateManager {
  constructor(store: any) {

  }

  public prepareBattle(player1: Player, player2: Player) {
    // const match = this.store.createMatch(player1, player2);

    player1.setOnMatch(true);
    player2.setOnMatch(true);

    player1.setOponent(player2);
    player2.setOponent(player1);
  }

  public selectStats(player: Player, stats: PlayerStats) {

  }

  public selectWeapon(player: Player, weapon: PlayerWeapon) {

  }

  public beginBattle(player1: Player, player2: Player) {

  }

  public playerAttack(from: Player, to: Player, ability: WeaponAbility) {

  }
};
