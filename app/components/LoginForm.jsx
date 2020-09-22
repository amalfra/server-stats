import React from 'react';
import { func } from 'prop-types';
import {
  Button, Form, Input, Icon, Grid, Header, Segment, Message,
} from 'semantic-ui-react';
import electron from 'electron';
import fs from 'fs';

import LoginFormStore from '../stores/LoginForm';
import LoginFormAction from '../actions/LoginForm';
import Utils from '../Utils';

const { remote: { dialog } } = electron;

const inputValidFormats = {
  RemoteHost: '^.+$',
  SshUsername: '^.+$',
  SshKey: '^(.|[\r\n])+$',
};
const dialogOptions = {
  properties: ['openFile'],
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = LoginFormStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  onChange(state) {
    this.setState(state);
  }

  validateInput = (value, format) => {
    const regex = new RegExp(format);
    return regex.test(value);
  };

  handleInputChange(e, name, value) {
    let inputName = e ? e.target.name : name;
    const inputValue = e ? e.target.value : value;
    inputName = Utils.capitalizeFirstLetter(inputName);
    // validate the field value and set dirty status
    const errorStatus = !this.validateInput(
      inputValue, inputValidFormats[inputName],
    );
    LoginFormAction[`set${inputName}`](inputValue);
    LoginFormAction[`set${inputName}Dirty`](true);
    LoginFormAction[`set${inputName}ErrorStatus`](errorStatus);
    LoginFormAction.setConnectError(null);
  }

  handleFormSubmit(e) {
    const { remoteHost, sshUsername, sshKey } = this.state;
    const { onLoginSuccess } = this.props;

    e.preventDefault();
    LoginFormAction.connectToServer(remoteHost,
      sshUsername, fs.readFileSync(sshKey))
      .then(onLoginSuccess, () => {});
  }

  handleFilepicker(e) {
    e.preventDefault();
    e.target.blur();
    if (e.target.readOnly || this.pickingFile) {
      return;
    }
    this.pickingFile = true;
    dialog.showOpenDialog(dialogOptions)
      .then((result) => {
        this.pickingFile = false;

        // fileNames is an array that contains all selected files
        if (!result.filePaths) {
          return;
        }
        this.handleInputChange(null, 'sshKey', result.filePaths[0]);
      }).catch(() => {
        this.pickingFile = false;
      });
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
    } = this.state;

    return (
      <section className="login-form">
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {connectError
              && (
              <Message negative>
                <Message.Header>That didn&apos;t work</Message.Header>
                <p>{connectError}</p>
              </Message>
              )}
            <Header as="h2" color="teal" textAlign="center">
              Connect to your server
            </Header>
            <Form size="large" onSubmit={this.handleFormSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  name="remoteHost"
                  placeholder="Remote host"
                  readOnly={connecting}
                  error={remoteHostDirty && remoteHostErrorStatus}
                  value={remoteHost}
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  fluid
                  name="sshUsername"
                  placeholder="SSH username"
                  readOnly={connecting}
                  error={sshUsernameDirty && sshUsernameErrorStatus}
                  value={sshUsername}
                  onChange={this.handleInputChange}
                />
                <Form.Field>
                  <Input
                    fluid
                    icon
                    name="sshKey"
                    placeholder="SSH key file"
                    readOnly={connecting}
                    error={sshKeyDirty && sshKeyErrorStatus}
                    value={sshKey}
                    onClick={this.handleFilepicker}
                    onFocus={this.handleFilepicker}
                  >
                    <input className="hand-cursor" />
                    <Icon name="file" />
                  </Input>
                </Form.Field>
                <Button
                  fluid
                  disabled={!isFormValid}
                  loading={connecting}
                  color="teal"
                  size="large"
                >
                  Connect
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
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
