import React from 'react';
import client from '@client';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppProvider } from '@contexts/AppContext';
import { PlayerSetProvider } from '@contexts/PlayerSetContext';
import Players from '@components/player-select';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={client}>
      <PlayerSetProvider>
        <AppProvider>
          <>app</>
          <Players />
        </AppProvider>
      </PlayerSetProvider>
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}
