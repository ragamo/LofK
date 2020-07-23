import { v4 as uuidv4 } from 'uuid';
import FSM from './FSM';
import Player from "./Player";
import MatchState from './MatchState';
import PlatformAdapter from './PlatformAdapter';

export default class Match {
  public id: string;
  public state: MatchState;

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
    this.state = new MatchState(player1, player2, context);

    this.id = uuidv4();
    this.platform = platform;
  }

  /**
   * Start a match
   */
  begin() {
    const fsm = new FSM();

    fsm.setDefaultError('finishing', this.defaultError.bind(this));

    fsm.addState('start')
      .onEvent('default')
        .goTo('creatingMatch').do(this.confirmFight.bind(this));

    fsm.addState('creatingMatch')
      .onEvent('matchConfirmed')
        .goTo('asigningStats').do(this.askForStats.bind(this))
      .onEvent('matchNotConfirmed')
        .goTo('clearingMatch').do(this.clearMatch.bind(this))

    fsm.addState('asigningStats')
      .onEvent('statsAsigned')
        .goTo('asigningWeapon').do(this.askForWeapon.bind(this))
      .onEvent('statsNotAsigned')
        .goTo('clearingMatch').do(this.clearMatch.bind(this))

    fsm.addState('asigningWeapon')
      .onEvent('weaponAsigned')
        .goTo('startFighting').do(this.startFight.bind(this))
      .onEvent('weaponNotAsigned')
        .goTo('finishing').doNothing();

    fsm.addState('startFighting')
      .onEvent('fightBegan')
        .goTo('asigningAbility').do(this.askForAbility.bind(this))
      .onEvent('error')
        .doDefaultError();

    fsm.addState('asigningAbility')
      .onEvent('abilityAssigned')
        .goTo('attacking').do(this.attack.bind(this))
      .onEvent('abilityNotAsigned')
        .doDefaultError();

    fsm.addState('attacking')
      .onEvent('turnChanged')
        .goTo('asigningAbility').do(this.askForAbility.bind(this))
      .onEvent('matchOver')
        .goTo('finishingMatch').do(this.finishMatch.bind(this))

    fsm.addState('clearingMatch')
      .onEvent('matchCleared')
        .goTo('finishing').doNothing();

    fsm.addState('finishingMatch')
      .onEvent('matchFinished')
        .goTo('finishing').doNothing();

    fsm.setLastState('finishing');

    fsm.run(this.state);
  }

  /**
   * Handle default error
   * @param state match state
   */
  async defaultError(state: MatchState) {
    await this.platform.match.announceMatchError(state, '[ERROR] Match finished');
    return [state, 'error'];
  }

  /**
   * Handle match confirmation
   * @param state match state
   */
  async confirmFight(state: MatchState) {
    try {
      await this.platform.match.announceNewMatch(state);
      return [state, 'matchConfirmed'];
    } catch (err) {
      state.timeout = true;
      this.platform.match.announceMatchError(state, err);
      return [state, 'matchNotConfirmed'];
    }
  }

  /**
   * Handle user stats selection
   * @param state match state
   */
  async askForStats(state: MatchState) {
    const [p1Stats, p2Stats] = await Promise.all([
      this.platform.match.askForStatsSelection(state.player1, state),
      this.platform.match.askForStatsSelection(state.player2, state),
    ]);
    
    state.player1.stats = p1Stats;
    state.player2.stats = p2Stats;

    return [state, 'statsAsigned'];
  }

  /**
   * Handle user weapon selection
   * @param state match state
   */
  async askForWeapon(state: MatchState) {
    const [p1Weapon, p2Weapon] = await Promise.all([
      this.platform.match.askForWeaponSelection(state.player1, state),
      this.platform.match.askForWeaponSelection(state.player2, state),
    ]);
    
    state.player1.weapon = p1Weapon;
    state.player2.weapon = p2Weapon;

    return [state, 'weaponAsigned'];
  }

  /**
   * Handle match started
   * @param state match state
   */
  async startFight(state: MatchState) {
    // Randomize turn
    const index = Math.floor(Math.random()*2);
    const players = [state.player1, state.player2];
    state.playerOnTurn = players[index];

    await this.platform.match.announceMatchBegan(state);

    return [state, 'fightBegan'];
  }

  /**
   * Handle user ability selection
   * @param state match state
   */
  async askForAbility(state: MatchState) {
    state.playerOnTurn.selectedAbility = await this.platform.match.askForWeaponAbilitySelection(state.playerOnTurn, state);

    return [state, 'abilityAsigned'];
  }

  /**
   * Handle user attack
   * @param state match state
   */
  async attack(state: MatchState) {
    const { opponentStats, roll } = state.playerOnTurn.attack(state.playerOnTurn.opponent);

    if (opponentStats.hp <= 0) {
      return [state, 'matchOver'];
    }

    state.playerOnTurn.opponent.stats = opponentStats;
    state.playerOnTurn = state.playerOnTurn.opponent;
    await this.platform.match.announceMatchDamage(state);

    return [state, 'turnChanged'];
  }

  /**
   * Handle finish match
   * @param state match state
   */
  async finishMatch(state: MatchState) {
    // TODO: Calculate gold and XP
    await this.platform.match.announceMatchFinished(state);

    return [state, 'matchFinished'];
  }

  /**
   * Free memory allocation
   * @param state match state
   */
  clearMatch(state: MatchState) {
    this.state.clear();
    this.platform.match.finishMatch(this.id);

    return [state, 'matchCleared'];
  }
};
