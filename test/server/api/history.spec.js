import { expect } from 'chai';
import { createDescendent, record } from '../../../server/history';

describe('history', () => {
  describe('createDescendent()', () => {
    const dummyInstance = {
      id: 'some-cool-id',
      metadata: {
        name: 'whatever',
      },
      data: {
        some: 'stuff',
      },
    };

    it('should use instance id for parent id', () => {
      const descendent = createDescendent(dummyInstance);

      expect(descendent.id).to.not.equal(dummyInstance.id);
      expect(descendent.parent).to.equal(dummyInstance.id);
    });

    it('should clone arbitrary fields', () => {
      const descendent = createDescendent(dummyInstance);

      expect(descendent.data).to.not.be.undefined;
    });

    it('should create descendents with new ids', () => {
      const descendent = createDescendent(dummyInstance);
      const descendent2 = createDescendent(dummyInstance);

      expect(descendent.parent).to.equal(descendent2.parent);
      expect(descendent.id).to.not.equal(descendent2.id);
    });
  });

  describe('record()', () => {
    it('should accept ids, return a promise');
    it('should update the database');
  });

  describe('getTree()', () => {});
  describe('getRoot()', () => {});
  describe('getLeaves()', () => {});
});
