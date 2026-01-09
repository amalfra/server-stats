import alt from '../lib/alt.js';

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

    return window.electronAPI.startSSH({
      host,
      user,
      key,
      passphrase,
    })
      .then((resp) => resp)
      .catch((err) => {
        this.setConnectError(err.message);
        throw err;
      })
      .finally(() => this.setConnecting(false));
  }
}

export default alt.createActions(LoginForm);
