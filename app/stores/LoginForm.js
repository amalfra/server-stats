import alt from '../lib/alt'

import LoginFormActions from '../actions/LoginForm'

class LoginForm {
  constructor() {
    this.bindActions(LoginFormActions)

    this.connecting = false
    this.connectError = null

    this.resetInputValues()
    this.resetInputErrorStatus()
    this.resetInputDirty()
  }

  resetInputValues() {
    this.remoteHost = ''
    this.sshUsername = ''
    this.sshKey = ''
  }

  resetInputDirty() {
    this.inputDirty = {
      remoteHost: false,
      sshUsername: false,
      sshKey: false
    }
  }

  resetInputErrorStatus() {
    this.isFormValid = false
    this.inputErrorStatus = {
      remoteHost: true,
      sshUsername: true,
      sshKey: true
    }
  }

  // set multiple state keys with provided values in one go
  onSetStateKeys(keyVals) {
    for (const key of Object.keys(keyVals)) {
      this[key] = keyVals[key]
    }
  }

  onConnectToServerFailed(err) {
    this.connectError = err.message
  }
}

export default alt.createStore(LoginForm, 'LoginForm')
