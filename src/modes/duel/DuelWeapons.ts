import DuelWeapon from "./DuelWeapon";

export default class DuelWeapons {
  private weapons: DuelWeapon[];
  
  constructor() {
    this.weapons = [
      {
        name: 'Master Sword',
        icon: '⚔️',
        abilities: [
          {
            name: 'Strike',
            icon: '⚔️',
            rolls: 2,
            dmg: 19,
            crit: 20,
          },
          {
            name: 'Swing',
            icon: '⛏',
            rolls: 3,
            dmg: 22,
            crit: 15,
          },
          {
            name: 'Smite',
            icon: '🪓',
            rolls: 5,
            dmg: 28,
            crit: 25,
          }
        ]
      },
      {
        name: 'Epic Bow',
        icon: '🏹',
        abilities: [
          {
            name: 'Shot',
            icon: '🏹',
            rolls: 1,
            dmg: 23,
            crit: 0,
          },
          {
            name: 'Snipe',
            icon: '🔫',
            rolls: 3,
            dmg: 23,
            crit: 18,
          },
          {
            name: 'Multishot',
            icon: '🎯',
            rolls: 5,
            dmg: 36,
            crit: 15,
          }
        ]
      },
      {
        name: 'Poisoned dagger',
        icon: '🔪',
        abilities: [
          {
            name: 'Stab',
            icon: '🔪',
            rolls: 3,
            dmg: 25,
            crit: 15,
          },
          {
            name: 'Cleave',
            icon: '🪓',
            rolls: 4,
            dmg: 29,
            crit: 21,
          },
          {
            name: 'Precision',
            icon: '🔨',
            rolls: 5,
            dmg: 36,
            crit: 22,
          }
        ]
      }
    ]
  }

  getWeapons(): DuelWeapon[] {
    return this.weapons;
  }

}