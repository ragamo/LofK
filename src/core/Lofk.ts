import { EventEmitter } from 'events';
import StateManager from './StateManager';
export default class Lokf {
  private eventManager: EventEmitter = new EventEmitter();
  private stateManager: StateManager;

  constructor(platforms: string[]) {
    this.stateManager = new StateManager({});
    this.prepare();

    for(const platform of platforms) {
      this.runPlatform(platform, this.eventManager);
    }
  }

  private prepare() {
    // this.setDefaultState();
    this.handleEvents();
  }

  private async runPlatform(platform: string, eventManager: EventEmitter) {
    switch(platform) {
      case 'discord':
        const { DiscordImplementation } = await import(`../platforms/discord/DiscordImplementation`);
        new DiscordImplementation(eventManager);
        break;
  
      default:
        console.log('No implementation selected');
    }
  }

  private handleEvents() {
    this.eventManager.on('prepareBattle', this.stateManager.prepareBattle.bind(this));
    this.eventManager.on('selectStats', this.stateManager.selectStats.bind(this))
    this.eventManager.on('selectWeapon', this.stateManager.selectWeapon.bind(this))
    this.eventManager.on('beginBattle', this.stateManager.beginBattle.bind(this));
    this.eventManager.on('playerAttack', this.stateManager.playerAttack.bind(this));
  }
}