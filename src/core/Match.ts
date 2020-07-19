import { v4 as uuidv4 } from 'uuid';
import FSM from './FSM';
import Player from "./Player";
import MatchState from './MatchState';
import Platform from '../interfaces/Platform';

export default class Match {
  public id: string;
  public context: any;
  public state: MatchState;

  private platform: Platform;
  private log: [];

  constructor(player1: Player, player2: Player, context: any, platform: Platform) {
    this.state = new MatchState(player1, player2);

    this.id = uuidv4();
    this.platform = platform;
    this.context = context;
  }

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
        .goTo('finishing').doNothing();

    fsm.addState('asigningStats')
      .onEvent('statsAsigned')
        .goTo('asigningWeapon').do(this.askForWeapon.bind(this))
      .onEvent('statsNotAsigned')
        .goTo('finishing').doNothing();

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

    fsm.addState('finishingMatch')
      .onEvent('matchFinished')
        .goTo('finishing').doNothing()

    fsm.setLastState('finishing');

    fsm.run(this.state);
  }

  async defaultError(state: MatchState) {
    await this.platform.announceFightError('Fight not finished');
    return [state, 'error'];
  }

  async confirmFight(state: MatchState) {
    try {
      await this.platform.announceFigthBegan(state.player1, state.player2);
      return [state, 'matchConfirmed'];
    } catch (err) {
      this.platform.announceFightError(err);
      return [state, 'matchNotConfirmed'];
    }
  }

  async askForStats(state: MatchState) {
    const [p1Stats, p2Stats] = await Promise.all([
      this.platform.askForStatsSelection(state.player1),
      this.platform.askForStatsSelection(state.player2),
    ]);
    
    state.player1.stats = p1Stats;
    state.player2.stats = p2Stats;

    return [state, 'statsAsigned'];
  }

  async askForWeapon(state: MatchState) {
    const [p1Weapon, p2Weapon] = await Promise.all([
      this.platform.askForWeaponSelection(state.player1),
      this.platform.askForWeaponSelection(state.player2),
    ]);
    
    state.player1.weapon = p1Weapon;
    state.player2.weapon = p2Weapon;

    return [state, 'weaponAsigned'];
  }

  async startFight(state: MatchState) {
    // Randomize turn
    const index = Math.floor(Math.random()*2);
    const players = [state.player1, state.player2];
    state.playerOnTurn = players[index];

    await this.platform.announceFigthBegan(state.player1, state.player2);

    return [state, 'fightBegan'];
  }

  async askForAbility(state: MatchState) {
    state.playerOnTurn.selectedAbility = await this.platform.askForWeaponAbilitySelection(state.playerOnTurn);

    return [state, 'abilityAsigned'];
  }

  async attack(state: MatchState) {
    const { opponentStats, roll } = state.playerOnTurn.attack(state.playerOnTurn.opponent);

    if (opponentStats.hp <= 0) {
      return [state, 'matchOver'];
    }

    state.playerOnTurn.opponent.stats = opponentStats;
    state.playerOnTurn = state.playerOnTurn.opponent;
    await this.platform.announceFightDamage(state.playerOnTurn.opponent);

    return [state, 'turnChanged'];
  }

  async finishMatch(state: MatchState) {
    // TODO: Calculate gold and XP
    state.player1.onMatch = false;
    state.player2.onMatch = false;

    await this.platform.announceFightFinished(state.playerOnTurn, state.playerOnTurn.opponent);

    return [state, 'matchFinished'];
  }

  async announceError(state: MatchState) {
  }
}