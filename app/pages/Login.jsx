import React from 'react';
import { shape } from 'prop-types';
import { withRouter } from 'react-router-dom';

import LoginFormComponent from '../components/LoginForm';
import AppActions from '../actions/App';

class Login extends React.Component {
  constructor() {
    super();

    this.loginSucessCallback = this.loginSucessCallback.bind(this);
  }

  loginSucessCallback() {
    const { history } = this.props;

    AppActions.setIsAuthenticated(true);
    history.push('/dashboard');
  }

  render() {
    return (
      <LoginFormComponent onLoginSuccess={this.loginSucessCallback} />
    );
  }
}

Login.propTypes = {
  history: shape({}).isRequired,
};

export default withRouter(Login);
