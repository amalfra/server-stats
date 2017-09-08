import React from 'react'
import { Button, Form, Input, Label, Icon, Grid, Header, TextArea, Segment, Message }
  from 'semantic-ui-react'
import { remote as Remote } from 'electron'
const fs = require('fs')

import LoginFormStore from '../stores/LoginForm'
import LoginFormAction from '../actions/LoginForm'

const inputValidFormats = {
  'remoteHost': '^.+$',
  'sshUsername': '^.+$',
  'sshKey': '^(.|[\r\n])+$'
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = LoginFormStore.getState()
    this.onChange = this.onChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFilepicker = this.handleFilepicker.bind(this)
    this.pickingFile = false
  }

  componentDidMount() {
    LoginFormStore.listen(this.onChange)
  }

  componentWillUnmount() {
    LoginFormStore.unlisten(this.onChange)
  }

  onChange(state) {
    this.setState(state)
  }

  handleInputChange(e, name, value) {
    let inputName = e ? e.target.name : name
    let inputValue = e ? e.target.value : value
    // validate the field value and set dirty status
    this.state.inputErrorStatus[inputName] = !this.validateInput(
      inputValue, inputValidFormats[inputName])
    this.state.inputDirty[inputName] = true

    // form is invalid if any one field's value is invalid
    let isFormValid = true
    for (const key of Object.keys(this.state.inputErrorStatus)) {
      if (this.state.inputErrorStatus[key]) {
        isFormValid = false
        break
      }
    }
    var newState = {
      'inputDirty': this.state.inputDirty,
      'inputErrorStatus': this.state.inputErrorStatus,
      'isFormValid': isFormValid,
      'connectError': null
    }
    newState[inputName] = inputValue
    LoginFormAction.setStateKeys(newState)
  }

  validateInput(value, format) {
    let regex = new RegExp(format)
    return regex.test(value)
  }

  handleFormSubmit(e) {
    e.preventDefault()
    LoginFormAction.setStateKeys({
      connecting: true,
      connectError: null
    })
    LoginFormAction.connectToServer(this.state.remoteHost,
      this.state.sshUsername, fs.readFileSync(this.state.sshKey))
    .then((connection) => {
      this.props.onLoginSuccess(connection)
    }, (err) => {
      LoginFormAction.connectToServerFailed(err)
    }).then(() => {
      LoginFormAction.setStateKeys({
        connecting: false
      })
    })
  }

  handleFilepicker(e) {
    e.preventDefault()
    e.target.blur()
    if (e.target.readOnly || this.pickingFile) {
      return
    }
    this.pickingFile = true
    Remote.dialog.showOpenDialog((fileNames) => {
      this.pickingFile = false
      // fileNames is an array that contains all selected files
      if (!fileNames) {
          return
      }
      this.handleInputChange(null, 'sshKey', fileNames[0])
    })
  }

  render() {
    return(
      <section className='login-form'>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {this.state.connectError &&
              <Message negative>
                <Message.Header>That didn't work</Message.Header>
                <p>{this.state.connectError}</p>
              </Message>
            }
            <Header as='h2' color='teal' textAlign='center'>
              Connect to your server
            </Header>
            <Form size='large' onSubmit={this.handleFormSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  name='remoteHost'
                  placeholder='Remote host'
                  readOnly={this.state.connecting}
                  error={this.state.inputDirty.remoteHost &&
                    this.state.inputErrorStatus.remoteHost}
                  value={this.state.remoteHost}
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  fluid
                  name='sshUsername'
                  placeholder='SSH username'
                  readOnly={this.state.connecting}
                  error={this.state.inputDirty.sshUsername &&
                    this.state.inputErrorStatus.sshUsername}
                  value={this.state.sshUsername}
                  onChange={this.handleInputChange}
                />
                <Form.Field >
                  <Input
                    fluid
                    icon
                    name='sshKey'
                    placeholder='SSH key file'
                    readOnly={this.state.connecting}
                    error={this.state.inputDirty.sshKey &&
                      this.state.inputErrorStatus.sshKey}
                    value={this.state.sshKey}
                    onClick={this.handleFilepicker}
                    onFocus={this.handleFilepicker}
                  >
                    <input className='hand-cursor'/>
                    <Icon name='file' />
                  </Input>
                </Form.Field>
                <Button
                  fluid
                  disabled={!this.state.isFormValid}
                  loading={this.state.connecting}
                  color='teal'
                  size='large'>Connect</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </section>
    )
  }
}

export default LoginForm
