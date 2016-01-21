import { expect } from 'chai';
import { importProject } from '../../extensions/convert/import';

const fs = require('fs');

describe('Extensions: Features import/export', () => {
  it('import to blocks array', done => {
    fs.readFile('../res/sampleFeatureFile.tab', sampleFeatures => {
      importProject('features', sampleFeatures, result => {
        expect(result.project.components.length === 125);
        expect(result.project.components[19].metadata.name === '20:CBDcexLEAD');
        done();
      });
    });
  });
});
