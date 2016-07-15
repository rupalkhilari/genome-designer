import * as fileSystem from '../../server/utils/fileSystem';
import * as persistence from '../../server/data/persistence';
import path from 'path';
import invariant from 'invariant';
import Block from '../../src/models/Block';
import parse from 'csv-parse';
import md5 from 'md5';

const csvFields = ['name', 'description', 'sequence', 'role', 'color'];
const headerRows = 1;

const roleMassageMap = {
  CDS: 'cds',
  promoter: 'promoter',
  terminator: 'terminator',
  gene: 'cds',
  mat_peptide: 'cds',
};

const zip = (keys, vals) => keys.reduce(
  (acc, key, ind) => Object.assign(acc, { [key]: vals[ind] }), {}
);

const mapPartFields = (importedObject) => {
  //fields based on array at top
  const { name, description, role, sequence, ...rest } = importedObject;

  return {
    metadata: {
      name,
      description: description,
    },
    rules: {
      role,
    },
    notes: {
      ...rest,
    },
    sequence: sequence, //this field is removed later to conform to schema
  };
};

const defaultOutputPath = path.join(__dirname, './converted.json');
const defaultOptions = {
  fields: csvFields,
  outputPath: defaultOutputPath,
};

export default function convertCsv(csvPath, inputOptions = {}) {
  invariant(csvPath, 'need a csv path as command line arg');

  const options = Object.assign({}, defaultOptions, inputOptions);
  const sequenceHash = {}; //hash of md5s, update as we go through blocks, write at end

  //todo - ensure have all the fields we expect in `csvFields`
  console.log('using fields:');
  console.log(options.fields);

  return fileSystem.fileRead(csvPath, false)
    .then(contents => {
      return new Promise((resolve, reject) => {
        parse(contents, {}, (err, output) => {
          if (err) return reject(err);
          resolve(output);
        });
      });
    })
    //remove top rows
    .then(lines => lines.slice(headerRows))
    //remove empty lines
    .then(lines => lines.filter(line => line.some(field => !!field)))
    //make object with appropriate keys
    .then(lines => lines.map(line => zip(options.fields, line)))
    //assign role
    .then(parts => parts.map(part => Object.assign(part, { role: roleMassageMap[part.role] || part.role || null })))
    //map fields to block fields
    .then(parts => parts.map(part => mapPartFields(part)))
    //update the sequence field
    .then(parts => parts.map(part => {
      const { sequence } = part;
      const sequenceMd5 = md5(sequence);

      const updatedPart = Object.assign(part, {
        sequence: {
          md5: sequenceMd5,
          length: sequence.length,
          initialBases: '' + sequence.substr(0, 6),
        },
        source: {
          source: 'csv',
          id: csvPath,
          url: '', //todo - add a URL (may need to pass this in?)
        },
      });

      Object.assign(sequenceHash, {
        [sequenceMd5]: sequence,
      });

      //wrap in the block scaffold
      return Block.classless(updatedPart);
    }))
    //make a map
    .then(blocks => blocks.reduce((acc, block) => Object.assign(acc, { [block.id]: block }), {}))
    .then(blockMap => ({
      blocks: blockMap,
      sequences: sequenceHash,
    }));
}
