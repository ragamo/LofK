import MatchManager from "./MatchManager";
import DuelManager from "./DuelManager";

export default class PlatformAdapter {
  public match: MatchManager;
  public duel: DuelManager;
  
  constructor() {
    this.match = new MatchManager();
    this.duel = new DuelManager();
  }

};