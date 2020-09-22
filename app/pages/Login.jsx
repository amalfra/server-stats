import React from 'react';
import { func } from 'prop-types';
import { withRouter } from 'react-router-dom';

import LoginFormComponent from '../components/LoginForm';
import AppActions from '../actions/App';

class Login extends React.Component {
  static propTypes = {
    history: func,
  };

  constructor() {
    super();

    this.loginSucessCallback = this.loginSucessCallback.bind(this);
  }

  loginSucessCallback() {
    AppActions.setIsAuthenticated(true);
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <LoginFormComponent onLoginSuccess={this.loginSucessCallback} />
    );
  }
}

export default withRouter(Login);
