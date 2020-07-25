import DuelWeapon from "./DuelWeapon";
import { DuelWeaponAbility } from './DuelWeapon';
import { format } from "path";

export default class DuelPlayer {
  public id: string;
  public name: string;
  public busy: boolean = false;

  public lvl: number = 1;
  public hp: number = 100;
  public opponent: DuelPlayer;
  public weapon: DuelWeapon;
  public selectedAbility: DuelWeaponAbility;
  
  constructor(props: DuelPlayer) {
    this.id = props.id;
    this.name = props.name;
    this.opponent = props.opponent;
  }

  public setBusy(status: boolean) {
    this.busy = status;
  }

  public setOpponent(opponent: DuelPlayer) {
    this.opponent = opponent;
  }

  attack(opponent: DuelPlayer) {
    const roll = this.roll();

    // Calculate dmg
    const dmgMultiplier = roll.reduce((carry, current) => carry + current, 0);
    const isCritical = dmgMultiplier === roll.length;
    const critical = isCritical ? (1 + this.selectedAbility.crit / 100) : 1;
    let dmg = Math.floor(dmgMultiplier * (this.selectedAbility.dmg / roll.length) * critical);

    return {
      dmg,
      isCritical,
      isMiss: dmgMultiplier === 0,
      roll,
      ability: this.selectedAbility,
    }
  }

  private roll() {
    const rolled = [];
    for (let i=0; i<this.selectedAbility.rolls; i += 1) {
      const roll = Math.random()*10 < 6 ? 1 : 0;
      rolled.push(roll);
    } 
    return rolled;
  }
}