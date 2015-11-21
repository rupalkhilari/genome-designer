import { expect } from 'chai';
import uuid from 'uuid';
import { Block as exampleBlock } from '../../schemas/examples';
import { get as dbGet, set as dbSet, getSafe as dbGetSafe } from '../../../server/database';
import { createDescendant, record, makeHistoryKey, getTree, getDescendants, getAncestors, getRoot } from '../../../server/history';

describe.only('History', () => {
  describe('createDescendant()', () => {
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
      const descendant = createDescendant(dummyInstance);

      expect(descendant.id).to.not.equal(dummyInstance.id);
      expect(descendant.parent).to.equal(dummyInstance.id);
    });

    it('should clone arbitrary fields', () => {
      const descendant = createDescendant(dummyInstance);

      expect(descendant.data).to.eql(dummyInstance.data);
      expect(descendant.metadata).to.eql(dummyInstance.metadata);
    });

    it('should create descendants with new ids', () => {
      const descendant = createDescendant(dummyInstance);
      const descendant2 = createDescendant(dummyInstance);

      expect(descendant.parent).to.equal(descendant2.parent);
      expect(descendant.id).to.not.equal(descendant2.id);
    });
  });

  describe('record()', () => {
    //order of these operations matters
    const instance = Object.assign({}, exampleBlock, {id: uuid.v4()});
    const descendant = createDescendant(instance);

    it('should return the ancestry and descendants', () => {
      return record(descendant.id, instance.id)
        .then(([descendantHistory, instanceHistory]) => {
          expect(descendantHistory.ancestors).to.eql([instance.id]);
          expect(instanceHistory.descendants).to.eql([descendant.id]);
        });
    });

    it('should update the database', () => {
      const checkAncestry = dbGetSafe(makeHistoryKey(descendant.id))
        .then(history => {
          expect(history.ancestors).to.eql([instance.id]);
        });
      const checkDescendants = dbGetSafe(makeHistoryKey(instance.id))
        .then(history => {
          expect(history.descendants).to.eql([descendant.id]);
        });

      return Promise.all([checkAncestry, checkDescendants]);
    });

    it('should push to array for multiple descendents', () => {
      const descendant2 = createDescendant(instance);
      return record(descendant2.id, instance.id)
        .then(([descendantHistory, instanceHistory]) => {
          expect(descendantHistory.ancestors).to.eql([instance.id]);
          expect(instanceHistory.descendants).to.eql([descendant.id, descendant2.id]);
        });
    });

  });

  describe('[Tree functions]', () => {
    //setup a basic tree, with a fork from levelTree
    const levelOne = Object.assign({}, exampleBlock, {id: uuid.v4()});
    const levelTwo = createDescendant(levelOne);
    const levelThree = createDescendant(levelTwo);
    const levelFour = createDescendant(levelThree);
    const levelFourAlt = createDescendant(levelThree);

    console.log([levelOne, levelTwo, levelThree, levelFour, levelFourAlt].map(inst => inst.id));

    before(() => {
      //these need to run sequentually so they dont overwrite each other...
      return record(levelTwo.id, levelOne.id)
        .then(() => record(levelThree.id, levelTwo.id))
        .then(() => record(levelFour.id, levelThree.id))
        .then(() => record(levelFourAlt.id, levelThree.id));
    });

    describe('getAncestors()', () => {
      it('should get all ancestors', () => {
        return getAncestors(levelFour.id).then(result => {
          delete result.tree;
          delete result.leaves;
          //4 including itself
          expect(Object.keys(result).length).to.equal(4);
        });
      });

      //todo
      it('should return dictionary where values are parents of keys');
      it('should support tree structure');
    });

    describe('getDescendants()', () => {
      it('should get all descendants', () => {
        return getDescendants(levelOne.id).then(result => {
          delete result.tree;
          delete result.leaves;
          //5 including itself
          expect(Object.keys(result).length).to.equal(5);
        });
      });

      //todo
      it('should return dictionary where values are parents of keys');
      it('should support tree structure');
    });

    describe('getTree()', () => {

    });

    describe('getRoot()', () => {
      it('should retrieve the root instance given a node in its tree');
    });

    describe('getLeaves()', () => {

    });
  });
});
