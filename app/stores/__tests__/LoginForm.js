import alt from '../../lib/alt';
import LoginFormStore from '../LoginForm';
import LoginFormActions from '../../actions/LoginForm';

describe('LoginFormStore', () => {
  it('listens for setConnecting action', () => {
    const data = true; const
      action = LoginFormActions.SET_CONNECTING;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().connecting).toEqual(data);
  });

  it('listens for setConnectError action', () => {
    const data = { message: 'error', code: 1 }; const
      action = LoginFormActions.SET_CONNECT_ERROR;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().connectError).toEqual(data);
  });

  it('listens for setRemoteHost action', () => {
    const data = 'ssh.myserver.com'; const
      action = LoginFormActions.SET_REMOTE_HOST;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().remoteHost).toEqual(data);
  });

  it('listens for setSshUsername action', () => {
    const data = 'username'; const
      action = LoginFormActions.SET_SSH_USERNAME;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshUsername).toEqual(data);
  });

  it('listens for setSshKey action', () => {
    const data = '/fakepath/mykey'; const
      action = LoginFormActions.SET_SSH_KEY;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshKey).toEqual(data);
  });

  it('listens for setRemoteHostDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_REMOTE_HOST_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().remoteHostDirty).toEqual(data);
  });

  it('listens for setSshUsernameDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_USERNAME_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshUsernameDirty).toEqual(data);
  });

  it('listens for setSshKeyDirty action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_KEY_DIRTY;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshKeyDirty).toEqual(data);
  });

  it('listens for setRemoteHostErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().remoteHostErrorStatus).toEqual(data);
    expect(LoginFormStore.getState().isFormValid).toEqual(false);
  });

  it('listens for setSshKeyErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_KEY_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshKeyErrorStatus).toEqual(data);
    expect(LoginFormStore.getState().isFormValid).toEqual(false);
  });

  it('listens for setSshUsernameErrorStatus action', () => {
    const data = true; const
      action = LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().sshUsernameErrorStatus).toEqual(data);
    expect(LoginFormStore.getState().isFormValid).toEqual(false);
  });

  it('verify form validation', () => {
    let data = false; let
      action = LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });
    data = false;
    action = LoginFormActions.SET_SSH_KEY_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });
    data = false;
    action = LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS;
    alt.dispatcher.dispatch({ action, data });

    expect(LoginFormStore.getState().isFormValid).toEqual(true);
  });

  it('verify connectToServer error', () => {
    const connectPromise = LoginFormActions.connectToServer(
      'ssh.myserver.com',
      'username',
      'fake key',
    );
    expect(LoginFormStore.getState().connecting).toEqual(true);

    return connectPromise.then(() => {
      throw new Error('fail');
    }, () => {
      expect(
        LoginFormStore.getState().connectError,
      ).toEqual('Cannot parse privateKey: Unsupported key format');
    }).then(() => {
      expect(LoginFormStore.getState().connecting).toEqual(false);
    });
  });
});
