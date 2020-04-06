import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import App from './App';
import createUltraStore from './store';
import './modelSetup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={createUltraStore()}>
        <App />
    </Provider>
  , div);
  ReactDOM.unmountComponentAtNode(div);
});