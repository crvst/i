// @flow
// https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md#generating-reducers
const createReducer = (initialState: any, handlers: Object) =>
  (state: any = initialState, action: Object) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };

export default createReducer;
