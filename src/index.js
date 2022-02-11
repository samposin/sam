import React from 'react';
import ReactDOM from 'react-dom';
import HttpsRedirect from 'react-https-redirect';

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from './reducers';

import App from './App';

import 'semantic-ui-css/semantic.min.css'
import './styles/index.scss';

let store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <HttpsRedirect>
      <App />
    </HttpsRedirect>
  </Provider>,
  document.getElementById('root')
);
