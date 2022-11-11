import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { DummyClient } from './client/DummyClient';
import { SerialClient } from './client/SerialClient';

const docRoot = document.getElementById('root')
if (!docRoot) {
    console.log("Not found root");
} else {
    let client = new SerialClient()

    const root = ReactDOM.createRoot(docRoot);
    root.render(
        <App client={ client } />
    );
    
}