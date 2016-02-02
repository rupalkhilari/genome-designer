import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { createStorageUrl } from '../../../server/data/filePaths';
import * as git from '../../../server/data/git';

describe('API Data', () => {
  describe.only('git', () => {
    const pathRepo = createStorageUrl('testrepo');

    it('initialize() should initialize a repo', (done) => {
      git.initialize(pathRepo)
        .then(() => {
          exec(`cd ${pathRepo} && git status`, (err, result) => {
            expect(result.indexOf('On branch master') >= 0);
            done(err);
          });
        })
        .catch(done);
    });

    it('isInitialized() checks if initialized - true if is', () => {
      return git.isInitialized(pathRepo)
        .then(result => {
          expect(result === true);
        });
    });

    it('isInitialized() checks if initialized - false if not', () => {
      const uninitPath = 'uninitPath';
      return git.isInitialized(uninitPath)
        .then(result => {
          expect(result === false);
        });
    });

    it('commit() should add all the files', (done) => {
      const file1Path = path.resolve(pathRepo, 'testFile');
      const file1Contents = 'dummy contents';
      const commitMessage = 'my commit';
      fs.writeFile(file1Path, file1Contents, 'utf8', (err) => {
        if (err) {
          done(err);
        }

        git.commit(pathRepo, commitMessage)
          .then((commit) => {
            console.log(commit);
          });
      });
    });

    it('commit() should accept a message');
    it('commit() should add a commit');

    it('log() returns a list of commits');

    it('checkout(path) checks out head');
    it('checkout(path, file) gets a file');
    it('checkout(path, file, SHA) gets file at specific version');
  });
});
