import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/examples';
import request from 'supertest';
import { set as dbSet } from '../../../server/database';

const devServer = require('../../../devServer');

describe('REST', () => {
  let server;
  const sessionKey = '123456';
  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionKey, {});
  });
  afterEach(() => {
    server.close();
  });

  const extendedBlock = Object.assign({}, exampleBlock, {
    some: 'field',
  });

  describe('History', () => {
    describe('/ancestors', () => {

    });
    describe('/descendants', () => {

    });
  });
});
