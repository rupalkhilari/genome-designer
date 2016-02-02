import { expect } from 'chai';
import * as git from '../../../server/data/git';

describe('Data', () => {
  describe('git', () => {
    it('initalize() should initialize a repo');
    it('isInitialized() checks if initialized');
    it('commit() should commit a repo');
    it('checkout(path) checks out head');
    it('checkout(path, file) gets a file');
    it('checkout(path, file, SHA) gets file at specific version');
  });
});
