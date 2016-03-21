import { expect } from 'chai';
import path from 'path';
import { importProject, importBlock } from '../../plugins/convert/import';
import { exportProject, exportBlock } from '../../plugins/convert/export';
import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';

const fs = require('fs');

const sampleGenbank = `LOCUS       EU912544                          6 bp    DNA              UNK 01-JAN-1980
DEFINITION  Cloning vector pDM313, complete sequence.
ACCESSION   1
VERSION     EU912544.1  GI:198078160
KEYWORDS    .
SOURCE      .
  ORGANISM  .
REFERENCE   1  (bases 1 to 3692)
  AUTHORS   Veltman,D.M., Akar,G., Bosgraaf,L. and Van Haastert,P.J.
  TITLE     A new set of small, extrachromosomal expression vectors for
            Dictyostelium discoideum
  JOURNAL   Plasmid 61 (2), 110-118 (2009)
   PUBMED   19063918
FEATURES             Location/Qualifiers
     source          1..6
                     /organism="Cloning vector pDM313"
                     /mol_type="other DNA"
                     /db_xref="taxon:555771"
                     /note="GFP-tag for C-terminal fusion"
     block           1..3
                     /parent_block="1,0"
                     /block_id="2"
     block           1..2
                     /parent_block="2,0"
                     /block_id="5"
     block           1
                     /parent_block="5,0"
                     /block_id="8"
     block           2
                     /parent_block="5,1"
                     /block_id="9"
     block           2
                     /parent_block="9,0"
                     /block_id="10"
     block           3
                     /parent_block="2,1"
                     /block_id="6"
     block           4
                     /parent_block="1,1"
                     /block_id="3"
     block           4
                     /parent_block="3,0"
                     /block_id="7"
     block           5..6
                     /parent_block="1,2"
                     /block_id="4"
     Double_T        5
                     /parent_block
                     /block_id="4"
ORIGIN
        1 acggtt
//`;

describe('Plugins', () => {
  describe.only('Genbank Plugin', () => {
    it.skip('should import Genbank file that has nested blocks', function importGB(done) {
      importBlock('genbank', sampleGenbank)
        .then(output => {
          expect(output.project.metadata.description).to.equal('Cloning vector pDM313, complete sequence.');
          expect(output.project.metadata.name).to.equal('EU912544');
          expect(output.blocks !== undefined).to.equal(true);
          output.blocks.map(block => {
              expect(BlockDefinition.validate(block)).to.equal(true);
          });
          expect(ProjectDefinition.validate(output.project)).to.equal(true);
//          expect(output.blocks.length).to.equal(3);
//          expect(output.blocks['2'].components.length).to.equal(2);
          done();
        })
        .catch(done);
    });

    it('should import Genbank file with contiguous entries as a project', function importGB(done) {
        fs.readFile(path.resolve(__dirname, '../res/sampleGenbankContiguous.gb'), 'utf8', (err, sampleStr) => {
            importBlock('genbank', sampleStr)
                .then(output => {
                    expect(output.project).not.to.equal(undefined);
                    expect(ProjectDefinition.validate(output.project)).to.equal(true);
                    expect(output.project.metadata.name).to.equal('EU912544');
                    expect(output.project.metadata.description).to.equal('Cloning vector pDM313, complete sequence.')
                    expect(output.project.components.length).to.equal(1);
                    const parentBlock = output.blocks[output.project.components[0]];
                    expect(parentBlock.components.length).to.equal(4);
                    expect(parentBlock.metadata.name).to.equal('EU912544');
                    expect(parentBlock.metadata.description).to.equal('Cloning vector pDM313, complete sequence.');
                    expect(parentBlock.metadata.mol_type).to.equal('other DNA');
                    expect(parentBlock.metadata.start).to.equal(0);
                    expect(parentBlock.metadata.end).to.equal(119);
                    expect(parentBlock.metadata.gi).to.equal('198078160');
                    expect(parentBlock.metadata.note).to.equal('GFP-tag for C-terminal fusion');
                    expect(parentBlock.metadata.data_file_division).to.equal('SYN');
                    expect(parentBlock.metadata.type).to.equal('source');
                    expect(parentBlock.metadata.date).to.equal('06-FEB-2009');
                    expect(output.blocks[parentBlock.components[0]].metadata.type).to.equal('promoter');
                    expect(output.blocks[parentBlock.components[0]].rules.sbol).to.equal('promoter');
                    expect(output.blocks[parentBlock.components[1]].metadata.type).to.equal('CDS');
                    expect(output.blocks[parentBlock.components[1]].rules.sbol).to.equal('cds');
                    expect(output.blocks[parentBlock.components[2]].metadata.type).to.equal('terminator');
                    expect(output.blocks[parentBlock.components[3]].metadata.type).to.equal('rep_origin');
                    for (var key in output.blocks) {
                      expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
                    };
                    done();
                })
                .catch(done);
        });
    });

    it('should import Genbank file with holes as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankContiguousWithHoles.gb'), 'utf8', (err, sampleStr) => {
        importBlock('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(output.project.components.length === 1).to.equal(true);
            const parentBlock = output.blocks[output.project.components[0]];
            expect(parentBlock.components.length).to.equal(7);
            expect(output.blocks[parentBlock.components[0]].metadata.type).to.equal('filler');
            expect(output.blocks[parentBlock.components[1]].metadata.type).to.equal('promoter');
            expect(output.blocks[parentBlock.components[2]].metadata.type).to.equal('filler');
            expect(output.blocks[parentBlock.components[3]].metadata.type).to.equal('CDS');
            expect(output.blocks[parentBlock.components[4]].metadata.type).to.equal('filler');
            expect(output.blocks[parentBlock.components[5]].metadata.type).to.equal('terminator');
            expect(output.blocks[parentBlock.components[6]].metadata.type).to.equal('rep_origin');
            for (var key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            };
            done();
          })
          .catch(done);
      });
    });

    it('should import Genbank file with holes in features as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankSimpleNested.gb'), 'utf8', (err, sampleStr) => {
        importBlock('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(output.project.components.length === 1).to.equal(true);
            const parentBlock = output.blocks[output.project.components[0]];
            expect(parentBlock.components.length).to.equal(2);
            var firstBlock = output.blocks[parentBlock.components[0]];
            expect(firstBlock.metadata.type).to.equal('block');
            expect(firstBlock.components.length).to.be.equal(3);
            expect(output.blocks[firstBlock.components[0]].metadata.type).to.equal('promoter');
            expect(output.blocks[firstBlock.components[1]].metadata.type).to.equal('CDS');
            expect(output.blocks[firstBlock.components[2]].metadata.type).to.equal('filler');
            var secondBlock = output.blocks[parentBlock.components[1]];
            expect(secondBlock.metadata.type).to.equal('block');
            expect(secondBlock.components.length).to.be.equal(4);
            expect(output.blocks[secondBlock.components[0]].metadata.type).to.equal('CDS');
            expect(output.blocks[secondBlock.components[1]].metadata.type).to.equal('filler');
            expect(output.blocks[secondBlock.components[2]].metadata.type).to.equal('terminator');
            expect(output.blocks[secondBlock.components[3]].metadata.type).to.equal('rep_origin');
            for (var key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            };
            done();
          })
          .catch(done);
      });
    });

    it.skip('should import Genbank file with multiple entries as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleMultiGenbank.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project !== undefined).to.equal(true);
            expect(output.project.components.length === 4).to.equal(true);
            expect(output.blocks['2'].components.length === 2).to.equal(true);
            done();
          })
          .catch(done);
      });
    });

    it.skip('should be able convert Genbank features to Block', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbank.gb'), 'utf8', (err, sampleStr) => {
        importBlock('genbank', sampleStr)
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
          .catch(done);
      });
    });

    //todo - this should use a more correct example file, and should validate the blocks
    //fixme - this test looks like it should fail? what is 'genbank' into exportBlock()?
    it.skip('should export block to Genbank', function exportGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleBlocks.json'), 'utf8', (err, sampleBlocksJson) => {
        const sampleBlocks = JSON.parse(sampleBlocksJson);
        exportBlock('genbank', sampleBlocks)
          .then(result => {
            expect(result.indexOf('acggtt') !== -1).to.equal(true);
            expect(result.indexOf('Double_T') !== -1).to.equal(true);
            expect(result.indexOf('block           5..6') !== -1).to.equal(true);
            done();
          })
          .catch(done);
      });
    });

    it.skip('should export project to multi-record Genbank', function exportGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleProject.json'), 'utf8', (err, sampleProjJson) => {
        const sampleProj = JSON.parse(sampleProjJson);
        exportProject('genbank', sampleProj)
          .then(result => {
            //LOCUS 1, LOCUS 2, LOCUS 3, and LOCUS 4
            expect((result.match(/\/\//g) || []).length).to.equal(4);
            expect((result.match(/LOCUS\s+\d/g) || []).length).to.equal(4);
            done();
          })
          .catch(done);
      });
    });
  });
});
