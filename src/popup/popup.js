import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import browser from '../namespace'

ReactDOM.render(
  <button className='ratButton'>Rat me! Rat you!</button>,
  document.getElementById('app')
);

document.querySelector('.ratButton').addEventListener('click', () => {
  browser.runtime.sendMessage({
    type: 'RAT_REQUEST',
  });
});
