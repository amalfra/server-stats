import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthRoute from './AuthRoute';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';

const Router = function () {
  return (
    <BrowserRouter>
      <Routes>
        <AuthRoute path="/dashboard" element={DashboardPage} />
        <Route path="/" element={LoginPage} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
