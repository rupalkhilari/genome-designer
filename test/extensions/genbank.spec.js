import chai, { expect } from 'chai';
import { errorIdTooShort, errorNoIdProvided, errorDoesNotExist } from '../../../server/utils/errors';
import uuid from 'node-uuid';
import { get, getSafe, set } from '../../../server/utils/database';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Genbank', () => {
  it('should require an ID', (done) => {
    return get()
      .catch((err) => {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal(errorNoIdProvided);
        done();
      });
  });
});
