import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import AppStore from './stores/App';

const AuthRoute = function (component, ...props) {
  const { component: ComponentName } = component;
  const { isPrivate } = ComponentName;
  const appState = AppStore.getState();

  if (appState.isAuthenticated) {
    return <Route {...props} element={<ComponentName />} />;
  }
  // if route is private, user is redirected to app's public root,
  // else user proceeds
  return isPrivate
    ? <Navigate to="/" />
    : <Route {...props} element={<ComponentName />} />;
};

export default AuthRoute;
