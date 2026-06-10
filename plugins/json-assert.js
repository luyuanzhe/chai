module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('isValidJSON', function () {
    var obj = this._obj;
    var isValid = false;

    if (typeof obj === 'string') {
      try {
        JSON.parse(obj);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
    }

    this.assert(
      isValid,
      "expected #{this} to be a valid JSON string",
      "expected #{this} to not be a valid JSON string"
    );
  });
};
