import alt from '../lib/alt';

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
      window.electronAPI.startSSH({
        host,
        user,
        key,
        passphrase,
      })
        .then((resp) => resolve(resp))
        .catch((err) => {
          this.setConnectError(err.message);
          return reject();
        })
        .then(() => this.setConnecting(false));
    });
  }
}

export default alt.createActions(LoginForm);
