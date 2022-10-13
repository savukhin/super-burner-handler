import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

const docRoot = document.getElementById('root')
if (!docRoot) {
    console.log("Not found root");
} else {
    const root = ReactDOM.createRoot(docRoot);
    root.render(
        <App />
    );
}