import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

Sentry.init({
    dsn: 'https://0d52d5f4e8a64f5ab2edce50d88a7626@sentry.io/1428657',
    release: process.env.REACT_APP_RELEASE,
    environment: "prod",
    beforeSend(event) {
      if (event.exception) {
        Sentry.showReportDialog();
      }
      return event;
    },
    integrations: [
        new ApmIntegrations.Tracing(),
    ],
    // cdn
    // integrations: [
    //   new Sentry.Integrations.Tracing({
    //     tracingOrigins: ['localhost', 'sentry.io', /^\//]
    //   }),
    // ]
});

ReactDOM.render(<App /> , document.getElementById('root'));

registerServiceWorker();
