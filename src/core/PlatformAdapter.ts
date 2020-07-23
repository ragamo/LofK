import DuelManager from "../modes/duel/DuelManager";

export default class PlatformAdapter {
  public duel: DuelManager;
  
  constructor() {
    this.duel = new DuelManager();
  }

};