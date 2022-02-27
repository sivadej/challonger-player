import React from 'react';
import client from '@client';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppProvider } from '@contexts/AppContext';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={client}>
      <AppProvider>
        <>app</>
      </AppProvider>

      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}
