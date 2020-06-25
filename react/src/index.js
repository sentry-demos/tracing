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

// these modified DSN's are for working with test data. You can ignore them.
let DSN = process.env.REACT_APP_DSN
let KEY = DSN.split('@')[0]
if (KEY.indexOf('s') === 4) {
  KEY = KEY.replace('s', '') // http vs https
}
const PROXY = 'localhost:3001'
const MODIFIED_DSN_FORWARD = KEY + '@' + PROXY + '/2'
const MODIFIED_DSN_SAVE = KEY + '@' + PROXY + '/3'

const tracingOrigins = [
  'localhost', 
  process.env.REACT_APP_BACKEND,
  process.env.REACT_APP_FRONTEND,
  /^\//
]
console.log('tracingOrigins', tracingOrigins)

Sentry.init({
    dsn: process.env.REACT_APP_DSN || 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
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
