import React from 'react';
import { useNavigate } from 'react-router-dom';

import LoginFormComponent from '../components/LoginForm';
import AppActions from '../actions/App';

class Login extends React.Component {
  navigate = useNavigate();

  constructor() {
    super();

    this.loginSucessCallback = this.loginSucessCallback.bind(this);
  }

  loginSucessCallback() {
    AppActions.setIsAuthenticated(true);
    this.navigate('/dashboard');
  }

  render() {
    return (
      <LoginFormComponent onLoginSuccess={this.loginSucessCallback} />
    );
  }
}

export default Login;
