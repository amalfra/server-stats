import alt from '../lib/alt'

import SSHConnection from '../lib/SSHConnection'

class LoginForm {
  constructor() {
    this.generateActions(
      'setConnecting',
      'setConnectError',
      'setRemoteHost',
      'setSshUsername',
      'setSshKey',
      'setRemoteHostDirty',
      'setSshUsernameDirty',
      'setSshKeyDirty',
      'setRemoteHostErrorStatus',
      'setSshKeyErrorStatus',
      'setSshUsernameErrorStatus'
    )
  }

  connectToServer(host, user, key) {
    this.setConnectError(null)
    this.setConnecting(true)

    return new Promise((resolve, reject) => {
      SSHConnection.establish(host, user, key)
        .then((resp) => {
          return resolve(resp)
        }, (err) => {
          this.setConnectError(err.message)
          return reject()
        })
        .then(() => {
          return this.setConnecting(false)
        })
    })
  }
}

export default alt.createActions(LoginForm)
