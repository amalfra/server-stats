import alt from '../lib/alt'

import AppActions from '../actions/App'

class App {
  constructor() {
    this.bindActions(AppActions)

    this.isAuthenticated = false
  }

  onSetIsAuthenticated(isAuthenticated) {
    this.isAuthenticated = isAuthenticated
  }
}

export default alt.createStore(App, 'App')
