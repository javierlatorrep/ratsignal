import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import browser from '../namespace'

ReactDOM.render(
  <button className='ratButton'>Hello, world!</button>,
  document.getElementById('app')
);

const ratActionMessage = {
  id: 'RAT_ACTION'
};

document.querySelector('.ratButton').addEventListener("click", () => {
  browser.runtime.sendMessage(ratActionMessage);
});
