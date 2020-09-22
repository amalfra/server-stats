import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AppStore from './stores/App';

const AuthRoute = (component, ...props) => {
  const { isPrivate } = component.component;
  const appState = AppStore.getState();

  if (appState.isAuthenticated) {
    return <Route {...props} component={component.component} />;
  }
  // if route is private, user is redirected to app's public root,
  // else user proceeds
  return isPrivate
    ? <Redirect to="/" />
    : <Route {...props} component={component.component} />;
};

export default AuthRoute;
