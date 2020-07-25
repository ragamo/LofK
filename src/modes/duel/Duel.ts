import { v4 as uuidv4 } from 'uuid';
import PlatformAdapter from "../../core/PlatformAdapter";
import DuelState from "./DuelState";
import Player from "./DuelPlayer";
import FSM from '../../core/FSM';
import DuelWeapons from './DuelWeapons';

export default class Duel {
    public id: string;
    public state: DuelState;
  
    private platform: PlatformAdapter;
    private log: [];
  
    /**
     * Create a new Match
     * @param player1 player 1
     * @param player2 player 1
     * @param context platform handler
     * @param platform platform implementation
     */
    constructor(player1: Player, player2: Player, context: any, platform: PlatformAdapter) {
      this.state = new DuelState(player1, player2, context);

      const weapons = new DuelWeapons();
      this.state.weapons = weapons.getWeapons();
  
      this.id = uuidv4();
      this.platform = platform;
    }

    /**
   * Start a duel
   */
  begin() {
    const fsm = new FSM();

    fsm.setDefaultError('finishing', this.defaultError.bind(this));

    fsm.addState('start')
      .onEvent('default')
        .goTo('creatingDuel').do(this.confirmDuel.bind(this));

    fsm.addState('creatingDuel')
      .onEvent('weaponConfirmed')
        .goTo('startDueling').do(this.startDuel.bind(this))
      .onEvent('weaponNotConfirmed')
        .goTo('clearingDuel').do(this.clearDuel.bind(this))

    fsm.addState('startDueling')
      .onEvent('duelBegan')
        .goTo('asigningAbility').do(this.askForAbility.bind(this))

    fsm.addState('asigningAbility')
      .onEvent('abilityAssigned')
        .goTo('attacking').do(this.attack.bind(this))
      .onEvent('abilityNotAssigned')
        .goTo('clearingDuel').do(this.clearDuel.bind(this))

    fsm.addState('attacking')
      .onEvent('turnChanged')
        .goTo('asigningAbility').do(this.askForAbility.bind(this))
      .onEvent('duelOver')
        .goTo('finishingDuel').do(this.finishDuel.bind(this))

    fsm.addState('clearingDuel')
      .onEvent('duelCleared')
        .goTo('finishing').doNothing();

    fsm.addState('finishingDuel')
      .onEvent('duelFinished')
        .goTo('finishing').doNothing();

    fsm.setLastState('finishing');

    fsm.run(this.state);
  }

  /**
   * Handle default error
   * @param state duel state
   */
  async defaultError(state: DuelState) {
    await this.platform.duel.announceDuelError(state, '[ERROR] Duel finished');
    console.log('🌀 FSM: defaultError');
    return [state, 'error'];
  }

  /**
   * Handle duel confirmation
   * @param state duel state
   */
  async confirmDuel(state: DuelState) {
    try {
      const [p1Weapon, p2Weapon] = await this.platform.duel.announceNewDuel(state);
      state.player1.weapon = p1Weapon;
      state.player2.weapon = p2Weapon;
      console.log('🌀 FSM: weaponConfirmed');
      return [state, 'weaponConfirmed'];

    } catch (err) {
      state.timeout = true;
      this.platform.duel.announceDuelError(state, err);
      console.log('🌀 FSM: weaponNotConfirmed');
      return [state, 'weaponNotConfirmed'];
    }
  }

  /**
   * Handle duel started
   * @param state duel state
   */
  async startDuel(state: DuelState) {
    // Randomize turn
    const index = Math.floor(Math.random()*2);
    const players = [state.player1, state.player2];
    state.playerOnTurn = players[index];

    await this.platform.duel.announceDuelBegan(state);
    console.log('🌀 FSM: duelBegan');
    return [state, 'duelBegan'];
  }

  /**
   * Handle user ability selection
   * @param state match state
   */
  async askForAbility(state: DuelState) {
    try {
      state.playerOnTurn.selectedAbility = await this.platform.duel.askForWeaponAbility(state);
      console.log('🌀 FSM: abilityAssigned');
      return [state, 'abilityAssigned'];

    } catch (err) {
      state.timeout = true;
      this.platform.duel.announceDuelError(state, err);
      console.log('🌀 FSM: abilityNotAssigned');
      return [state, 'abilityNotAssigned'];
    }
  }

  /**
   * Handle user attack
   * @param state duel state
   */
  async attack(state: DuelState) {
    const attackResult = state.playerOnTurn.attack(state.playerOnTurn.opponent);

    const opponent = state.playerOnTurn.opponent;
    opponent.hp = opponent.hp - attackResult.dmg;

    await this.platform.duel.announceDuelDamage(state, attackResult);

    if (opponent.hp <= 0) {
      console.log('🌀 FSM: duelOver');
      return [state, 'duelOver'];
    }

    state.playerOnTurn = state.playerOnTurn.opponent;
    console.log('🌀 FSM: turnChanged');
    return [state, 'turnChanged'];
  }

  /**
   * Handle finish duel
   * @param state duel state
   */
  async finishDuel(state: DuelState) {
    await this.platform.duel.announceDuelFinished(state);
    console.log('🏁 Duel finished');
    return [state, 'duelFinished'];
  }


  /**
   * Free memory allocation
   * @param state duel state
   */
  clearDuel(state: DuelState) {
    console.log('⛔️ Duel cleared due timeout.', `${state.player1.name} vs ${state.player2.name}`);
    this.state.clear();
    this.platform.duel.finishDuel(this.id);

    return [state, 'duelCleared'];
  }
}