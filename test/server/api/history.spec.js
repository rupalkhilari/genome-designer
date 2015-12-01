import { expect } from 'chai';
import uuid from 'node-uuid';
import { Block as exampleBlock } from '../../schemas/examples';
import { getSafe as dbGetSafe } from '../../../server/database';
import { createDescendant, record, makeHistoryKey, getAncestors, getDescendants, getRoot, getDescendantsRecursively } from '../../../server/history';

describe('History', () => {
  it('makeHistoryKey() should append "-history"', () => {
    const key = 'blah';
    expect(makeHistoryKey(key) === key + '-history');
  });

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

    //console.log([levelOne, levelTwo, levelThree, levelFour, levelFourAlt].map(inst => inst.id));

    before(() => {
      //these need to run sequentually so they dont overwrite each other...
      return record(levelTwo.id, levelOne.id)
        .then(() => record(levelThree.id, levelTwo.id))
        .then(() => record(levelFour.id, levelThree.id))
        .then(() => record(levelFourAlt.id, levelThree.id));
    });

    describe('getAncestors()', () => {
      it('should get all ancestors', () => {
        return Promise.all([
          getAncestors(levelFour.id).then(result => {
            expect(result.length).to.equal(3);
            expect(result[2]).to.equal(levelOne.id);
          }),
          getAncestors(levelFourAlt.id).then(result => {
            expect(result.length).to.equal(3);
            expect(result[2]).to.equal(levelOne.id);
          }),
          getAncestors(levelThree.id).then(result => {
            expect(result.length).to.equal(2);
            expect(result[1]).to.equal(levelOne.id);
            expect(result[0]).to.equal(levelTwo.id);
          })]);
      });

      it('should return dictionary where values are parents of keys');
      it('should support tree structure');
    });

    describe('getDescendants()', () => {
      it('should get direct descendants as an array', () => {
        return getDescendants(levelOne.id).then(result => {
          expect(Array.isArray(result)).to.equal(true);
          expect(result).to.eql([levelTwo.id]);
        });
      });
    });

    describe('getDescendantsRecursively()', () => {
      it('should get all descendants', () => {
        return getDescendantsRecursively(levelOne.id).then(result => {
          delete result.leaves;
          //5 including itself
          expect(Object.keys(result).length).to.equal(5);
        });
      });

      it('should return dictionary where values are parents of keys');
      it('should support tree structure');
    });

    describe('getRoot()', () => {
      it('should retrieve the root instance given a node in its tree', () => {
        return Promise.all([
          getRoot(levelThree.id).then(result => {
            expect(result).to.equal(levelOne.id);
          }),
          getRoot(levelFourAlt.id).then(result => {
            expect(result).to.equal(levelOne.id);
          }),
        ]);
      });

      it('should return null if there are no parents', () => {
        return getRoot(levelOne.id).then(result => {
          expect(result).to.eql(null);
        });
      });
    });

    describe('getTree()', () => {
    });

    describe('getLeaves()', () => {
    });
  });
});
