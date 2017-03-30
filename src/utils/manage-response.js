// @flow
import { put, call } from 'redux-saga/effects';
import get from 'lodash/get';
import { DEV_ENV } from '../../constants/env';

/*
 * The worker that intercepts API HTTP requests. The actions MUST follow such naming convention:
 * const actions = {
 *   succeed,
 *   rejected,
 *   errorEncountered,
 * };
 * The actions itself must be a plain object, contains action creators for
 * `succeed` (>= 200 and < 400 HTTP responses),
 * `rejected` (>= 400 and < 500)
 * and `errorEncountered` actions (for any errors, both server (>= 500) and client) accordingly
 * */

export function* manageResponse(actions, api, payload: any) {
  const { succeed, rejected, errorEncountered } = actions;
  try {
    const response = yield call(api.send, payload);
    const status = get(response, 'status');
    const getEntity = get.bind(null, get(response, 'data'));
    const c = ['data', 'meta', 'error'].reduce((acc, x) => {
      acc[x] = getEntity(x); // eslint-disable-line no-param-reassign
      return acc;
    }, {});

    if (status >= 200 && status < 400) {
      yield put(succeed(c.data, c.meta));
    } else if (status >= 400 && status < 500) {
      if (DEV_ENV) console.warn(c.error);
      yield put(rejected(c.error, c.meta));
    } else {
      throw response;
    }
  } catch (err) {
    if (DEV_ENV) console.error(err);
    yield put(errorEncountered(err));
  }
}

export default manageResponse;
