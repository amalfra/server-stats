import alt from '../lib/alt';

import LoginFormActions from '../actions/LoginForm';

class LoginForm {
  constructor() {
    this.bindActions(LoginFormActions);

    this.connecting = false;
    this.connectError = null;
    this.remoteHost = '';
    this.sshUsername = '';
    this.sshKey = '';
    this.isFormValid = false;
    this.remoteHostErrorStatus = true;
    this.sshUsernameErrorStatus = true;
    this.sshKeyErrorStatus = true;
    this.remoteHostDirty = false;
    this.sshUsernameDirty = false;
    this.sshKeyDirty = false;
  }

  onSetRemoteHost(remoteHost) {
    this.remoteHost = remoteHost;
  }

  onSetSshUsername(sshUsername) {
    this.sshUsername = sshUsername;
  }

  onSetSshKey(sshKey) {
    this.sshKey = sshKey;
  }

  onSetRemoteHostDirty(status) {
    this.remoteHostDirty = status;
  }

  onSetSshUsernameDirty(status) {
    this.sshUsernameDirty = status;
  }

  onSetSshKeyDirty(status) {
    this.sshKeyDirty = status;
  }

  onSetRemoteHostErrorStatus(status) {
    this.remoteHostErrorStatus = status;
    this.checkFormValidity();
  }

  onSetSshKeyErrorStatus(status) {
    this.sshKeyErrorStatus = status;
    this.checkFormValidity();
  }

  onSetSshUsernameErrorStatus(status) {
    this.sshUsernameErrorStatus = status;
    this.checkFormValidity();
  }

  checkFormValidity() {
    // form is invalid if any one field is invalid
    this.isFormValid = !this.remoteHostErrorStatus
      && !this.sshUsernameErrorStatus && !this.sshKeyErrorStatus;
  }

  onSetConnectError(err) {
    this.connectError = err;
  }

  onSetConnecting(status) {
    this.connecting = status;
  }
}

export default alt.createStore(LoginForm, 'LoginForm');
