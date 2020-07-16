import { EventEmitter } from 'events';

const runImplementation = async (platform: string, eventManager: EventEmitter) => {
  switch(platform) {
    case 'discord':
      const { DiscordImplementation } = await import(`../platforms/discord/DiscordImplementation`);
      new DiscordImplementation(eventManager);
      break;

    default:
      console.log('No implementation selected');
  }
};

/*const registerEventHandlers = (eventManager: EventEmitter, handlers) => {
  // parseCommands();
  /* eventManager.emit('fight', {
    player: someData,
    opponent: someData,
  });

  eventManager.on('fight', handlers.startFight);
  eventManager.on('attack', handlers.attackPlayer);
  eventManager.on('finish', handlers.fini)
}; */

export const server = (platform: string) => {
  const eventManager = new EventEmitter();
  // registerEventHandlers(eventManager);
  runImplementation(platform, eventManager);
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