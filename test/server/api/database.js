import chai, { expect } from 'chai';
import { errorIdTooShort, errorNoIdProvided, errorDoesNotExist } from '../../../server/errors';
import uuid from 'uuid';
import { get, getSafe, set } from '../../../server/database';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Database', () => {
  const dummyInstance = {
    id: 'some-cool-id',
    metadata: {
      name: 'whatever',
    },
    data: {
      some: 'stuff',
    },
  };

  describe('get()', () => {
    it('should require an ID', (done) => {
      return get()
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal(errorNoIdProvided);
          done();
        });
    });

    it('should reject if ID is too short', (done) => {
      const shortId = 'b';
      return get(shortId)
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal(errorIdTooShort);
          done();
        });
    });

    it('reject if doesnt exist', (done) => {
      const invalidId = 'this_doesnt_exist';
      return get(invalidId)
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal(errorDoesNotExist);
          done();
        });
    });
  });

  describe('getSafe()', () => {
    it('returns null (resolve) if doesnt exist', (done) => {
      const invalidId = 'this_doesnt_exist';
      const errorCallback = sinon.spy();

      return getSafe(invalidId)
        .then(result => {
          expect(result).to.be.null;
        })
        .catch(errorCallback)
        .then(() => {
          expect(errorCallback).to.not.have.been.called;
          done();
        });
    });
  });

  describe('set()', () => {
    //use done() explicitly in case the promise rejects

    it('should reject if ID is too short', (done) => {
      const shortId = 'b';
      return set(shortId)
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal(errorIdTooShort);
          done();
        });
    });

    it('should return the passed value', (done) => {
      const value = 'some_value';
      return set(uuid.v4(), value)
        .then((result) => {
          expect(result).to.eql(value);
          done();
        });
    });

    it('should stringify objects passed in as values', (done) => {
      const instance = Object.assign({}, dummyInstance, {id: uuid.v4()});
      return set(instance.id, instance)
        .then((result) => {
          expect(result).to.eql(instance);
          done();
        });
    });

    it('should default to empty string as value', (done) => {
      const instance = Object.assign({}, dummyInstance, {id: uuid.v4()});
      return set(instance.id)
        .then((result) => {
          expect(result).to.eql('');
          done();
        });
    });
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

  it('should handle stringify / parsing of objects', () => {
    const instance = Object.assign({}, dummyInstance, {id: uuid.v4()});

    return set(instance.id, instance).then(() => {
      return get(instance.id);
    }).then((retrieved) => {
      expect(typeof retrieved).to.equal('object');
      expect(retrieved).to.eql(instance);
    });
  });
});
