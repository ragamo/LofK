import DuelWeapon, { DuelWeaponAbility } from "../../../modes/duel/DuelWeapon";
import DuelPlayer from "../../../modes/duel/DuelPlayer";
import { table } from "table";

export const transposed = (entries: [[]]) => entries[0].map(
  (_: any, colIndex: string | number) => 
    entries.map((row: { [x: string]: any; }) => row[colIndex])
  );

export const playersMatrix = (players: DuelPlayer[]): [[]] => {
  return players.reduce((carry: any, current: DuelPlayer) => {
    carry.push([current.name, current.hp]);
    return carry;
  }, [['', 'hp']]);
};

export const playersMatrixWithLvl = (players: DuelPlayer[]): [[]] => {
  return players.reduce((carry: any, current: DuelPlayer) => {
    carry.push([current.name, current.hp, current.lvl]);
    return carry;
  }, [['', 'hp', 'lvl']]);
};

export const abilitiesMatrix = (abilities: DuelWeaponAbility[], withIcons: boolean = false): [[]] => {
  return abilities.reduce((carry: any, current: DuelWeaponAbility) => {
    const abilityName = withIcons ? `${current.name} ${current.icon}` : current.name;
    carry.push([abilityName, current.rolls, current.dmg, current.crit]);
    return carry;
  }, [['', 'rolls', 'dmg', 'crit']]);
};

export const weaponsMatrix = (weapons: DuelWeapon[]) => {
  const weaponNames = [];
  const weaponAbilities = [];
  
  for(const weapon of weapons) {
    weaponNames.push(`${weapon.name} (${weapon.icon})`);
    weaponAbilities.push(table(transposed(abilitiesMatrix(weapon.abilities))).replace(/\n$/,''));
  }

  return [
    weaponNames,
    weaponAbilities,
  ];
};

export const weaponMatrix = (weapon: DuelWeapon) => {
  const tableConfig = {
    columns: {
      1: { width: 7 },
      2: { width: 7 },
      3: { width: 9 },
    }
  };

  const header = [`${weapon.name} (${weapon.icon})`];
  const content = [table(transposed(abilitiesMatrix(weapon.abilities)), tableConfig).replace(/\n$/,'')];
  
  return [
    header,
    content,
  ];
};