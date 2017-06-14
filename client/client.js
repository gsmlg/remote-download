import 'styles/app.scss';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from 'components/App';

const store = createStore(()=>{});

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('app')
  );
};

window.addEventListener('DOMContentLoaded', render);
