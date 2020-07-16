enum WeaponType {
  Weapon,
  Bow,
  Staff,
};

enum WeaponAttackType {
  Physical,
  Magical,
}

interface WeaponBonus {
  crit: number;
}

interface WeaponAbility {
  name: string,
  rolls: number,
  rollDmg: number,
}

export default interface Weapon {
  name: string,
  type: WeaponType,
  attackType: WeaponAttackType,
  bonuses?: WeaponBonus[],
  abilities: WeaponAbility[],
};
