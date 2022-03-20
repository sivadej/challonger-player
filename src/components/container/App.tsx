import React from 'react';
import client from '@client';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppProvider } from '@contexts/AppContext';
import { PlayerSetProvider } from '@contexts/PlayerSetContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from './Container';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={client}>
      <PlayerSetProvider>
        <AppProvider>
          <Container />
        </AppProvider>
      </PlayerSetProvider>
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}
