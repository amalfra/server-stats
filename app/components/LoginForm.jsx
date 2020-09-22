import React from 'react';
import {
  Button, Form, Input, Label, Icon, Grid, Header, TextArea, Segment,
  Message,
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

  validateInput(value, format) {
    const regex = new RegExp(format);
    return regex.test(value);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    LoginFormAction.connectToServer(this.state.remoteHost,
      this.state.sshUsername, fs.readFileSync(this.state.sshKey))
      .then(() => {
        this.props.onLoginSuccess();
      }, () => {});
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
      }).catch((err) => {
        this.pickingFile = false;
      });
  }

  render() {
    return (
      <section className="login-form">
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {this.state.connectError
              && (
              <Message negative>
                <Message.Header>That didn't work</Message.Header>
                <p>{this.state.connectError}</p>
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
                  readOnly={this.state.connecting}
                  error={this.state.remoteHostDirty
                    && this.state.remoteHostErrorStatus}
                  value={this.state.remoteHost}
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  fluid
                  name="sshUsername"
                  placeholder="SSH username"
                  readOnly={this.state.connecting}
                  error={this.state.sshUsernameDirty
                    && this.state.sshUsernameErrorStatus}
                  value={this.state.sshUsername}
                  onChange={this.handleInputChange}
                />
                <Form.Field>
                  <Input
                    fluid
                    icon
                    name="sshKey"
                    placeholder="SSH key file"
                    readOnly={this.state.connecting}
                    error={this.state.sshKeyDirty
                      && this.state.sshKeyErrorStatus}
                    value={this.state.sshKey}
                    onClick={this.handleFilepicker}
                    onFocus={this.handleFilepicker}
                  >
                    <input className="hand-cursor" />
                    <Icon name="file" />
                  </Input>
                </Form.Field>
                <Button
                  fluid
                  disabled={!this.state.isFormValid}
                  loading={this.state.connecting}
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

export default LoginForm;
