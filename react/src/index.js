import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// TODO
// if NODE_ENV === 'development' vs NODE_ENV === 'production'
console.log('process.env from index.js', process.env)
ReactDOM.render(<App /> , document.getElementById('root'));

registerServiceWorker();
