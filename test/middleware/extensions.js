import chai from 'chai';
import fs from 'fs';
import * as api from '../../src/middleware/api';
const { assert, expect } = chai;

describe('Middleware', () => {
  describe('Extensions', () => {
    it('importBlock() should be able convert Genbank features to Block', function testFunc(done) {
      fs.readFile('./test/res/sampleGenbank.gb', 'utf8', (err, sampleStr) => {
        api.importBlock('genbank', sampleStr)
          .then(result => {
            return result.json();
          })
          .then(data => {
            expect(data.block !== undefined).to.equal(true);
            expect(data.blocks !== undefined).to.equal(true);
            expect(data.block.components.length === 2).to.equal(true);

            //check that CDS types were converted to Blocks
            expect(data.blocks[data.block.components[0]] !== undefined).to.equal(true);
            expect(data.blocks[data.block.components[1]] !== undefined).to.equal(true);
            expect(data.blocks[data.block.components[0]].metadata.tags.sbol === 'cds').to.equal(true);
            expect(data.blocks[data.block.components[1]].metadata.tags.sbol === 'cds').to.equal(true);

            //check that other features were imported as features for the main block
            expect(data.block.sequence.features.length === 2).to.equal(true);
            expect(data.block.sequence.features[1].type === 'rep_origin').to.equal(true);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
    });

    it('exportBlock() should be able convert Block to Genbank', function testFunc(done) {
      fs.readFile('./test/res/sampleBlocks.json', 'utf8', (err, sampleBlocksJson) => {
        const sampleBlocks = JSON.parse(sampleBlocksJson);
        api.exportBlock('genbank', sampleBlocks)
          .then(result => {
            return result.json();
          })
          .then(result => {
            expect(result.indexOf('acggtt') !== -1).to.equal(true);
            expect(result.indexOf('block           5..6') !== -1).to.equal(true);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
    });

    it('importProject() should be able convert feature file to Blocks', function testFunc(done) {
      fs.readFile('./test/res/sampleFeatureFile.tab', 'utf8', (err, sampleFeatures) => {
        api.importProject('features', sampleFeatures)
          .then(result => {
            return result.json();
          })
          .then(result => {
            expect(result.project.components.length === 125).to.equal(true);
            expect(result.blocks[result.project.components[19]].metadata.name === '19:CBDcenA ').to.equal(true);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
    });

    it('search() should be able search NCBI nucleotide DB', function testFunc(done) {
      this.timeout(20000);  //searching NCBI
      const input = {query: 'carboxylase', max: 2};
      return api.search('nucleotide', input)
        .then(result => {
          return result.json();
        })
        .then(output => {
          expect(output[0].metadata.name !== undefined).to.equal(true);
          expect(output[0].metadata.organism !== undefined).to.equal(true);
          expect(output.length === 2).to.equal(true);
          done();
        });
    });

    it('getManifests() should be able get extension information', done => {
      return api.getManifests('import')
        .then(result => {
          return result.json();
        })
        .then(output => {
          expect(output.features !== undefined).to.equal(true);
          expect(output.genbank !== undefined).to.equal(true);
          done();
        });
    });

    /* todo

     it('getExtensionsInfo() should be able get extension manifests', done => {
     return api.getExtensionsInfo()
     .then(result => {
     return result.json();
     })
     .then(output => {
     expect(output.convert !== undefined).to.equal(true);
     expect(output.convert.genbank !== undefined).to.equal(true);
     expect(output.search !== undefined).to.equal(true);
     done();
     });
     });
     */

  });
});

