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
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Swing',
            icon: '⛏',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Smite',
            icon: '🪓',
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
            icon: '🏹',
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Snipe',
            icon: '🔫',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Multishot',
            icon: '🎯',
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
            icon: '🔪',
            rolls: 3,
            dmg: 12,
            crit: 10,
          },
          {
            name: 'Cleave',
            icon: '🪓',
            rolls: 4,
            dmg: 18,
            crit: 15,
          },
          {
            name: 'Precision',
            icon: '🔨',
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