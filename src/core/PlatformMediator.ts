import { EventEmitter } from "events";
import MatchManager from "./MatchManager";

export default class PlatformMediator {
  
  constructor(matchManager: MatchManager, platformMapper: any) {
    const eventManager = new EventEmitter();

    eventManager.on('fight', platformMapper.handleFight);

    platformMapper.on('action.fight.create', matchManager.createMatch)

    matchManager.on('reaction.fight.createMatch', platformMapper.statSelection)


    eventManager.on('fight.asignStats', matchManager.asignStats);
    eventManager.on('fight.asignWeapon', matchManager.asignWeapon);

  }

};
