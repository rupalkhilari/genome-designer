import { assert, expect } from 'chai';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { exec } from 'child_process'; //todo - promise version
import { createStorageUrl } from '../../../server/data/filePaths';
import * as git from '../../../server/data/git';
import { fileExists, fileRead, fileWrite, fileDelete, directoryMake, directoryDelete } from '../../../server/utils/fileSystem';

describe('API Data', () => {
  describe('git', function gitTests() {
    this.timeout(10000);
    const pathRepo = createStorageUrl('testrepo');

    before((done) => {
      rimraf(pathRepo, done);
    });

    describe('initialization', () => {
      it('initialize() should initialize a repo', (done) => {
        git.initialize(pathRepo)
          .then(() => {
            exec(`cd ${pathRepo} && git status`, (err, result) => {
              assert(result.indexOf('On branch master') >= 0);
              done(err);
            });
          })
          .catch(done);
      });

      it('isInitialized() checks if initialized - true if is', () => {
        return git.isInitialized(pathRepo)
          .then(result => {
            assert(result === true);
          });
      });

      it('isInitialized() checks if initialized - false if not', () => {
        const uninitPath = 'uninitPath';
        return git.isInitialized(uninitPath)
          .then(result => {
            assert(result === false);
          });
      });
    });

    describe('commit()', () => {
      const file1Path = path.resolve(pathRepo, 'testFile');
      const file1Contents = 'dummy contents';
      const commitMessage = 'my commit';
      let commitSha;

      before((done) => {
        fileWrite(file1Path, file1Contents, false)
          .then(() => git.commit(pathRepo, commitMessage))
          .then((sha) => {
            commitSha = sha;
            done();
          })
          .catch(done);
      });

      it('commit() should add all the files', (done) => {
        exec(`cd ${pathRepo} && git status`, (err, out) => {
          assert(out.indexOf('working directory clean') >= 0);
          done(err);
        });
      });

      it('commit() should accept a message', (done) => {
        exec(`cd ${pathRepo} && git log`, (err, out) => {
          assert(out.indexOf(commitMessage) >= 0);
          done(err);
        });
      });

      it('commit() should add a commit', (done) => {
        exec(`cd ${pathRepo} && git log`, (err, out) => {
          assert(out.indexOf(commitSha) >= 0);
          done(err);
        });
      });

      it('should handle removing a file', (done) => {
        fileDelete(file1Path)
          .then(() => git.commit(pathRepo, 'file deleted'))
          .then((sha) => {
            exec(`cd ${pathRepo} && git ls-files`, (err, output) => {
              assert(output.indexOf(file1Path) < 0);
              done();
            });
          });
      });
    });

    describe('log()', () => {
      it('returns a list of commits with specific fields', (done) => {
        git.log(pathRepo)
          .then(commits => {
            assert(Array.isArray(commits));
            assert(commits.every(commit => {
              return commit.sha && commit.author && commit.date && commit.message;
            }));
            done();
          })
          .catch(done);
      });
    });

    describe('checkout()', () => {
      const fileName = 'rewritable';
      const filePath = path.resolve(pathRepo, fileName);
      const fileContents_A = 'initial contents';
      const fileContents_B = 'alternative internals';
      let sha1;
      let sha2;

      before((done) => {
        fileWrite(filePath, fileContents_A, false)
          .then(() => git.commit(pathRepo, 'first commit'))
          .then((sha) => {
            sha1 = sha;
            return fileWrite(filePath, fileContents_B);
          })
          .then(() => git.commit(pathRepo, 'second commit'))
          .then((sha) => {
            sha2 = sha;
            done();
          })
          .catch(done);
      });

      it('checkout(path, sha, file) gets file at specific version', (done) => {
        git.checkout(pathRepo, sha1, fileName)
          .then(fileContents => {
            expect(fileContents).to.equal(fileContents_A);

            exec(`cd ${pathRepo} && git rev-parse HEAD`, (err, output) => {
              const [ headSha ] = output.split('\n');
              expect(headSha).to.equal(sha2);
              done();
            });
          })
          .catch(done);
      });

      //todo - irrelevant unless allow persist checking out a branch
      it.skip('checkout(path) checks out head', (done) => {
        git.checkout(pathRepo)
          .then(resetToHead => {
            exec(`cd ${pathRepo} && git rev-parse HEAD`, (err, output) => {
              const [ headSha ] = output.split('\n');
              expect(headSha).to.equal(sha2);
              //todo - is this really testing this correctly?
              done();
            });
          })
          .catch(done);
      });

      //todo - irrelevant unless allow persist checking out a branch
      it.skip('checkout(path, sha) checks out a version');

    });
  });
});
