import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import '@babel/polyfill';
import { BrowserRouter } from 'react-router-dom'

const application = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

const mountNode = document.getElementById('root');
ReactDOM.render(application, mountNode);
