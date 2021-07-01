import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './index.css';
import App from './components/App';
import List from './components/List';
import registerServiceWorker from './registerServiceWorker';
import { Integrations } from '@sentry/tracing';
import * as Sentry from '@sentry/react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import rootReducer from './reducers'

const tracingOrigins = [
  'localhost',
  process.env.REACT_APP_BACKEND,
  process.env.REACT_APP_FRONTEND,
  /^\//
]
console.log('tracingOrigins', tracingOrigins)

var RELEASE
// If you don't set a release in your .env, package.json or GCP, it gets defaulted to ${month}.${week}
if (process.env.REACT_APP_RELEASE == null) {
  var d = new Date()
  let adjustedDate = d.getDate()+ d.getDay();
  let prefixes = ['0', '1', '2', '3', '4', '5'];
  var week = parseInt(prefixes[0 | adjustedDate / 7])+1
  let dt = new Date();
  let month = dt.getMonth() + 1
  RELEASE = `${month}.${week}`
} else {
  RELEASE = process.env.REACT_APP_RELEASE
}
console.log('RELEASE', RELEASE)

Sentry.init({
    dsn: process.env.REACT_APP_DSN || 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
    release: RELEASE,
    environment: "production",
    debug: true,
    beforeSend(event) {
      if (event.exception) {
        Sentry.showReportDialog();
      }
      return event;
    },
    integrations: [
      new Integrations.BrowserTracing({
          tracingOrigins: tracingOrigins
      }),
    ],
    tracesSampleRate: 1.0,
    autoSessionTracking: true,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

const store = createStore(
  rootReducer,
  compose(applyMiddleware(logger), sentryReduxEnhancer)
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
          <Route path="/list">
            <List />
          </Route>
        </Switch>
      </div>
    </Router>
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
