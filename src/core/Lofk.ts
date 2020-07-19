import MatchManager from './MatchManager';
import PlatformAdapter from '../platforms/discord/PlatformAdapter';

export default class Lofk {

  /**
   * Constructor
   */
  constructor(platforms: string[]) {
    const matchManager = new MatchManager();
    const platformAdapter = new PlatformAdapter(matchManager);

    for(const platform of platforms) {
      this.runPlatform(platform, platformAdapter);
    }
  }

  /**
   * Load platform
   * @param platform platform name
   * @param eventManager event manager
   */
  private async runPlatform(platform: string, platformAdapter: PlatformAdapter) {
    switch(platform) {
      case 'discord':
        const { DiscordImplementation } = await import(`../platforms/discord/DiscordImplementation`);
        new DiscordImplementation(platformAdapter);
        break;
  
      default:
        console.log('No implementation selected');
    }
  }
}