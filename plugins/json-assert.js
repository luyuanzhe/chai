import * as chai from '../lib/chai.js';

function isParsableJSON(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function jsonAssertPlugin(chaiInstance, utils) {
  chaiInstance.Assertion.addMethod('isValidJSON', function () {
    const value = utils.flag(this, 'object');

    this.assert(
      isParsableJSON(value),
      'expected #{this} to be a valid JSON string',
      'expected #{this} not to be a valid JSON string'
    );
  });
}

export function registerJSONAssert(chaiInstance = chai) {
  chaiInstance.use(jsonAssertPlugin);
  return chaiInstance;
}

export default jsonAssertPlugin;
