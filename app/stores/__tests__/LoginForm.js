import { assert } from 'chai';

import alt from '../../lib/alt';
import LoginFormStore from '../LoginForm';
import LoginFormActions from '../../actions/LoginForm';

describe('LoginFormStore', () => {
  it('listens for setConnecting action', () => {
    const data = true; const
      action = LoginFormActions.SET_CONNECTING;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().connecting, data);
  });

  it('listens for setConnectError action', () => {
    const data = { message: 'error', code: 1 }; const
      action = LoginFormActions.SET_CONNECT_ERROR;
    alt.dispatcher.dispatch({ action, data });

    assert.deepEqual(LoginFormStore.getState().connectError, data);
  });

  it('listens for setRemoteHost action', () => {
    const data = 'ssh.myserver.com'; const
      action = LoginFormActions.SET_REMOTE_HOST;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().remoteHost, data);
  });

  it('listens for setSshUsername action', () => {
    const data = 'username'; const
      action = LoginFormActions.SET_SSH_USERNAME;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshUsername, data);
  });

  it('listens for setSshKey action', () => {
    const data = '/fakepath/mykey'; const
      action = LoginFormActions.SET_SSH_KEY;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshKey, data);
  });

  it('listens for setRemoteHostDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_REMOTE_HOST_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().remoteHostDirty, data);
  });

  it('listens for setSshUsernameDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_USERNAME_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshUsernameDirty, data);
  });

  it('listens for setSshKeyDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_KEY_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshKeyDirty, data);
  });

  it('listens for setRemoteHostErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().remoteHostErrorStatus, data);
    assert.equal(LoginFormStore.getState().isFormValid, false);
  });

  it('listens for setSshKeyErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_KEY_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshKeyErrorStatus, data);
    assert.equal(LoginFormStore.getState().isFormValid, false);
  });

  it('listens for setSshUsernameErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().sshUsernameErrorStatus, data);
    assert.equal(LoginFormStore.getState().isFormValid, false);
  });

  it('verify form validation', () => {
    let data = false; let
      action = LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });
    data = false, action = LoginFormActions.SET_SSH_KEY_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });
    data = false, action = LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(LoginFormStore.getState().isFormValid, true);
  });

  it('verify connectToServer error', () => {
    const connectPromise = LoginFormActions.connectToServer('ssh.myserver.com',
      'username', 'fake key');
    assert.equal(LoginFormStore.getState().connecting, true);

    return connectPromise.then(() => {
      assert.fail();
    }, () => {
      assert.equal(LoginFormStore.getState().connectError,
        'Cannot parse privateKey: Unsupported key format');
    }).then(() => {
      assert.equal(LoginFormStore.getState().connecting, false);
    });
  });
});
