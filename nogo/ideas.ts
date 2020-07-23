/*
import { pipeline } from "stream";
import Match from "./Match";
import FSM from "./FSM";

export default class Platform {
  events = [
    'onMatch',
    'onMatchCreated',
  ];

  constructor(connector: Connector) {
    
  }

  promisifyEvents() {
    for(const event of this.events) {
      
    }
  }

  createMatch() {

  }

  onMatchCreated() {
    return new Promise(resolve => {
      this.connector.on('onMatchCreated', payload => {
        resolve(payload);
      });
    })
  }
};

const actions = [
  'createMatch',

  'onMatchCreated',
];

const reactions = [

];

const mediator = {
  actions: {},
  reactions: {},
};

for(const event of events) {
  mediator.actions[event] = promisify(event);
}

const promisify = (eventName) => {
  return new Promise(resolve => {
    this.connector.on(eventName, payload => {
      resolve(payload);
    });
  })
}
*/