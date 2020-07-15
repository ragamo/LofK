"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const events_1 = require("events");
const runImplementation = (platform, eventManager) => __awaiter(void 0, void 0, void 0, function* () {
    switch (platform) {
        case 'discord':
            const { DiscordImplementation } = yield Promise.resolve().then(() => __importStar(require(`../platforms/discord/discord`)));
            new DiscordImplementation(eventManager);
            break;
        default:
            console.log('No implementation selected');
    }
});
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
exports.server = (platform) => {
    const eventManager = new events_1.EventEmitter();
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
//# sourceMappingURL=Lofk.js.map