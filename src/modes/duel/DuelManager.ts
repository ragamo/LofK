import PlatformAdapter from "../../core/PlatformAdapter";
import DuelPlayer from "./DuelPlayer";
import Duel from "./Duel";
import DuelState from "./DuelState";
import DuelWeapons from "./DuelWeapons";
import { DuelWeaponAbility } from "./DuelWeapon";
import duelAnnounceNewDuel from "../../platforms/discord/apdaters/duel/duel.announceNewDuel";
import duelAnnounceError from '../../platforms/discord/apdaters/duel/duel.announceError'
import duelAnnounceDuelBegan from "../../platforms/discord/apdaters/duel/duel.announceDuelBegan";
import duelAskForAbility from "../../platforms/discord/apdaters/duel/duel.askForAbility";
import duelAnnounceDuelDamage from "../../platforms/discord/apdaters/duel/duel.announceDuelDamage";
import duelAnnounceDuelFinished from "../../platforms/discord/apdaters/duel/duel.announceDuelFinished";

export default class DuelManager {
  private duels: Map<string, Duel> = new Map<string, Duel>();
  private players: Map<string, DuelPlayer> = new Map<string, DuelPlayer>();

  private findOrCreatePlayer(playerInfo: any) {
    if (!this.players.has(playerInfo.id)) {
      const player = new DuelPlayer(playerInfo);
      this.players.set(player.id, player);
    }

    return this.players.get(playerInfo.id);
  }

  public async create(
    { player1: player1Info, player2: player2Info, platform, context }: 
    { player1: any, player2: any, platform: PlatformAdapter, context: any}
  ) {
    // Create players
    const player1: DuelPlayer = this.findOrCreatePlayer(player1Info);
    const player2: DuelPlayer = this.findOrCreatePlayer(player2Info);

    try {
      // Validate if player1 can play
      if (player1.busy) {
        throw { busyPlayer: player1 };
      }

      // Validate if player2 can play
      if (player2.busy) {
        throw { busyPlayer: player1 };
      }
    } catch ({ busyPlayer }) {
      context.reply(`<@${busyPlayer.id}> is already on a match.`);
      return;
    }
    

    // Create new match
    const duel = new Duel(player1, player2, context, platform);
    this.duels.set(duel.id, duel);

    await duel.begin();
  }

  async announceDuelError(duelState: DuelState, error: string) {
    return duelAnnounceError(duelState, error);
  }

  async announceNewDuel(duelState: DuelState) {
    return duelAnnounceNewDuel(duelState);
  }

  async announceDuelBegan(duelState: DuelState) {
    return duelAnnounceDuelBegan(duelState);
  }

  async askForWeaponAbility(duelState: DuelState): Promise<DuelWeaponAbility> {
    return duelAskForAbility(duelState);
  }

  async announceDuelDamage(duelState: DuelState, attackResult: any) {
    return duelAnnounceDuelDamage(duelState, attackResult);
  }

  async announceDuelFinished(duelState: DuelState) {
    return duelAnnounceDuelFinished(duelState);
  }

  async finishDuel(idDuel: string) {
    const duel = this.duels.get(idDuel);
    this.players.delete(duel.state.player1.id);
    this.players.delete(duel.state.player2.id);
    this.duels.delete(idDuel);
  }
  
}