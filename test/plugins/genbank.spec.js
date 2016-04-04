import {expect} from 'chai';
import path from 'path';
import {importProject, importConstruct} from '../../plugins/convert/import';
import {exportProject} from '../../plugins/convert/export';
import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';

const fs = require('fs');

const getBlock = (allBlocks, blockId) => {
  for (let i = 0; i < allBlocks.length; i++) {
    if (allBlocks[i].id === blockId) {
      return allBlocks[i];
    }
  }
};

describe('Plugins', () => {
  describe('Genbank Plugin', () => {
    it('should import Genbank file with contiguous entries as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankContiguous.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(ProjectDefinition.validate(output.project)).to.equal(true);
            expect(output.project.metadata.name).to.equal('EU912544');
            expect(output.project.metadata.description).to.equal('Cloning vector pDM313, complete sequence.');
            expect(output.project.components.length).to.equal(1);
            const parentBlock = getBlock(output.blocks, output.project.components[0]);
            expect(parentBlock.components.length).to.equal(4);
            expect(parentBlock.metadata.name).to.equal('EU912544');
            expect(parentBlock.metadata.description).to.equal('Cloning vector pDM313, complete sequence.');
            expect(parentBlock.metadata.genbank.feature_annotations.mol_type).to.equal('other DNA');
            expect(parentBlock.metadata.start).to.equal(0);
            expect(parentBlock.metadata.end).to.equal(119);
            expect(parentBlock.metadata.genbank.annotations.gi).to.equal('198078160');
            expect(parentBlock.metadata.genbank.feature_annotations.note).to.equal('GFP-tag for C-terminal fusion');
            expect(parentBlock.metadata.genbank.annotations.data_file_division).to.equal('SYN');
            expect(parentBlock.metadata.genbank.annotations.date).to.equal('06-FEB-2009');
            expect(getBlock(output.blocks, parentBlock.components[0]).metadata.type).to.equal('promoter');
            expect(getBlock(output.blocks, parentBlock.components[0]).rules.sbol).to.equal('promoter');
            expect(getBlock(output.blocks, parentBlock.components[1]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, parentBlock.components[1]).rules.sbol).to.equal('cds');
            expect(getBlock(output.blocks, parentBlock.components[2]).metadata.type).to.equal('terminator');
            expect(getBlock(output.blocks, parentBlock.components[3]).metadata.type).to.equal('rep_origin');
            for (let key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            }
            done();
          })
          .catch(done);
      });
    });

    it('should import Genbank file with holes as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankContiguousWithHoles.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(output.project.components.length === 1).to.equal(true);
            const parentBlock = getBlock(output.blocks, output.project.components[0]);
            expect(parentBlock.components.length).to.equal(7);
            expect(getBlock(output.blocks, parentBlock.components[0]).metadata.type).to.equal('filler');
            expect(getBlock(output.blocks, parentBlock.components[1]).metadata.type).to.equal('promoter');
            expect(getBlock(output.blocks, parentBlock.components[2]).metadata.type).to.equal('filler');
            expect(getBlock(output.blocks, parentBlock.components[3]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, parentBlock.components[4]).metadata.type).to.equal('filler');
            expect(getBlock(output.blocks, parentBlock.components[5]).metadata.type).to.equal('terminator');
            expect(getBlock(output.blocks, parentBlock.components[6]).metadata.type).to.equal('rep_origin');
            for (let key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            }
            done();
          })
          .catch(done);
      });
    });

    it('should import Genbank file with holes in features as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankSimpleNested.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(output.project.components.length === 1).to.equal(true);
            const parentBlock = getBlock(output.blocks, output.project.components[0]);
            expect(parentBlock.components.length).to.equal(2);
            let firstBlock = getBlock(output.blocks, parentBlock.components[0]);
            expect(firstBlock.metadata.type).to.equal('block');
            expect(firstBlock.components.length).to.be.equal(3);
            expect(getBlock(output.blocks, firstBlock.components[0]).metadata.type).to.equal('promoter');
            expect(getBlock(output.blocks, firstBlock.components[1]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, firstBlock.components[2]).metadata.type).to.equal('filler');
            let secondBlock = getBlock(output.blocks, parentBlock.components[1]);
            expect(secondBlock.metadata.type).to.equal('block');
            expect(secondBlock.components.length).to.be.equal(4);
            expect(getBlock(output.blocks, secondBlock.components[0]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, secondBlock.components[1]).metadata.type).to.equal('filler');
            expect(getBlock(output.blocks, secondBlock.components[2]).metadata.type).to.equal('terminator');
            expect(getBlock(output.blocks, secondBlock.components[3]).metadata.type).to.equal('rep_origin');
            for (let key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            }
            done();
          })
          .catch(done);
      });
    });

    it('should import Genbank file with multiple entries as a project', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleMultiGenbank.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(ProjectDefinition.validate(output.project)).to.equal(true);
            expect(output.project.metadata.name).to.equal('EU912543');
            expect(output.project.metadata.description).to.equal('Cloning vector pDM313, complete sequence.')
            expect(output.project.components.length).to.equal(3);
            expect(getBlock(output.blocks, output.project.components[0]).metadata.name).to.equal('EU912541');
            expect(getBlock(output.blocks, output.project.components[1]).metadata.name).to.equal('EU912542');
            expect(getBlock(output.blocks, output.project.components[2]).metadata.name).to.equal('EU912543');
            done();
          })
          .catch(done);
      });
    });

    it('should import Genbank file with holes in features as a construct', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankSimpleNested.gb'), 'utf8', (err, sampleStr) => {
        importConstruct('genbank', sampleStr)
          .then(output => {
            expect(output.project).to.equal(undefined);
            expect(output.roots.length).to.equal(1);
            const parentBlock = getBlock(output.blocks, output.roots[0]);
            expect(parentBlock.components.length).to.equal(2);
            let firstBlock = getBlock(output.blocks, parentBlock.components[0]);
            expect(firstBlock.metadata.type).to.equal('block');
            expect(firstBlock.components.length).to.be.equal(3);
            expect(getBlock(output.blocks, firstBlock.components[0]).metadata.type).to.equal('promoter');
            expect(getBlock(output.blocks, firstBlock.components[1]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, firstBlock.components[2]).metadata.type).to.equal('filler');
            let secondBlock = getBlock(output.blocks, parentBlock.components[1]);
            expect(secondBlock.metadata.type).to.equal('block');
            expect(secondBlock.components.length).to.be.equal(4);
            expect(getBlock(output.blocks, secondBlock.components[0]).metadata.type).to.equal('CDS');
            expect(getBlock(output.blocks, secondBlock.components[1]).metadata.type).to.equal('filler');
            expect(getBlock(output.blocks, secondBlock.components[2]).metadata.type).to.equal('terminator');
            expect(getBlock(output.blocks, secondBlock.components[3]).metadata.type).to.equal('rep_origin');
            for (let key in output.blocks) {
              expect(BlockDefinition.validate(output.blocks[key])).to.equal(true);
            }
            done();
          })
          .catch(done);
      });
    });

    it('should fail on bad Genbank format', function importGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/badFormatGenbank.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output).to.equal('Invalid Genbank format.');
            done();
          })
          .catch(done);
      });
    });

    it('should export simple project to Genbank', function exportGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/simpleProject.json'), 'utf8', (err, sampleProjectJson) => {
        const sampleProject = JSON.parse(sampleProjectJson);
        exportProject('genbank', sampleProject)
          .then(result => {
            expect(result).to.contain('LOCUS');
            done();
          })
          .catch(done);
      });
    });

    it('should roundtrip a Genbank through our app', function exportGB(done) {
      fs.readFile(path.resolve(__dirname, '../res/sampleGenbankContiguous.gb'), 'utf8', (err, sampleStr) => {
        importProject('genbank', sampleStr)
          .then(output => {
            expect(output.project).not.to.equal(undefined);
            expect(ProjectDefinition.validate(output.project)).to.equal(true);
            expect(output.project.metadata.name).to.equal('EU912544');
            expect(output.project.metadata.description).to.equal('Cloning vector pDM313, complete sequence.')
            exportProject('genbank', output)
              .then(result => {
                expect(result).to.contain('LOCUS       EU912544                 120 bp    DNA');
                expect(result).to.contain('SYN 06-FEB-2009');
                expect(result).to.contain('DEFINITION  Cloning vector pDM313, complete sequence.');
                expect(result).to.contain('ACCESSION   EU912544');
                expect(result).to.contain('VERSION     EU912544.1  GI:198078160');
                expect(result).to.contain('SOURCE      Cloning vector pDM313');
                expect(result).to.contain('ORGANISM  Cloning vector pDM313');
                expect(result).to.contain('other sequences; artificial sequences; vectors.');
                expect(result).to.contain('REFERENCE   1');
                expect(result).to.contain('AUTHORS   Veltman,D.M., Akar,G., Bosgraaf,L. and Van Haastert,P.J.');
                expect(result).to.contain('TITLE     A new set of small, extrachromosomal expression vectors for');
                expect(result).to.contain('Dictyostelium discoideum');
                expect(result).to.contain('JOURNAL   Plasmid 61 (2), 110-118 (2009)');
                expect(result).to.contain('PUBMED   19063918');
                expect(result).to.contain('');
                done();
              });
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
