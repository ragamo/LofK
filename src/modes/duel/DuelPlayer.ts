import DuelWeapon from "./DuelWeapon";
import { DuelWeaponAbility } from './DuelWeapon';

export default class DuelPlayer {
  public id: string;
  public name: string;
  public busy: boolean = false;

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

  attack(player: DuelPlayer) {
    player.hp = player.hp - 10;

    return {
      player,
      roll: 1,
    }
  }
}