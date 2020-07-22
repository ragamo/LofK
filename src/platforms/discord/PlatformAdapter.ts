import MatchManager from "../../core/MatchManager";

export default class PlatformAdapter {
  public match: MatchManager;
  
  constructor() {
    this.match = new MatchManager();
  }

};