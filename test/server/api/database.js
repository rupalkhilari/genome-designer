import { expect } from 'chai';
import uuid from 'uuid';
import { get, getSafe, set } from '../../../server/database';

describe('Database', () => {
  describe('get', () => {
    it('should return a promise');
    it('should reject if ID invalid');
    it('returns rejection if doesnt exist');
  });

  describe('getSafe', () => {
    it('should return a promise');
    it('returns null (resolve) if doesnt exist');
  });

  describe('set', () => {
    it('should return a promise');
    it('should reject if ID invalid');
    it('should set to nothing if data is undefined');
  });

  it('should support basic read-write', () => {
    const data = {
      some: 'stuff',
    };
    const id = uuid.v4();

    return set(id, data).then(() => {
      return get(id);
    }).then((instance) => {
      expect(instance).to.eql(data);
    });
  });
});
