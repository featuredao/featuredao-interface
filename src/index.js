import React from 'react';
import ReactDOM from 'react-dom';
import './styles/antd.css';
import './index.css';
import './styles/index.scss';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import NetworkProvider from 'providers/NetworkProvider';
import ThemeProvider from 'providers/ThemeProvider';
import UserProvider from 'providers/UserProvider';
import ReactQueryProvider from 'providers/ReactQueryProvider';
import LanguageProvider from 'providers/LanguageProvider';
import TokensProvider from 'providers/TokensProvider';

import store from './redux/store'

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <NetworkProvider>
              <UserProvider>
                <TokensProvider>
                  <App />
                </TokensProvider>
              </UserProvider>
            </NetworkProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </ReactQueryProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
