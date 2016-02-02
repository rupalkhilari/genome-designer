import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { exec } from 'child_process'; //todo - promise version
import { createStorageUrl } from '../../../server/data/filePaths';
import * as git from '../../../server/data/git';

describe('API Data', () => {
  describe.only('git', function gitTests() {
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
    });

    describe('commit()', () => {
      const file1Path = path.resolve(pathRepo, 'testFile');
      const file1Contents = 'dummy contents';
      const commitMessage = 'my commit';
      let commitSha;

      before((done) => {
        fs.writeFile(file1Path, file1Contents, 'utf8', (err) => {
          if (err) {
            done(err);
          }

          git.commit(pathRepo, commitMessage)
            .then((sha) => {
              commitSha = sha;
              done();
            })
            .catch(done);
        });
      });

      it('commit() should add all the files', (done) => {
        exec(`cd ${pathRepo} && git status`, (err, out) => {
          expect(out.indexOf('working directory clean') >= 0);
          done(err);
        });
      });

      it('commit() should accept a message', (done) => {
        exec(`cd ${pathRepo} && git log`, (err, out) => {
          expect(out.indexOf(commitMessage) >= 0);
          done(err);
        });
      });

      it('commit() should add a commit', (done) => {
        exec(`cd ${pathRepo} && git log`, (err, out) => {
          expect(out.indexOf(commitSha) >= 0);
          done(err);
        });
      });
    });

    describe('log()', () => {
      it('returns a list of commits with specific fields', (done) => {
        git.log(pathRepo)
          .then(commits => {
            expect(Array.isArray(commits));
            expect(commits.every(commit => {
              return commit.sha && commit.author && commit.date && commit.message;
            }));
            done();
          })
          .catch(done);
      });
    });

    describe('checkout()', () => {
      it('checkout(path) checks out head');
      it('checkout(path, file) gets a file');
      it('checkout(path, file, SHA) gets file at specific version');
    });
  });
});
