import chai from 'chai';
import uuid from 'node-uuid';
import { assertValidId } from '../../../server/utils/validation';
import { errorNoIdProvided } from '../../../server/utils/errors';

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
