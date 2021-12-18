import React from 'react';
import { useNavigate } from 'react-router-dom';

import LoginFormComponent from '../components/LoginForm';
import AppActions from '../actions/App';

const Login = function () {
  const navigate = useNavigate();

  const loginSucessCallback = () => {
    AppActions.setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <LoginFormComponent onLoginSuccess={loginSucessCallback} />
  );
};

export default Login;
