import alt from '../lib/alt'

class App {
  constructor() {
    this.generateActions(
      'setIsAuthenticated'
    )
  }
}

export default alt.createActions(App)
