import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <AuthRoute path="/dashboard" component={DashboardPage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  </BrowserRouter>
);

export default Router;
