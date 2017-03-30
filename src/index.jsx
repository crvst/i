/* global document, window */
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { PROD_ENV } from './constants/env';
import './index.styl';

const htmlNode = document.documentElement;

document.onreadystatechange = () => {
  /*
   * Disabling 'Loading...' state when the document gets the interactive mode
   * */
  if (document.readyState === 'interactive') {
    htmlNode.classList.remove('html--initial');
    document.getElementById('loading').remove();
    document.getElementById('loading-style').remove();
  }
};
if (PROD_ENV) {
  /*
  * Enable service workers in production mode
  * */
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  require('offline-plugin/runtime').install();
  /* eslint-enable global-require, import/no-extraneous-dependencies */
}
render(<App />, document.getElementById('root'));

require.ensure([], () => {
  /*
   * Loading contents of SVG as a string to inject it into the `#svg` in the <body> element and
   * make SVG available inlined, not like an external resource. SVG MUST be cleaned up before
   * to prevent unnecessary bandwidth losses and XSS
   * */
  /* eslint-disable global-require, import/no-unresolved, import/no-webpack-loader-syntax,
   import/no-extraneous-dependencies */
  document.getElementById('svg').innerHTML = require('raw-loader!./assets/symbol/icons.svg');
  /* eslint-enable global-require, import/no-unresolved, import/no-webpack-loader-syntax,
   import/no-extraneous-dependencies */
}, 'svg-icons');

/*
 * Async font loading and caching in localStorage
 * https://github.com/bdadam/OptimizedWebfontLoading
 * Described here: http://bdadam.com/blog/loading-webfonts-with-high-performance.html
 * */
// require.ensure([], () => {
//   /* eslint-disable global-require */
//   const { FONT_FAMILY_MAIN } = require('./constants/styles');
//   const loadFont = require('./libs/fontloader');
//   const woff = require('./assets/styles/avenir.woff.css');
//   const woff2 = require('./assets/styles/avenir.woff2.css');
//   /* eslint-enable global-require */
//   loadFont(FONT_FAMILY_MAIN, woff, woff2);
// }, 'fontloader');
/*
 * Device type detecting to add specific class name to the <html> element. It helps to omit double
 * tap issue at touch devices, when the hover styles applies at the first tap and the actions
 * triggers at the second. See `handheld-hover` Stylus mixin for details
 * */
require.ensure([], () => {
  /* eslint-disable global-require */
  const MobileDetect = require('mobile-detect');
  /* eslint-enable global-require */
  const md = new MobileDetect(window.navigator.userAgent);
  const deviceTypeClassName = md.mobile() ? 'html--handheld' : 'html--notHandheld';
  htmlNode.classList.add(deviceTypeClassName);
}, 'mobile-detect');
