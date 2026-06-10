import {config} from '../config.js';

/**
 * @param {string} message
 */
export function warn(message) {
  if (config.enableWarning) {
    console.warn(message);
  }
}
