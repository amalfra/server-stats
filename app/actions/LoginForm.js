import alt from '../lib/alt'

import SSHConnection from '../lib/SSHConnection'

class LoginForm {
  connectToServer(host, user, key) {
    let connection = new SSHConnection(host, user, key)

    return new Promise((resolve, reject) => {
      connection.establish().then((resp) => {
        resolve(connection)
      }, (err) => {
        reject(err)
      })
    })
  }

  connectToServerFailed(err) {
    return err
  }

  // set multiple state keys with values in one go
  setStateKeys(keyVals) {
    return keyVals
  }
}

export default alt.createActions(LoginForm)
