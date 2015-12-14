import { expect } from 'chai';
import * as validators from '../../src/schemas/fields/validators';

describe('Schema', () => {
  describe('Validators', () => {
    it('should be a parameterizable function', () => {
      Object.keys(validators).forEach(validatorName => {
        const validator = validators[validatorName];
        expect(typeof validator).to.equal('function');
        expect(typeof validator()).to.equal('function');
      });
    });

    const stringValidator = validators.string();

    it('should return errors when invalid', () => {
      const returnValue = stringValidator(123);
      expect(returnValue).to.be.an.Error;
    });

    it('should return undefined or null when valid', () => {
      const returnValue = stringValidator('123');
      expect(returnValue === undefined || returnValue === null);
    });
  });
});
