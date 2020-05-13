import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './App';

import * as serviceWorker from './serviceWorker';

Sentry.init({ dsn: 'https://0aabc7f8c2ec40fd8833af5d43f6358e@o392065.ingest.sentry.io/5239064' });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
