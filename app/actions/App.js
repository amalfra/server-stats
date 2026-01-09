import alt from '../lib/alt.js';

class App {
  constructor() {
    this.generateActions('setIsAuthenticated');
  }
}

export default alt.createActions(App);
