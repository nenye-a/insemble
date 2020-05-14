import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './App';

import * as serviceWorker from './serviceWorker';

Sentry.init({ dsn: 'DELETED_URL_WITH_CREDENTIALS