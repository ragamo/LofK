import { EventEmitter } from 'events';
import Store from './Store';
import MatchManager from './MatchManager';

export default class Lokf {
  private eventManager: EventEmitter = new EventEmitter();
  private storeManager: Store = new Store();
  // private matchManager: MatchManager;

  /**
   * Constructor
   */
  constructor(platforms: string[]) {
    const matchManager = new MatchManager(this.storeManager, this.eventManager);

    for(const platform of platforms) {
      this.runPlatform(platform, this.eventManager);
    }
  }

  /**
   * Load platform
   * @param platform platform name
   * @param eventManager event manager
   */
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
}