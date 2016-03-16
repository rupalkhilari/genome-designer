import chai from 'chai';
import fs from 'fs';
import * as api from '../../src/middleware/api';
const { assert, expect } = chai;
import { createFilePath } from '../../server/utils/filePaths';

const makeStoragePath = (path) => createFilePath(path);

describe('Middleware', () => {
  describe('Paths + Keys', () => {
    //login() is tested in server/REST

    it('dataApiPath() returns an absolute URL to hit the server', () => {
      const fakepath = api.dataApiPath('somepath');
      assert(/http/.test(fakepath));
      assert(/somepath/.test(fakepath));
    });

    it('dataApiPath() paths are prefixed with /data/', () => {
      const fakepath = api.dataApiPath('somepath');
      assert(/data\/somepath/.test(fakepath));
    });

    it('getUserInfo() should get current user info, synchronously'); //future
  });
});
