import { EventEmitter } from "events";
import Match from "./Match";
import Player from "./Player";
import FSM from "./FSM";

export default class MatchManager2 {
  private matches: Map<string, Match> = new Map<string, Match>();
  private players: Map<string, Player> = new Map<string, Player>();
  private eventManager: EventEmitter;

  private fsm: FSM = new FSM();
  
  constructor() {
    this.fsm
      .addState('start')
        .onEvent('default')
          .goTo('creatingMatch').do(this.platform.createMatch);
      
    this.fsm.addState('creatingMatch')
        .onEvent('matchCreated').do(this.eventManager.registerPlayers)


    
    
    // Handle events
    this.handleEvents();
  }
  
};