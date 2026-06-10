import {config} from '../config.js';

/*!
 * Chai - deprecation warning utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .warn(message)
 *
 * Utility to display a deprecation warning on the console if
 * `enableWarning` configuration is enabled (true by default).
 *
 * @namespace Utils
 * @name warn
 * @param {string} message - deprecation warning message
 * @returns {void}
 */
export function warn(message) {
  if (config.enableWarning && typeof console !== 'undefined' && console.warn) {
    console.warn('[Chai Deprecation] ' + message);
  }
}
