// @flow
const initialState = {
  sending: false,
  succeed: null,
  rejected: null,
  error: null,
};
const createReqReducer = (consts) => (state = initialState, action) => {
  const { SEND, SUCCEED, REJECTED, ERROR_ENCOUNTERED } = consts;
  switch (action.type) {
    case SEND:
      return {
        ...initialState,
        sending: true,
      };
    case SUCCEED: {
      const { payload } = action;
      return Object.assign({},
        initialState, {
          succeed: true,
        },
        Array.isArray(payload)
          ? { list: payload }
          : payload,
      );
    }
    case REJECTED:
      return {
        ...initialState,
        rejected: true,
      };
    case ERROR_ENCOUNTERED:
      return {
        ...initialState,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default createReqReducer;
