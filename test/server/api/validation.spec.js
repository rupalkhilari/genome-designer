import chai from 'chai';
import uuid from 'uuid';
import { assertValidId } from '../../../server/validation';
import { errorNoIdProvided } from '../../../server/errors';

const {expect} = chai;

describe('API validation', () => {
  it('assertValidId will throw on invalid IDs', () => {
    expect(assertValidId.bind(null, 235)).to.throw(errorNoIdProvided);

    const id = uuid.v4();
    expect(assertValidId.bind(null, id)).to.not.throw();

    //not necessarily UUID compliant
    expect(assertValidId.bind(null, id + 'child')).to.not.throw();
  });
});
