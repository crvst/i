/* global window */
/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router/lib/browserHistory';
import { routerMiddleware } from 'react-router-redux';
import { DEV_ENV } from '../constants/env';
import reducer from './reducers';
import saga from './sagas';

const routingMiddleware = routerMiddleware(browserHistory);
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, routingMiddleware];
const composeEnhancers = (DEV_ENV && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const create = (state = {}) => {
  if (DEV_ENV) {
    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const createLogger = require('redux-logger');
    /* eslint-enable global-require, import/no-extraneous-dependencies */
    const logger = createLogger({
      level: 'info',
      duration: true,
      collapsed: true,
      diff: true,
    });
    middlewares.push(logger);
  }
  return {
    ...createStore(
      reducer,
      state,
      composeEnhancers(
        applyMiddleware(...middlewares),
      ),
    ),
    runSaga: sagaMiddleware.run(saga),
  };
};

export default create;
