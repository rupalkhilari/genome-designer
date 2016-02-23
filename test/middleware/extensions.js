import chai from 'chai';
import fs from 'fs';
import * as api from '../../src/middleware/api';
const { assert, expect } = chai;

describe('Middleware', () => {
  describe('Extensions', () => {
    it('getExtensionsInfo() should be able get extension manifests', () => {
      return api.getExtensionsInfo()
        .then(output => {
          assert(typeof output === 'object', 'wrong format for info');
          assert(Object.keys(output).every(key => {
            const manifest = output[key];
            return manifest.name && manifest.version && manifest.region;
          }), 'some extensions are not in correct format');
        });
    });
  });
});

