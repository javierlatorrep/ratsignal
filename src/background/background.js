import browser from '../namespace'
import RatSocket from './services/RatSocket'

let guestsCount = 0;

function onSocketMessage(message) {
  switch(message.type) {
    case 'RAT_REQUEST':
      browser.notifications.create({
        iconUrl: browser.runtime.getURL('icons/ratsignal-32.png'),
        type: 'basic',
        title: 'A ratear!',
        message: 'Somebody is looking for you to RAT!',
        buttons: [
          { title: 'Accept' },
          { title: 'Cancel' }
        ]
      });
      break;

    case 'RAT_ACCEPT':
      guestsCount = guestsCount + 1;

      browser.notifications.create({
        iconUrl: browser.runtime.getURL('icons/ratsignal-32.png'),
        type: 'basic',
        title: 'A ratear!',
        message: `${guestsCount} guest(s) have accepted so far!`,
      });
      break;

    default:
      console.warn('Unknown socket action type "%s"!', message.type);
      break;
  }
}

browser.runtime.onInstalled.addListener(() => {
  const ratSocket = new RatSocket('wss://echo.websocket.org/');

  ratSocket.on('message', onSocketMessage);
  ratSocket.connect();

  browser.runtime.onMessage.addListener((action) => {
    switch (action.type) {
      case 'RAT_REQUEST':
        ratSocket.broadcast({ type: 'RAT_REQUEST' });
        break;

      default:
        console.warn('Unknown user action type "%s"!', action.type);
        break;
    }
  });

  browser.notifications.onButtonClicked.addListener((id, button) => {
    const hasClickedAcceptButton = button === 0;

    if (hasClickedAcceptButton) {
      ratSocket.broadcast({ type: 'RAT_ACCEPT' });
    }

    browser.notifications.clear(id);
  });
});
