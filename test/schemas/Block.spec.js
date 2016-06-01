import { expect } from 'chai';
import BlockSchema from '../../src/schemas/Block';
import { Block as exampleBlock } from './_examples';

describe('Schema', () => {
  describe('Block', () => {
    it('should validate the example', () => {
      expect(BlockSchema.validate(exampleBlock)).to.equal(true);
    });

    it('should create a valid scaffold', () => {
      const scaffold = BlockSchema.scaffold();
      //console.log(scaffold);
      expect(scaffold).to.be.an.object;
      expect(BlockSchema.validate(scaffold)).to.equal(true);
    });

    it('should prefix ID with block', () => {
      const scaffold = BlockSchema.scaffold();
      const regex = /^block/;
      //console.log(scaffold);
      expect(regex.test(scaffold.id)).to.equal(true);
    });
  });
});
