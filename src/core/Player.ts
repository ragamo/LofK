import PlayerStats from '../interfaces/interface.player.stats';
import PlayerWeapon from '../interfaces/interface.player.weapon';
import PlayerInterface from '../interfaces/interface.player';

export default class Player {
  private name: string;
  private race: string;
  private stats: PlayerStats;
  private weapon: PlayerWeapon;
  private oponent: Player;

  private onMatch: boolean = false;
  
  constructor(props: PlayerInterface) {
    this.name = props.name;
    this.race = props.race;
    this.stats = props.stats;
    this.weapon = props.weapon;
    this.oponent = props.oponent;
  }

  setOnMatch(status: boolean) {
    this.onMatch = status;
  }

  setOponent(oponent: Player) {
    this.oponent = oponent;
  }
};
