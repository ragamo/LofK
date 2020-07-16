enum WeaponType {
  Weapon,
  Bow,
  Staff,
};

enum WeaponAttackType {
  Physical,
  Magical,
}

export interface WeaponBonus {
  critical?: number,
  evasion?: number,
  goldMultiplier?: number,
  addFocus?: number,
}

export interface WeaponAbility {
  name: string,
  rolls: number,
  rollDmg: number,
}

export default interface PlayerWeapon {
  name: string,
  type: WeaponType,
  stat: string,
  attackType: WeaponAttackType,
  bonuses?: WeaponBonus[],
  abilities: WeaponAbility[],
};
