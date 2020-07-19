import MatchState from "../../../../core/MatchState";

export default (state: MatchState, error: string) => {
  const message = state.context;

    if (state.timeout) {
      message.reply(error);
      return;
    }

    message.channel.send(error);
};
