import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import Router from './router';

import '@mantine/core/styles.css';
import './app.css';

window.onload = () => {
  createRoot(document.getElementById('app')).render(
    <MantineProvider>
      <Router />
    </MantineProvider>,
  );
};
