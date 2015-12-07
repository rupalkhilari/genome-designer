import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/_examples';
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

  describe('Project', () => {

    //todo - should fold block and project APIs together, and just test them once... will only need to test project validation separately then

  });
});
