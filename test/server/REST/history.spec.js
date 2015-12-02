import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/_examples';
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
