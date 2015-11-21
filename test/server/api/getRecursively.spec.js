import chai from 'chai';
import generateTree, { flattenTree } from '../../utils/tree';
import getRecursively, { getParents, getComponents } from '../../../server/getRecursively';

const { expect } = chai;

describe('getRecursively', () => {
  it('should resolve for no inputs with empty tree and leaves', () => {
    return getRecursively([]).then(val => {
      expect(val).to.eql({tree: {}, leaves: []});
    });
  });

  it('should accept a string as field specifier', () => {

  });

  it('should accept an accessor function as field specifier');

  it('should fetch a recursive structure');

  it('have the correct leaves');

  it('allow limiting of depth');

  it('should return the constructed tree');
});
