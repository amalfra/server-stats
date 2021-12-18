import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import AuthRoute from './AuthRoute';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';

const Router = function () {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/dashboard/*"
          element={<AuthRoute component={DashboardPage} />}
        />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
