import {config} from '../config.js';

export function warnDeprecated(message = '') {
  if (
    config.enableWarning &&
    typeof console !== 'undefined' &&
    typeof console.warn === 'function'
  ) {
    console.warn(message);
  }
}