import { expect } from 'chai';
import InstanceDefinition from '../../src/schemas/Instance';

describe('Schema', () => {
  describe('SchemaDefinition', () => {
    describe('Functions', () => {
      describe('validate()', () => {
        it('exists', () => {
          expect(InstanceDefinition.validate).to.not.be.undefined;
        });
      });

      describe('extend()', () => {
        it('exists', () => {
          expect(InstanceDefinition.extend).to.not.be.undefined;
        });
      });

      describe('describe()', () => {
        it('exists', () => {
          expect(InstanceDefinition.describe).to.not.be.undefined;
        });
      });

      describe('scaffold()', () => {
        it('exists', () => {
          expect(InstanceDefinition.scaffold).to.not.be.undefined;
        });
      });
    });

    describe('Fields', () => {
      it('should have validators');
      it('should have descriptions');
      it('should have say if required');
    });

    describe('Validation', () => {
      it('should handle deep checks');
      it('should validate nested schemas');
      it('should allow arbitrary fields');
    });
  });
});
