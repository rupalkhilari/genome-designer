import rejectingFetch from '../../middleware/rejectingFetch';
import queryString from 'query-string';
import Block from '../../models/Block';
import merge from 'lodash.merge';
import { convertGenbank } from '../../middleware/api';

// NCBI limits number of requests per user/ IP, so better to initate from the client and I support process on client...
export const name = 'NCBI';

//todo - handle RNA

const genbankToBlock = (gb) => {
  return convertGenbank(gb)
    .then(result => result.blocks);
};

const wrapBlock = (block) => {
  return new Block(merge({}, block, {
    source: {
      source: 'ncbi',
      id: block.id,
    },
  }));
};

const parseSummary = (summary) => {
  return {
    metadata: {
      name: summary.caption,
      description: summary.title,
    },
    source: {
      source: 'ncbi',
      id: summary.uid,
    },
  };
};

export const getSummary = (...ids) => {
  const idList = ids.join(',');

  const url = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nuccore&id=${idList}&retmode=json`;

  return rejectingFetch(url)
    .then(resp => resp.json())
    .then(json => {
      //returns dictionary of UID -> ncbi entry, with extra key uids
      const results = json.result;
      delete results.uids;
      //return array of results
      return Object.keys(results).map(key => results[key]);
    })
    .then(results => results.map(result => parseSummary(result)));
};

// http://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.EFetch
//note that these may be very very large, use getSummary unless you need the whole thing
export const get = (...ids) => {
  const parametersMapped = {
    format: 'gb',
  };

  const { format } = parametersMapped;
  const idList = ids.join(',');

  const url = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${idList}&rettype=${format}&retmode=text`;

  //todo - handle multiple, verify this does that
  //do we do this at all in the other search APIs?
  return rejectingFetch(url)
    .then(resp => resp.text())
    .then(genbankToBlock)
    .then(blocks => blocks.map((block, ind) => wrapBlock(block)))
    .then(blocks => blocks[0]); //hack - not handling multiple yet
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

  const url = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&${parameterString}`;

  return rejectingFetch(url)
    .then(resp => resp.json())
    .then(json => json.esearchresult.idlist)
    .then(ids => getSummary(...ids));
};
