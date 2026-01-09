import alt from '../lib/alt.js';

import AppActions from '../actions/App.js';

class App {
  constructor() {
    this.bindActions(AppActions);

    this.isAuthenticated = false;
  }

  onSetIsAuthenticated(isAuthenticated) {
    this.isAuthenticated = isAuthenticated;
  }
}

export default alt.createStore(App, 'App');
