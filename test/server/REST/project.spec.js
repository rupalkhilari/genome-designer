import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/examples';
import request from 'supertest';

const devServer = require('../../../devServer');

describe('REST', () => {
  let server;
  beforeEach(() => {
    server = devServer.listen();
  });
  afterEach(() => {
    server.close();
  });

  describe('Project', () => {

    //todo - should fold block and project APIs together, and just test them once... will only need to test project validation separately then

  });
});
