const Discord = require('discord.js');

const parseMessageContent = (eventManager, message) => {
  if (message.content.startsWith('lofk')) {
    // TODO: processCommand();
  }

  /* eventManager.emit('attack', {
    user: idUser
  }); */
};

module.exports = (eventManager, auth = {}) => {
  const discordClient = new Discord.Client();

  // Connection status
  discordClient.once('ready', () => {
    eventManager.emit('ready');
  });

  // Message mapper
  discordClient.on('message', message => {
    parseMessageContent(eventManager, message);
    // console.log(message);

    if (message.content === 'el tarro') {
      // send back "Pong." to the channel the message was sent in
      // message.channel.send('Pong.');
      message.reply('hola');
    }

    if (message.content === 'el tarro saluda') {
      // send back "Pong." to the channel the message was sent in
      message.channel.send('Me saqué la chucha.');
    }
  });

  // Login
  discordClient.login(auth.token);
};

