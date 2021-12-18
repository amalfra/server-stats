import alt from '../lib/alt';

import SSHConnection from '../lib/SSHConnection';

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
      'setSshUsernameErrorStatus',
      'setPassphrase',
      'setPassphraseDirty',
      'setPassphraseErrorStatus',
    );
  }

  connectToServer(host, user, key, passphrase) {
    this.setConnectError(null);
    this.setConnecting(true);

    return new Promise((resolve, reject) => {
      SSHConnection.establish(host, user, key, passphrase)
        .then((resp) => resolve(resp), (err) => {
          this.setConnectError(err.message);
          return reject();
        })
        .then(() => this.setConnecting(false));
    });
  }
}

export default alt.createActions(LoginForm);
