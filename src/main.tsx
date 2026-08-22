import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

// ONE client for the whole app. It owns the cache every useQuery reads.
// Created OUTSIDE the component tree, or a re-render would throw it away.
const queryClient = new QueryClient({
    // Default is 3 retries: a failure takes ~7s to appear. 1 retry: ~1s.
    defaultOptions: { queries: { retry: 1 } },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

