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

Sentry.init({
    dsn: process.env.REACT_APP_DSN,
    release: process.env.REACT_APP_RELEASE,
    environment: "prod",
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
