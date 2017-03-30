import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default (state, action) => ({
  ...combineReducers({
    routing: routerReducer,
  }).call(null, state, action),
});
