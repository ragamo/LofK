import Player from "./Player";
import PlayerStats from "../interfaces/interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "../interfaces/interface.player.weapon";
import Store from "./Store";
import { EventEmitter } from "events";

export default class MatchManager {
  private store: Store;
  private eventManager: EventEmitter;

  constructor(store: Store, eventManager: EventEmitter) {
    this.store = store;
    this.eventManager = eventManager;

    // Handle events
    this.handleEvents();
  }

  /**
   * Handle game events
   */
  private handleEvents() {
    this.eventManager.on('prepareBattle', this.prepareBattle.bind(this));
    this.eventManager.on('selectStats', this.selectStats.bind(this))
    this.eventManager.on('selectWeapon', this.selectWeapon.bind(this))
    this.eventManager.on('beginBattle', this.beginBattle.bind(this));
    this.eventManager.on('playerAttack', this.playerAttack.bind(this));
  }

  private createMatch(player1: Player, player2: Player) {
    this.store.registerPlayer(player1);
    this.store.registerPlayer(player2);
  }

  public prepareBattle(player1: Player, player2: Player) {
    const match = this.createMatch(player1, player2);

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
