import PlayerStats from '../interfaces/interface.player.stats';
import PlayerWeapon, { WeaponAbility } from '../interfaces/interface.player.weapon';
import PlayerInterface from '../interfaces/interface.player';

export default class Player {
  public id: string;
  public name: string;
  public race: string;

  public stats: PlayerStats;
  public eligibleStats: PlayerStats[];

  public weapon: PlayerWeapon;
  public eligibleWeapons: PlayerWeapon[];

  public opponent: Player;
  public busy: boolean = false;
  public selectedAbility: WeaponAbility;
  
  constructor(props: PlayerInterface) {
    this.id = props.id;
    this.name = props.name;
    this.race = props.race;
    this.stats = props.stats;
    this.weapon = props.weapon;
    this.opponent = props.opponent;
  }

  public setBusy(status: boolean) {
    this.busy = status;
  }

  public setOpponent(opponent: Player) {
    this.opponent = opponent;
  }

  attack(player: Player) {
    player.stats.hp = player.stats.hp - 10;

    return {
      opponentStats: player.stats,
      roll: 1,
    }
  }

  public generateEligibleStats(amount: number) {
    this.eligibleStats = [];
    for(let i=0; i<amount; i++) {
      this.eligibleStats.push({
        hp: 100,
        str: 30+Math.floor(Math.random()*40),
        dex: 30+Math.floor(Math.random()*40),
        int: 30+Math.floor(Math.random()*40),
        lvl: 1,
        exp: 0,
      });
    }
  }
};
