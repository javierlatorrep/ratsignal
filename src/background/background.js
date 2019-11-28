import browser from '../namespace'
import RatSocket from './services/RatSocket'

let counter = 0;

const userId = Math.random(10000) + '' + Date.now();

function initSocket() {
  const onMessage = function (stringMessage) {
    const {id, userId:senderId} = JSON.parse(stringMessage);
    if (senderId === userId) {
      return;
    }
    const notification = {
      iconUrl: browser.runtime.getURL('icons/ratsignal-32.png'),
      type: 'basic',
      title: 'A ratear!',
      message: 'Somebody is looking for you to RAT!',
      buttons: [
        { title: 'Accept' },
        { title: 'Cancel' }
      ]
    }
    browser.notifications.create(id, notification);
    counter = counter + 1;
  }

  var ratSocket = new RatSocket(
    'wss://echo.websocket.org/',
    onMessage,
  );
  ratSocket.start();

  return ratSocket;
}

browser.runtime.onInstalled.addListener(() => {
  const ratSocket = initSocket();

  browser.runtime.onMessage.addListener((data) => {
    const { id } = data;

    switch (id) {
      case 'RAT_ACTION':
        ratSocket.send(JSON.stringify({id, userId}));
        break;
    }
  });

  browser.notifications.onButtonClicked.addListener((id, button) => {
    console.log(id, button);
    if (button === 0) {
      ratSocket.send(JSON.stringify({id, userId}));
    }
    browser.notifications.clear(id);
  });
});


