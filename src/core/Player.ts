import PlayerStats from '../interfaces/interface.player.stats';
import PlayerWeapon from '../interfaces/interface.player.weapon';
import PlayerInterface from '../interfaces/interface.player';

export default class Player {
  public id: string;
  public name: string;
  public race: string;

  public stats: PlayerStats;
  public eligibleStats: PlayerStats[];

  public weapon: PlayerWeapon;
  public opponent: Player;

  private onMatch: boolean = false;
  
  constructor(props: PlayerInterface) {
    this.id = props.id;
    this.name = props.name;
    this.race = props.race;
    this.stats = props.stats;
    this.weapon = props.weapon;
    this.opponent = props.opponent;
  }

  public getOnMatch() {
    return this.onMatch;
  }

  public setOnMatch(status: boolean) {
    this.onMatch = status;
  }

  public setOpponent(opponent: Player) {
    this.opponent = opponent;
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
