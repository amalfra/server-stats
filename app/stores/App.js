import alt from '../lib/alt'

import AppActions from '../actions/App'

class App {
  constructor() {
    this.bindActions(AppActions)

    this.serverConnection = null
  }

  onSetConnection(connection) {
    this.serverConnection = connection
  }
}

export default alt.createStore(App, 'App')
