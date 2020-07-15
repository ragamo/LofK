/* import './dotenv';
import { server } from './core/Lofk';

server('discord'); */





const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message: any => {
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

client.login(process.env.DISCOR_TOKEN);