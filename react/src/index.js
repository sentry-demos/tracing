import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import rootReducer from './reducers'


const tracingOrigins = [
  'localhost', 
  process.env.REACT_APP_BACKEND,
  process.env.REACT_APP_FRONTEND,
  /^\//
]
// console.log('tracingOrigins', tracingOrigins)

let DSN = process.env.REACT_APP_DSN

const KEY = DSN.SPLIT('@')[0]
const PROXY = 'localhost:3001'
const MODIFIED_DSN_FORWARD = KEY + '@' + PROXY + '/2'
const MODIFIED_DSN_SAVE = KEY + '@' + PROXY + '/3'

console.log('MODIFIED_DSN_SAVE', MODIFIED_DSN_SAVE)

Sentry.init({
    // dsn: process.env.REACT_APP_DSN || 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
    // dsn: MODIFIED_DSN_FORWARD,
    dsn: MODIFIED_DSN_SAVE,
    release: process.env.REACT_APP_RELEASE,
    environment: "prod",
    debug: true,
    beforeSend(event) {
      if (event.exception) {
        Sentry.showReportDialog();
      }
      return event;
    },
    integrations: [
      new ApmIntegrations.Tracing({
          tracingOrigins: tracingOrigins
      }),
    ],
    tracesSampleRate: 1.0,
});

const store = createStore(
  rootReducer,
  applyMiddleware(logger)
)

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
