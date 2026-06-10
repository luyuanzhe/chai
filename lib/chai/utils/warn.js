import {config} from '../config.js';

/**
 * Outputs a warning to the console if the `enableWarning` config is true.
 *
 * @param {string} message
 */
export function warn(message) {
  if (config.enableWarning) {
    console.warn(message);
  }
}
