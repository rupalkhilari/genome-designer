/*
 need to install npm package csv-parse

 call like this (from project root):

 babel-node ./src/inventory/andrea/convertCsv.js /path/to/file.csv /path/to/output.json

 do not import into client bundle. it will break it.
 */

import * as filePaths from '../../../server/utils/filePaths';
import * as fileSystem from '../../../server/utils/fileSystem';
import Block from '../../models/Block';
import parse from 'csv-parse';
import md5 from 'md5';
import path from 'path';

//edit these dependent on the spreadsheet
const fields = ['position', 'part', 'category', 'sub-category', 'sequence', 'description'];

const headerRows = 2;

//converting categories
const roleMap = {
  'Homology Arm': '',
  'inverted terminal repeat sequences (ITRs)': '',
  'Insulators': 'insulator',
  'Promoters': 'promoter',
  'RNA regulatory sequences': 'regulatory',
  'Site-specific recombinases recognition sites': '',
  'Peptide Tags': 'tag',
  'Site-specific recombinases': '',
  'RNA-Binding proteins': '',
  'Fluorescent Reporter': 'reporter',
  'Peptide Linker': 'structural',
  '2A-like peptide sequences': '',
  'IRES (Internal Ribosome Entry Sequence)': 'rbs',
  'Selection Markers': 'selection',
  'Dimerization domain': 'structural',
  'Bioluminescent Reporters': 'reporter',
  'Structural proteins': 'structural',
  'PolyA transcription terminators': 'terminator',
  'Transcription Factor': '',
  'Episomal elements': '',
};

const trimSequence = (sequence) => {
  const front = "5'-CGTCTCgNNNN".length;
  const back = "NNNN-3'".length;
  const len = sequence.length;
  return sequence.substring(front, len - back);
};

const mapFields = (imported) => {
  return {
    metadata: {
      name: imported.part,
      description: imported.description,
      egfPosition: imported.position,
    },
    source: {
      source: 'egf',
      id: imported.part, //todo - need EGF part ID
    },
    rules: {
      role: imported.role,
    },
    sequence: imported.sequence, //this field is removed later to conform to schema
  };
};

const zip = (keys, vals) => keys.reduce(
  (acc, key, ind) => Object.assign(acc, { [key]: vals[ind] }), {}
);

const defaultOutput = path.join(__dirname, './partList.json');

export default function convertCsv(csvPath, outputPath = defaultOutput) {
  return fileSystem.fileRead(csvPath, false)
    .then(contents => {
      return new Promise((resolve, reject) => {
        parse(contents, {}, (err, output) => {
          if (err) return reject(err);
          resolve(output);
        });
      });
    })
    .then(lines => lines.slice(headerRows))
    .then(lines => lines.map(line => zip(fields, line)))
    .then(parts => parts.map(part => Object.assign(part, { role: roleMap[part.category] || null })))
    .then(parts => parts.map(part => mapFields(part)))
    .then(parts => Promise.all(parts.map(part => {
      const untrimmed = part.sequence;
      const sequence = trimSequence(untrimmed);
      const sequenceMd5 = md5(sequence);
      const filePath = path.join(__dirname, '../../../data/egf_parts/sequences', sequenceMd5);

      return fileSystem.fileWrite(filePath, sequence, false)
        .then(() => {
          return Object.assign(part, {
            sequence: {
              md5: sequenceMd5,
              length: sequence.length,
              initialBases: sequence.substr(0, 5),
            },
          });
        });
    })))
    .then(parts => parts.map(part => new Block(part)))
    .then(blocks => fileSystem.fileWrite(outputPath, blocks));
}

convertCsv.apply(null, process.argv.slice(2));
