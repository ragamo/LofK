import Stats from '../interfaces/interface.stats';
import Weapon from '../interfaces/interface.weapon';

export default class Player {
  private stats: Stats;
  private weapon: Weapon;
  private oponent: Player;
  
  constructor(stats: Stats, weapon: Weapon) {
    this.stats = stats;
    this.weapon = weapon;
  }
};
