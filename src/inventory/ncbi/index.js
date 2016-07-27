/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import rejectingFetch from '../../middleware/rejectingFetch';
import queryString from 'query-string';
import Block from '../../models/Block';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { convertGenbank } from '../../middleware/genbank';

// NCBI limits number of requests per user/ IP, so better to initate from the client and I support process on client...
export const name = 'NCBI';

const makeFastaUrl = (id) => `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${id}&rettype=fasta&retmode=text`;

//todo - handle RNA

//convert genbank file to bunch of blocks
//assume there is always one root construct
//returns array in form [construct, ...blocks]
const genbankToBlock = (gb, onlyConstruct) => {
  return convertGenbank(gb, onlyConstruct)
    .then(result => {
      const { blocks, roots } = result;
      const blockArray = Object.keys(blocks).map(blockId => blocks[blockId]);
      const constructIndex = blockArray.findIndex(block => block.id === roots[0]);
      const construct = blockArray.splice(constructIndex, 1);
      return [...construct, ...blockArray];
    });
};

const wrapBlock = (block, id) => {
  return new Block(merge({}, block, {
    source: {
      source: 'ncbi',
      id,
    },
  }));
};

//pass in form { blockField: summaryField }
const mapSummaryToNotes = (map, summary) => {
  return Object.keys(map).reduce((acc, blockField) => {
    const summaryField = map[blockField];
    const summaryValue = summary[summaryField];
    if (summaryValue) {
      return Object.assign(acc, { [ blockField]: summaryValue });
    }
    return acc;
  }, {});
};

const parseSummary = (summary) => {
  const fastaUrl = makeFastaUrl(summary.accessionversion);

  return new Block({
    metadata: {
      name: summary.caption,
      description: summary.title,
      organism: summary.organism,
    },
    sequence: {
      length: summary.slen,
      download: () => rejectingFetch(fastaUrl)
        .then(resp => resp.text())
        .then(fasta => fasta.split('\n').slice(1).join('')),
    },
    source: {
      source: 'ncbi',
      id: summary.accessionversion,
    },
    notes: mapSummaryToNotes({
      Organism: 'organism',
      Molecule: 'moltype',
      'Date Created': 'createdate',
      'Last Updated': 'updatedate',
      extra: 'extra',
    }, summary),
  });
};

export const getSummary = (...ids) => {
  if (!ids.length) {
    return Promise.resolve([]);
  }

  const idList = ids.join(',');

  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nuccore&id=${idList}&retmode=json`;

  return rejectingFetch(url)
    .then(resp => resp.json())
    .then(json => {
      //returns dictionary of UID -> ncbi entry, with extra key uids
      const results = json.result;
      delete results.uids;
      //return array of results
      return Object.keys(results).map(key => results[key]);
    })
    .then(results => results.map(result => parseSummary(result)))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// http://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.EFetch
//note that these may be very very large, use getSummary unless you need the whole thing
export const get = (accessionVersion, parameters = {}, summary) => {
  const parametersMapped = Object.assign({
    format: 'gb',
    onlyConstruct: false,
  }, parameters);

  const { format } = parametersMapped;

  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accessionVersion}&rettype=${format}&retmode=text`;

  return rejectingFetch(url)
    .then(resp => resp.text())
    .then(genbank => genbankToBlock(genbank, parametersMapped.onlyConstruct))
    .then(blocks => blocks.map(block => wrapBlock(block, accessionVersion)))
    .then(blockModels => {
      const [constructUnmerged, ... rest] = blockModels;
      const construct = constructUnmerged.merge({
        notes: summary.notes,
      });

      return parametersMapped.onlyConstruct ?
        [construct.merge({ sequence: summary.sequence })] : //if just returning the construct (e.g. for inventory), patch it with the sequence information
        [construct, ...rest];
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// http://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch
export const search = (query, options = {}) => {
  //parameters we support, in this format
  const parameters = Object.assign({
    start: 0,
    entries: 20,
  }, options);

  //mapped to NCBI syntax
  const mappedParameters = {
    retstart: parameters.start,
    retmax: parameters.entries,
    term: query,
    retmode: 'json',
  };

  const parameterString = queryString.stringify(mappedParameters);

  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&${parameterString}`;

  return rejectingFetch(url)
    .then(resp => resp.json())
    .then(json => json.esearchresult.idlist)
    .then(ids => getSummary(...ids))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const sourceUrl = ({ url, id }) => {
  if (!id && !url) {
    return null;
  }
  return !!id ? `https://www.ncbi.nlm.nih.gov/nuccore/${id}` : url;
};
