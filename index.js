// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create(
    'sessionName',
    undefined,
    (statusSession, session) => {
      console.log('Status Session: ', statusSession);
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    {
      multidevice: false // for version not multidevice use false.(default: true)
    }
  )
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    } else if (message.isGroupMsg === true) {
      console.log(message);
      client
        .sendText(message.from, message.text)
        .then((result) => {
          console.log('Result: ', result);
        })
        .catch((erro) => {
          console.log("Error: ", erro);
        });
    }
  });
}