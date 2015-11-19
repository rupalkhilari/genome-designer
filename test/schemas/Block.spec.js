import { expect } from 'chai';
import BlockDefinition from '../../src/schemas/Block';
import { Block as exampleBlock } from './examples';

describe('Schema', () => {
  describe('Block', () => {
    it('should validate the example', () => {
      expect(BlockDefinition.validate(exampleBlock)).to.equal(true);
    });
  });
});
