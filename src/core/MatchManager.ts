import Player from "./Player";
import PlayerStats from "../interfaces/interface.player.stats";
import PlayerWeapon, { WeaponAbility } from "../interfaces/interface.player.weapon";
import Store from "./Store";
import { EventEmitter } from "events";
import Match from "./Match";

export default class MatchManager {
  private matches: Map<string, Match> = new Map<string, Match>();
  private players: Map<string, Player> = new Map<string, Player>();
  private eventManager: EventEmitter;
  private store: Store;  

  constructor(store: Store, eventManager: EventEmitter) {
    this.store = store;
    this.eventManager = eventManager;

    // Handle events
    this.handleEvents();
  }

  /**
   * Handle game events
   */
  private handleEvents(): void {
    this.eventManager.on('createMatch', this.createMatch.bind(this));
    // this.eventManager.on('selectStats', this.selectStats.bind(this))
    this.eventManager.on('selectWeapon', this.selectWeapon.bind(this))
    this.eventManager.on('beginBattle', this.beginBattle.bind(this));
    this.eventManager.on('playerAttack', this.playerAttack.bind(this));
  }

  private findOrCreatePlayer(playerInfo: any) {
    if (!this.players.has(playerInfo.id)) {
      const player = new Player(playerInfo);
      this.players.set(player.id, player);
    }

    return this.players.get(playerInfo.id);
  }

  public createMatch(
    { player1: player1Info, player2: player2Info, context }: 
    { player1: any, player2: any, context: any}
  ) {
    // Create players
    const player1: Player = this.findOrCreatePlayer(player1Info);
    const player2: Player = this.findOrCreatePlayer(player2Info);

    // Validate player1 can play
    if (player1.onMatch) {
      console.log('Player1 is already on a fight');
      // this.eventManager.emit('error', `${player1.name} is already on a fight`);
      return;
    }

    // Validate player2 can play
    if (player2.onMatch) {
      console.log('Player2 is already on a fight');
      // this.eventManager.emit('error', `${player2.name} is already on a fight`);
      return;
    }

    // Create new match
    const match = new Match(player1, player2, context);
    this.matches.set(match.id, match);

    // Next state
    this.eventManager.emit('selectStats', match);
  }

  public asignStats(player: Player, stats: PlayerStats) {

  }

  public selectWeapon(player: Player, weapon: PlayerWeapon) {

  }

  public beginBattle(player1: Player, player2: Player) {

  }

  public playerAttack(from: Player, to: Player, ability: WeaponAbility) {

  }

  public findMatchByplayerId(idPlayer: string): Match {
    for(const match of this.matches.values()) {
      if (match.player1.id === idPlayer) {
        return match;
      }

      if (match.player2.id === idPlayer) {
        return match;
      }
    }

    return null;
  }
};
