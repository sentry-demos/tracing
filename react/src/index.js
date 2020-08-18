import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/apm';

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import rootReducer from './reducers'

/* use this if sending test data to a proxy and not Sentry 
function testData(DSN) {
  let KEY = DSN.split('@')[0]
  // only for local proxy, not proxy served by ngrok
  if (KEY.indexOf('https') === 0) {
    KEY = KEY.replace('s', '')
  }
  const PROXY = 'localhost:3001'
  const MODIFIED_DSN_SAVE = KEY + '@' + PROXY + '/3'
  const MODIFIED_DSN_SAVE = KEY + '@' + "3d19db15b56d.ngrok.io" + '/3'
  return MODIFIED_DSN_SAVE
}
let DSN = testData(process.env.REACT_APP_DSN)
console.log("> DSN ", DSN)*/

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
      new Integrations.Tracing({
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
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Redirect to="/toolstore" />
          </Route>
          <Route path="/toolstore">
            <App />
          </Route>
        </Switch>
      </div>
    </Router>
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
