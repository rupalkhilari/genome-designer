import chai from 'chai';
import getRecursively, { getParents, getComponents } from '../../server/getRecursively';

const {expect} = chai;

describe('getRecursively', () => {
  it('should resolve for no inputs', () => {
    return getRecursively([]).then(val => {
      expect(val).to.eql({tree: {}, leaves: []});
    });
  });
});
