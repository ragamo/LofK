import { v4 as uuidv4 } from 'uuid';
import Player from "./Player";
import FSM from './FSM';
import PlayerStats from '../interfaces/interface.player.stats';
import Platform from '../interfaces/Platform';
import MatchState from './MatchState';

export default class Match {
  public id: string;
  private platform: Platform;
  private context: any;

  public state: MatchState;

  private log: any;

  constructor(player1: Player, player2: Player, platform: Platform, context: any) {
    this.id = uuidv4();
    this.platform = platform;
    this.context = context;
    this.state = new MatchState(player1, player2);
    
    this.handleStates();
  }

  private handleStates() {
    const fsm = new FSM();

    fsm.addState('creatingMatch')
      .onEvent('matchConfirmed')
        .goTo('asigningStats').do(this.askForStats)
      .onEvent('matchNotConfirmed')
        .doDefaultError();

    fsm.addState('asigningStats')
      .onEvent('statsAsigned')
        .goTo('asigningWeapon').do(this.askForWeapon)
      .onEvent('statsNotAsigned')
        .doDefaultError();

    fsm.addState('asigningWeapon')
      .onEvent('weaponAsigned')
        .goTo('startFighting').do(this.startFight)
      .onEvent('weaponNotAsigned')
        .doDefaultError();

    fsm.addState('startFighting')
      .onEvent('fightBegan')
        .goTo('asigningAbility').do(this.askForAbility)
      .onEvent('error')
        .doDefaultError();

    fsm.addState('asigningAbility')
      .onEvent('abilityAssigned')
        .goTo('attacking').do(this.attack)
      .onEvent('abilityNotAsigned')
        .doDefaultError();

    fsm.addState('attacking')
      .onEvent('turnChanged')
        .goTo('asigningAbility').do(this.askForAbility)
      .onEvent('matchOver')
        .goTo('finishingMatch').do(this.finishMatch)

    fsm.addState('finishingMatch')
      .onEvent('matchFinished')
        .goTo('finishing').doNothing()

    fsm.setLastState('finishing');

    fsm.run(this.state);
  }
  
  public getContext() {
    return this.context;
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
    const opponentStats = state.playerOnTurn.attack(state.playerOnTurn.opponent);

    if (opponentStats.hp <= 0) {
      return [state, 'matchOver'];
    }

    state.playerOnTurn.opponent.stats = opponentStats;
    state.playerOnTurn = state.playerOnTurn.opponent;
    await this.platform.announceFightDamage(opponentStats);

    return [state, 'turnChanged'];
  }

  async finishMatch(state: MatchState) {
    // TODO: Calculate gold and XP
    state.player1.onMatch = false;
    state.player2.onMatch = false;

    await this.platform.announceFightFinished(state.playerOnTurn, state.playerOnTurn.opponent);

    return [state, 'matchFinished'];
  }
}