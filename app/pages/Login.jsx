import React from 'react'
import { withRouter } from 'react-router-dom'

import LoginFormComponent from '../components/LoginForm'
import AppActions from '../actions/App'

class Login extends React.Component {
  constructor() {
    super()

    this.loginSucessCallback = this.loginSucessCallback.bind(this)
  }

  loginSucessCallback(connection) {
    AppActions.setConnection(connection)
    this.props.history.push('/dashboard')
  }

  render() {
    return(
      <LoginFormComponent onLoginSuccess={this.loginSucessCallback} />
    )
  }
}

export default withRouter(Login)
