import DuelState from "../../../../modes/duel/DuelState";

export default (state: DuelState, error: string) => {
  const message = state.context;

    if (state.timeout) {
      message.reply(error);
      return;
    }

    message.channel.send(error);
};
