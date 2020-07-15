"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
exports.server = (platform) => {
    console.log('Server start');
    while (true)
        ;
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
//# sourceMappingURL=Lofk.js.map