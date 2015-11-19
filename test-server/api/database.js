import { expect } from 'chai';
import { get, getSafe, set } from '../../server/database';

describe('Database', () => {
  it('should support basic read-write', () => {
    const data = {
      some: 'stuff',
    };
    return set('identity', data).then(() => {
      return get('identity');
    }).then((instance) => {
      expect(instance).to.eql(data);
    });
  });
});
