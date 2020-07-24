export interface DuelWeaponAbility {
  name: string;
  icon: string;
  rolls: number;
  dmg: number;
  crit: number;
}

export default interface DuelWeapon {
  name: string;
  icon: string;
  abilities: DuelWeaponAbility[];
}