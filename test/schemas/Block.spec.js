import { expect } from 'chai';
import BlockDefinition from '../../src/schemas/Block';
import { Block as exampleBlock } from './_examples';

describe('Schema', () => {
  describe('Block', () => {
    it('should validate the example', () => {
      expect(BlockDefinition.validate(exampleBlock)).to.equal(true);
    });

    it.only('should create a valid scaffold', () => {
      const scaffold = BlockDefinition.scaffold();
      //console.log(scaffold);
      expect(scaffold).to.be.an.object;
      expect(BlockDefinition.validate(scaffold)).to.equal(true);
    });
  });
});
