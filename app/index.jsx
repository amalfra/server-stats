import React from 'react';
import ReactDOM from 'react-dom';

import Router from './router';

import './app.css';

window.onload = () => {
  ReactDOM.render(<Router />, document.getElementById('app'));
};
