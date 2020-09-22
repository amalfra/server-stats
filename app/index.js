import React from 'react';
import ReactDOM from 'react-dom';

import Router from './router';

import 'semantic-ui-css/semantic.min.css';
import './app.css';

window.onload = function () {
  ReactDOM.render(<Router />, document.getElementById('app'));
};
