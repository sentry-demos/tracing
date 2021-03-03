import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './index.css';
import App from './components/App';
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
console.log('process.env.REACT_APP_RELEASE', process.env.REACT_APP_RELEASE)
var RELEASE
if (process.env.REACT_APP_RELEASE == null) {
  let dt = new Date();
  let month = dt.getMonth() + 1
  let day = dt.getDay()
  if (day.toString().length == 1) {
    day = "0" + day
  }
  RELEASE = `${month}.${day}`
} else {
  RELEASE = process.env.REACT_APP_RELEASE
}
console.log('RELEASE post-logic', RELEASE)

Sentry.init({
    dsn: process.env.REACT_APP_DSN || 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
    release: RELEASE,
    environment: "prod",
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
        </Switch>
      </div>
    </Router>
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
