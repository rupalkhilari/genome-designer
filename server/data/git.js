import nodegit from 'nodegit';
import path from 'path';

const makePath = (path) => {
  return path.resolve(__dirname, path, './.git');
};

export const initialize = (path) => {
  return nodegit.Repository.init(makePath(path), 0)
    .then(repo => {
      const index = repo.openIndex();
      index.read(1); //what is this? was in example

      //todo - add an initial file

      return index.addAll()
        .then(() => index.write())
        .then(() => index.writeTree())
        .then(oid => {
          const author = nodegit.Signature.now('Person', 'email');
          const committer = author;
          return repo.createCommit('HEAD', author, committer, 'Initialize', oid, []);
        });
    })
    .done(commitId => {
      console.log('Initial Commit', commitId);
      Promise.resolve(path);
    })
    .catch(Promise.reject);
};

//todo = verify
export const isInitialized = (path) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      return true;
    })
    .catch(() => {
      console.log('caught!');
      return false;
    });
};

//todo - add all files
//todo - prevent conflicts
//see https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
export const commit = (path, message = 'commit message') => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      const index = repo.openIndex();
      index.read(1); //what is this? was in example

      return index.addAll()
        .then(() => index.write())
        .then(() => index.writeTree())
        .then(oid => {
          return nodegit.Reference.nameToId(repo, 'HEAD')
            .then((head) => repo.getCommit(head))
            .then(parent => {
              const author = nodegit.Signature.now('Person', 'email');
              const committer = author;
              return repo.createCommit('HEAD', author, committer, message, oid, [parent]);
            });
        });
    })
    .catch((err) => {
      console.error('commit error', err);
    })
    .done(commitId => {
      console.log('committed!', commitId);
      return path;
    });
};

export const log = (path) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      return repo.getMasterCommit();
    })
    .then(firstCommitOnMaster => {
      return new Promise((resolve, reject) => {
        const history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.Time);
        const commits = [];

        history.on('commit', (commit) => {
          //todo - ability to filter to specific types of commits
          commits.push(commit);
        });

        history.on('end', () => {
          resolve(commits.map(commit => ({
            sha: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message(),
          })));
        });

        history.start();
      });
    });
};

export const checkout = (path, file, sha = 'HEAD') => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => repo.getCommit(sha))
    .then(commit => {
      //just take them to a specific commit
      if (!file) {
        return Promise.resolve(sha);
      }

      return commit.getEntry(file)
        .then(entry => {
          entry.getBlob()
            .then(blob => {
              console.log(entry.filename(), entry.sha(), blob.rawsize());
              console.log(blob.toString());
            });
        });
    })
    .done();
};
