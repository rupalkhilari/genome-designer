import chai from 'chai';
import { apiPath, getSessionKey } from '../../src/middleware/api';

const { expect } = chai;

describe('Middleware', () => {
  //login() is tested in server/REST

  it('apiPath() returns an absolute URL to hit the server', () => {
    const fakepath = apiPath('somepath');
    expect(/http/.test(fakepath)).to.equal(true);
    expect(/somepath/.test(fakepath)).to.equal(true);
    expect(/api/.test(fakepath)).to.equal(true);
  });

  it('apiPath() paths are prefixed with /api/', () => {
    const fakepath = apiPath('somepath');
    expect(/api\/somepath/.test(fakepath)).to.equal(true);
  });

  it('getSessionKey() should return current session key', () => {
    expect(getSessionKey()).to.be.a.string;
  });

  it('getSessionKey() should be null before logging in'); //future

  //todo

  it('writeFile() should take path and string, and write file');

  it('writeFile() shuold delete if contents are null');

  it('readFile() should return fetch response object');

  it('should work with multiple files');
});
