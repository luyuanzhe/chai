/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import {config} from '../config.js';

/**
 * ### warn(message)
 *
 * Emits a warning to the console when deprecated assertion APIs or legacy
 * syntaxes are used. The warning is controlled by the `config.enableWarning`
 * global configuration option. When `config.enableWarning` is set to `false`
 * (or any falsy value) the warning is suppressed.
 *
 * This utility is intended to be used internally by Chai whenever a deprecated
 * assertion is invoked. Warnings are output via `console.warn` so they look
 * like typical console warnings and can be filtered by the developer tools.
 *
 * @param {string} message the warning message to emit
 * @returns {void}
 */
export function warn(message) {
  if (config.enableWarning && typeof console !== 'undefined' && console.warn) {
    console.warn(message);
  }
}
