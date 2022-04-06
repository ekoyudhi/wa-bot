// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const process = require('process')

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
      multidevice: false, // for version not multidevice use false.(default: true)
      createPathFileToken: true
    }
  )
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
  const browserSessionToken = await client.getSessionTokenBrowser();
  await client.onMessage(async (message) => {
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
      //console.log(message);
      client
        .sendText(message.from, message.body)
        .then((result) => {
          console.log('Result: ', result);
        })
        .catch((erro) => {
          console.log("Error: ", erro);
        });
    }
  });

  // function to detect conflits and change status
  // Force it to keep the current session
  // Possible state values:
  // CONFLICT
  // CONNECTED
  // DEPRECATED_VERSION
  // OPENING
  // PAIRING
  // PROXYBLOCK
  // SMB_TOS_BLOCK
  // TIMEOUT
  // TOS_BLOCK
  // UNLAUNCHED
  // UNPAIRED
  // UNPAIRED_IDLE
  client.onStateChange((state) => {
    console.log('State changed: ', state);
    // force whatsapp take over
    if ('CONFLICT'.includes(state)) client.useHere();
    // detect disconnect on whatsapp
    if ('UNPAIRED'.includes(state)) console.log('logout');
  });

  // DISCONNECTED
  // SYNCING
  // RESUMING
  // CONNECTED
  let time = 0;
  client.onStreamChange((state) => {
    console.log('State Connection Stream: ' + state);
    clearTimeout(time);
    if (state === 'DISCONNECTED' || state === 'SYNCING') {
      time = setTimeout(() => {
        client.close();
      }, 80000);
    }
  });

  // function to detect incoming call
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Sorry, I still can't answer calls");
  });

  // Catch ctrl+C
  process.on('SIGINT', function() {
    client.close();
    console.log("CTRL+C ditekan")
  });
}