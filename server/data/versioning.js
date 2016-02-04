import nodegit from 'nodegit';
import path from 'path';

const makePath = (fsPath) => {
  return path.resolve(__dirname, fsPath);
};

export const initialize = (path) => {
  const repoPath = makePath(path);
  return nodegit.Repository.init(repoPath, 0)
    .then(repo => {
      return repo.openIndex()
        .then(index => {
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
        });
    })
    .then(() => repoPath)
    .catch((err) => Promise.reject(err));
};

export const isInitialized = (path) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

//todo - prevent conflicts -- shouldn't be an issue with only one branch
//todo - ensure HEAD is latest on master
export const commit = (path, message = 'commit message') => {
  const repoPath = makePath(path);
  return nodegit.Repository.open(repoPath)
    .then(repo => {
      return repo.openIndex()
        .then(index => {
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
        });
    })
    .then((commitId) => '' + commitId) //just being explicit what is returned
    .catch((err) => Promise.reject(err));
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

//future - may want to cut file path down automatically if includes repo path
export const checkout = (path, sha = 'HEAD', file) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      if (!sha || sha === 'HEAD') {
        return repo.getMasterCommit();
      }
      return repo.getCommit(sha);
    })
    .then(commit => {
      //just take them to a specific commit,
      //return a function to return them to the head
      if (!file) {
        return Promise.resolve(sha);
      }

      return commit.getEntry(file)
        .then(entry => {
          return entry.getBlob()
            .then(blob => {
              //console.log(entry.filename(), entry.sha(), blob.rawsize());
              return blob.toString();
            });
        });
    });
};

//export const promote = (path, sha, file) => {}
