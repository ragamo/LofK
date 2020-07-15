const PLATFORMS: { [key: string]: any } = {
  discord: 'Discord',
};

const runImplementation = (platform: string) => {
  const selectedPlatform = PLATFORMS[platform.toLowerCase()];
  const implementation = import(`src/platforms/${selectedPlatform}`)
};

export const server = (platform: String) => {
  runImplementation(platform);
};

/*
const EventEmitter = require('events');

module.exports = (platform) => {
  const eventManager = loadPlatform(platform);
  const game = loadGameState();

  eventManager.registerCommand('fight', game.startFight);


  const events = new EventEmitter();
  return {
    on(eventName, callback) {
      events.on(eventName, callback);
    },
  };
};
*/