import DuelWeapon from "./DuelWeapon";

export default class DuelWeapons {
  private weapons: DuelWeapon[];
  
  constructor() {
    this.weapons = [
      {
        name: 'Master Sword',
        icon: '🗡',
        abilities: [
          {
            name: 'Strike',
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Swing',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Smite',
            rolls: 5,
            dmg: 25,
            crit: 20,
          }
        ]
      },
      {
        name: 'Epic Bow',
        icon: '🏹',
        abilities: [
          {
            name: 'Shot',
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Snipe',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Multishot',
            rolls: 5,
            dmg: 25,
            crit: 20,
          }
        ]
      },
      {
        name: 'Poisoned dagger',
        icon: '🔪',
        abilities: [
          {
            name: 'Stab',
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Cleave',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Precision',
            rolls: 5,
            dmg: 25,
            crit: 20,
          }
        ]
      }
    ]
  }

  getWeapons(): DuelWeapon[] {
    return this.weapons;
  }

}