import { assert } from 'chai'

import alt from '../../lib/alt'
import LoginFormStore from '../LoginForm'
import LoginFormActions from '../../actions/LoginForm'

describe('LoginFormStore', () => {
  it('listens for setConnecting action', () => {
    var data = true, action = LoginFormActions.SET_CONNECTING
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().connecting, data)
  })

  it('listens for setConnectError action', () => {
    var data = {message: 'error', code: 1}, action =
      LoginFormActions.SET_CONNECT_ERROR
    alt.dispatcher.dispatch({action, data})

    assert.deepEqual(LoginFormStore.getState().connectError, data)
  })

  it('listens for setRemoteHost action', () => {
    var data = 'ssh.myserver.com', action = LoginFormActions.SET_REMOTE_HOST
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().remoteHost, data)
  })

  it('listens for setSshUsername action', () => {
    var data = 'username', action = LoginFormActions.SET_SSH_USERNAME
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshUsername, data)
  })

  it('listens for setSshKey action', () => {
    var data = '/fakepath/mykey', action = LoginFormActions.SET_SSH_KEY
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshKey, data)
  })

  it('listens for setRemoteHostDirty action', () => {
    var data = true, action =
      LoginFormActions.SET_REMOTE_HOST_DIRTY
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().remoteHostDirty, data)
  })

  it('listens for setSshUsernameDirty action', () => {
    var data = true, action =
      LoginFormActions.SET_SSH_USERNAME_DIRTY
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshUsernameDirty, data)
  })

  it('listens for setSshKeyDirty action', () => {
    var data = true, action =
      LoginFormActions.SET_SSH_KEY_DIRTY
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshKeyDirty, data)
  })

  it('listens for setRemoteHostErrorStatus action', () => {
    var data = true, action =
      LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().remoteHostErrorStatus, data)
    assert.equal(LoginFormStore.getState().isFormValid, false)
  })

  it('listens for setSshKeyErrorStatus action', () => {
    var data = true, action =
      LoginFormActions.SET_SSH_KEY_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshKeyErrorStatus, data)
    assert.equal(LoginFormStore.getState().isFormValid, false)
  })

  it('listens for setSshUsernameErrorStatus action', () => {
    var data = true, action =
      LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().sshUsernameErrorStatus, data)
    assert.equal(LoginFormStore.getState().isFormValid, false)
  })

  it('verify form validation', () => {
    var data = false, action =
      LoginFormActions.SET_SSH_USERNAME_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})
    data = false, action =
      LoginFormActions.SET_SSH_KEY_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})
    data = false, action =
      LoginFormActions.SET_REMOTE_HOST_ERROR_STATUS
    alt.dispatcher.dispatch({action, data})

    assert.equal(LoginFormStore.getState().isFormValid, true)
  })

  it('verify connectToServer error', () => {
    var connectPromise = LoginFormActions.connectToServer('ssh.myserver.com',
      'username', 'fake key')
    assert.equal(LoginFormStore.getState().connecting, true)

    return connectPromise.then(() => {
      assert.fail()
    }, () => {
      assert.equal(LoginFormStore.getState().connectError,
        'Cannot parse privateKey: Unsupported key format')
    }).then(() => {
      assert.equal(LoginFormStore.getState().connecting, false)
    })
  })
})
