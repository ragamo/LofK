import Discord from 'discord.js';
import { EventEmitter } from "events";
import Match from "../../../core/Match";
import Player from '../../../core/Player';
import { table } from 'table';
import PlayerStats from '../../../interfaces/interface.player.stats';

export default class StatSelection {
  private eventManager: EventEmitter;
  private options = ['🍬', '🍩', '🍖', '🍔', '🍟'];

  constructor(eventManager: EventEmitter) {
    this.eventManager = eventManager;
  }

  public execute(match: Match) {
    const sourceMessage: Discord.Message = match.getContext();
    this.askForSelection(match.player1, sourceMessage);
    this.askForSelection(match.player2, sourceMessage);
  }

  private async askForSelection(player: Player, message: Discord.Message) {
    const statsEntries = this.statsTable(player.eligibleStats);
    const statsTable = table(statsEntries);
    const msg = await message.channel.send(`Choose your stats by reacting to this message <@${player.id}>\`\`\`${statsTable}\`\`\``);

    for (let i=0; i < statsEntries.length - 1; i++) {
      msg.react(this.options[i]);
    }
  }

  private statsTable(eligibleStats: PlayerStats[]) {
    const header = ['', 'str', 'dex', 'int'];

    const entries = eligibleStats.reduce((carry: any, current: PlayerStats, index: number) => {
      carry.push([this.options[index], current.str, current.dex, current.int]);
      return carry;
    }, [header]);

    return entries;
  }
};