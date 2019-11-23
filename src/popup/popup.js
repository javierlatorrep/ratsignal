import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import browser from '../namespace'

ReactDOM.render(
  <button className='ratButton'>Hello, world!</button>,
  document.getElementById('app')
);

const ratActionMessage = {
  id: 'RAT_ACTION',
  notification: {
    iconUrl: browser.runtime.getURL('icons/ratsignal-32.png'),
    type: 'basic',
    title: 'A ratear!',
    message: 'Somebody is looking for you to RAT!',
    buttons: [
      {title: 'Accept'},
      {title:'Cancel'}
    ]
  }
};

document.querySelector('.ratButton').addEventListener("click", () => {
  browser.runtime.sendMessage(ratActionMessage);
});
