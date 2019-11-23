import browser from '../namespace'
import RatSocket from './services/RatSocket'

function initSocket() {
  const onMessage = function(stringData) {
    const data = JSON.parse(stringData);
    console.log('data: ', data);
    const { id, notification } = data;
    browser.notifications.create(id, notification);
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

    switch(id) {
      case 'RAT_ACTION':
        ratSocket.send(JSON.stringify(data));
        break;
    }
  });

  browser.notifications.onButtonClicked.addListener((e,button) => console.log(e, button));
});
