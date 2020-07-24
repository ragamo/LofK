import { DuelWeaponAbility } from "../../../modes/duel/DuelWeapon";

export const transposed = (entries: [[]]) => entries[0].map(
  (_: any, colIndex: string | number) => 
    entries.map((row: { [x: string]: any; }) => row[colIndex])
  );


export const abilitiesMatrix = (abilities: DuelWeaponAbility[]) => {
  return abilities.reduce((carry: any, current: DuelWeaponAbility, index: number) => {
    carry.push([current.name, current.rolls, current.dmg, current.crit]);
    return carry;
  }, [['', 'rolls', 'dmg', 'crit']]);
};