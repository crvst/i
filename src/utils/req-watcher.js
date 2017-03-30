/* global localStorage */
// @flow
import { take, fork } from 'redux-saga/effects';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import manageResponse from './manage-response';
import api from '../api';

const getSlug = (slug, payload) => Array.isArray(slug) ? slug.reduce((acc, s) => {
  if (isPlainObject(s)) {
    switch (s.type) {
      case 'payload':
        acc += `/${s.selector.map((key) => payload[key]).join('/')}`;
        break;
      case 'localStorage':
        acc += `/${s.selector.map((key) => localStorage.getItem(key)).join('/')}`;
        break;
      default:
        return acc;
    }
  } else if (isString(s)) {
    acc += `/${s}`;
  }
  return acc;
}, '') : '';

export default function (constants, actions, {
  endpoint,
  options,
  slug,
  type,
}) {
  return function* watcher() {
    while (true) {
      const { payload } = yield take(constants.SEND);
      const fullEndpoint = `${endpoint}${getSlug(slug, payload)}`;
      const authenticationToken = localStorage.getItem('authenticationToken');
      const opts = {
        ...options,
        ...authenticationToken
          ? {
            headers: {
              Authorization: `Token token=${authenticationToken}`,
            },
          } : null,
      }
      yield fork(
        manageResponse,
        actions,
        api(fullEndpoint, opts, type),
        payload,
      );
    }
  };
}
