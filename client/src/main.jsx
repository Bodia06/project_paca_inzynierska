import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Provider } from 'react-redux';
import { TaskProvider } from './contexts/TaskProvider.jsx';
import store from './store';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Provider store={store}>
          <TaskProvider>
            <App />
          </TaskProvider>
        </Provider>
      </QueryParamProvider>
    </BrowserRouter>
  </StrictMode>
);
