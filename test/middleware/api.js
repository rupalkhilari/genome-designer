import chai from 'chai';
import fs from 'fs';
import { Block as exampleBlock } from '../schemas/_examples';
import { apiPath, getSessionKey, writeFile, readFile, runExtension, createBlock, saveBlock } from '../../src/middleware/api';
const { expect } = chai;

const fileStoragePath = './storage/';

describe.only('Middleware', () => {
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

  it('writeFile() should take path and string, and write file', function writeFileBasic(done) {
    this.timeout(5000);

    const filePath = 'test/writeMe';
    const fileContents = 'rawr';
    const storagePath = fileStoragePath + filePath;

    return writeFile(filePath, fileContents)
      .then((res) => {
        expect(res.status).to.equal(200);
        fs.readFile(storagePath, 'utf8', (err, file) => {
          expect(err).to.eql(null);
          expect(file).to.eql(fileContents);
          done();
        });
      });
  });

  it('writeFile() shuold delete if contents are null', function writeFileDelete(done) {
    this.timeout(5000);

    const filePath = 'test/deletable';
    const fileContents = 'oopsie';
    const storagePath = fileStoragePath + filePath;

    fs.writeFile(storagePath, fileContents, 'utf8', (err, write) => {
      writeFile(filePath, null).then((res) => {
        expect(res.status).to.equal(200);
        fs.readFile(storagePath, 'utf8', (err, read) => {
          expect(err.code).to.equal('ENOENT');
          done();
        });
      });
    });
  });

  it('readFile() should return fetch response object', (done) => {
    const filePath = 'test/readable';
    const fileContents = 'the contents!';
    const storagePath = fileStoragePath + filePath;

    fs.writeFile(storagePath, fileContents, 'utf8', (err, write) => {
      readFile(filePath)
        .then(result => {
          expect(result.status).to.equal(200);
          expect(typeof result.text).to.equal('function');
          return result.text();
        })
        .then(text => {
          expect(text).to.equal(fileContents);
          done();
        });
    });
  });

  it('should work with multiple files', function multipleFiles(done) {

    //only takes a long time the first time docker build is run
    this.timeout(500000);

    const file1Path = 'test/file1';
    const file1Contents = 'exhibit a';
    const storage1Path = fileStoragePath + file1Path;

    const file2Path = 'test/file2';
    const file2Contents = 'exhibit b';
    const storage2Path = fileStoragePath + file2Path;

    Promise
      .all([
        writeFile(file1Path, file1Contents),
        writeFile(file2Path, file2Contents),
      ])
      .then(files => {
        fs.readFile(storage1Path, 'utf8', (err, read) => {
          expect(read).to.equal(file1Contents);
        });
        fs.readFile(storage2Path, 'utf8', (err, read) => {
          expect(read).to.equal(file2Contents);
        });
      })
      .then(() => {
        return Promise.all([
          readFile(file1Path).then(resp => resp.text()),
          readFile(file2Path).then(resp => resp.text()),
        ]);
      })
      .then(files => {
        expect(files[0]).to.equal(file1Contents);
        expect(files[1]).to.equal(file2Contents);
        done();
      });
  });

  /* DEPRECATED
   it('runExtension() works', function genbankTest(done) {
   this.timeout(100000);
   let block1 = exampleBlock;
   let bid1;
   let input1;

   createBlock(block1)
   .then((res) => {
   bid1 = res.id;

   input1 = {
   'genbank': 'extensions/compute/genbank_to_block/sequence.gb',
   'sequence': '/api/file/block/' + bid1 + '/sequence',
   };

   return res;
   })
   .then((res) => {
   return runExtension('genbank_to_block', input1);
   })
   .then((output) => {
   expect(output.block !== undefined);
   const block = JSON.parse(output.block);
   block1.sequence.url = input1.sequence;
   return saveBlock(block1);
   })
   .then((block) => {
   expect(block.id === bid1);
   expect(block.sequence.url === input1.sequence);
   done();
   })
   .catch((err) => {
   expect(false);
   done();
   });
   });
   */
});