import chai from 'chai';
import { Block as exampleBlock } from '../schemas/_examples';
import { apiPath, getSessionKey, runExtension, createBlock, saveBlock } from '../../src/middleware/api';

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

  it('writeFile() should delete if contents are null');

  it('readFile() should return fetch response object');

  it('should work with multiple files');

  it('runExtension() works', function genbankTest(done) {
    this.timeout(10000);
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
});
