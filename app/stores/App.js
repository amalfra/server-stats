import alt from '../lib/alt'

import AppActions from '../actions/App'

class App {
  constructor() {
    this.bindActions(AppActions)
  }
}

export default alt.createStore(App, 'App')
