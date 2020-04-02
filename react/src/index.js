import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'


const tracingOrigins = [
  'localhost', 
  process.env.REACT_APP_BACKEND,
  process.env.REACT_APP_FRONTEND,
  /^\//
]
console.log('tracingOrigins', tracingOrigins)

Sentry.init({
    dsn: 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
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

// ReactDOM.render(
//     <App />,
//   document.getElementById('root')
// )
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
