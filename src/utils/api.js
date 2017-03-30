// @flow
/* location*/
import axios from 'axios';
import camelize from 'camelize';
import { DEV_ENV } from '../constants/env';

export const API_URI = '//';
const apiInit = (options) => axios.create({
  baseURL: API_URI,
  ...options,
});

const api = (endpoint, options, type = 'post') => ({
  send(payload) {
    if (DEV_ENV) {
      console.group('API Request');
      console.info(`Endpoint: ${location.protocol}${API_URI}/${endpoint}`);
      console.info('Options:', options || 'No');
      console.info(`Type: ${type.toUpperCase()}`);
      console.groupEnd('API Request');
    }
    return apiInit(options)[type](endpoint, payload)
    /*
     * JSON field from API response convert to camelCase
     * */
      .then((response) => camelize(response))
      .catch((err) => camelize(err.response));
  },
});

export default api;
