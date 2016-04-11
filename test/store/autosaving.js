import { expect } from 'chai';
import autosavingCreator from '../../src/store/autosaving';

describe('Store', () => {
  describe.only('Autosaving', () => {

    it('accepts a configuration, requiring onSave, returns object', () => {
      const validConfig = { onSave: () => {} };
      expect(typeof autosavingCreator).to.equal('function');
      expect(autosavingCreator.bind(null, { config: 'stuff' })).to.throw();
      expect(autosavingCreator.bind(null, validConfig)).to.not.throw();
      const autosavingObject = autosavingCreator(validConfig);
      expect(typeof autosavingObject).to.equal('object');
      expect(typeof autosavingObject.autosaveReducerEnhancer).to.equal('function');
    });

    it();
  });
});
