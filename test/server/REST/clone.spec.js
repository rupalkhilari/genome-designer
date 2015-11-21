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

  describe('Clone', () => {
    it('should create descendents with proper parent');
  });
});
