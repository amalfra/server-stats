import React from 'react';
import { func } from 'prop-types';
import {
  Alert, Button, Center, Paper, Stack, TextInput, Title,
} from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

import LoginFormStore from '../stores/LoginForm';
import LoginFormAction from '../actions/LoginForm';
import Utils from '../Utils';

const inputValidFormats = {
  RemoteHost: '^.+$',
  SshUsername: '^.+$',
  SshKey: '^(.|[\r\n])+$',
};

const handleInputChange = (e, name, value) => {
  let inputName = e ? e.target.name : name;
  const inputValue = (e ? e.target.value : value) || '';
  inputName = Utils.capitalizeFirstLetter(inputName);
  // validate the field value and set dirty status

  const errorStatus = !new RegExp(inputValidFormats[inputName]).test(inputValue);
  LoginFormAction[`set${inputName}`](inputValue);
  LoginFormAction[`set${inputName}Dirty`](true);
  LoginFormAction[`set${inputName}ErrorStatus`](errorStatus);
  LoginFormAction.setConnectError(null);
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = LoginFormStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFilepicker = this.handleFilepicker.bind(this);
    this.pickingFile = false;
  }

  componentDidMount() {
    LoginFormStore.listen(this.onChange);
  }

  componentWillUnmount() {
    LoginFormStore.unlisten(this.onChange);
  }

  handleFormSubmit(e) {
    const {
      remoteHost, sshUsername, sshKey, passphrase,
    } = this.state;
    const { onLoginSuccess } = this.props;

    e.preventDefault();
    window.electronAPI.readFile(sshKey)
      .then((result) => {
        LoginFormAction.connectToServer(
          remoteHost,
          sshUsername,
          result,
          passphrase,
        )
          .then(onLoginSuccess, () => {});
      });
  }

  handleFilepicker(e) {
    e.preventDefault();
    e.target.blur();
    if (e.target.readOnly || this.pickingFile) {
      return;
    }
    this.pickingFile = true;
    window.electronAPI.openFile()
      .then((result) => {
        this.pickingFile = false;

        if (!result) {
          return;
        }
        handleInputChange(null, 'sshKey', result);
      }).catch(() => {
        this.pickingFile = false;
      });
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    const {
      connectError,
      connecting,
      remoteHostDirty,
      isFormValid,
      remoteHostErrorStatus,
      remoteHost,
      sshUsernameDirty,
      sshUsernameErrorStatus,
      sshUsername,
      sshKeyDirty,
      sshKeyErrorStatus,
      sshKey,
      passphrase,
      passphraseDirty,
      passphraseErrorStatus,
    } = this.state;

    return (
      <section className="login-form">
        <Center h="100%" p="md">
          <Paper w="100%" maw={450} p="lg" shadow="sm" withBorder>
            {connectError
              && (
              <Alert color="red" title="That didn&apos;t work" mb="md">
                {connectError}
              </Alert>
              )}
            <Title order={2} c="teal" ta="center" mb="lg">
              Connect to your server
            </Title>
            <form onSubmit={this.handleFormSubmit}>
              <Stack gap="md">
                <TextInput
                  name="remoteHost"
                  placeholder="Remote host"
                  readOnly={connecting}
                  error={remoteHostDirty && remoteHostErrorStatus ? 'Remote host is required' : null}
                  value={remoteHost}
                  onChange={handleInputChange}
                />
                <TextInput
                  name="sshUsername"
                  placeholder="SSH username"
                  readOnly={connecting}
                  error={sshUsernameDirty && sshUsernameErrorStatus ? 'SSH username is required' : null}
                  value={sshUsername}
                  onChange={handleInputChange}
                />
                <TextInput
                  name="sshKey"
                  placeholder="SSH key file"
                  readOnly={connecting}
                  error={sshKeyDirty && sshKeyErrorStatus ? 'SSH key file is required' : null}
                  value={sshKey}
                  rightSection={<IconFile size={16} />}
                  rightSectionPointerEvents="none"
                  className="hand-cursor"
                  onClick={this.handleFilepicker}
                  onFocus={this.handleFilepicker}
                />
                <TextInput
                  name="passphrase"
                  placeholder="SSH key passphrase (optional)"
                  readOnly={connecting}
                  error={passphraseDirty && passphraseErrorStatus ? 'Invalid passphrase' : null}
                  value={passphrase}
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  disabled={!isFormValid}
                  loading={connecting}
                  color="teal"
                  size="md"
                >
                  Connect
                </Button>
              </Stack>
            </form>
          </Paper>
        </Center>
      </section>
    );
  }
}

LoginForm.propTypes = {
  onLoginSuccess: func,
};

LoginForm.defaultProps = {
  onLoginSuccess: null,
};

export default LoginForm;
