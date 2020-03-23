import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

const tracingOrigins = [
  'localhost', 
  'http://localhost',
  'wcap-react-m3uuizd7iq-uc.a.run.app',
  'wcap-react-m3uuizd7iq-uc.a.run.app/',
  'https://wcap-react-m3uuizd7iq-uc.a.run.app',
  'https://wcap-react-m3uuizd7iq-uc.a.run.app/',
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
// tracingOrigins: ['localhost', /^\//]
// tracingOrigins: ['localhost', /^\//]
// tracingOrigins: tracingOrigins,
// tracingOrigins: ['https://wcap-react-m3uuizd7iq-uc.a.run.app', /^\//]
ReactDOM.render(<App /> , document.getElementById('root'));

registerServiceWorker();
