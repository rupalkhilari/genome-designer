import rejectingFetch from '../../middleware/rejectingFetch';
import queryString from 'query-string';
import Block from '../../models/Block';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { convertGenbank } from '../../middleware/genbank';

// NCBI limits number of requests per user/ IP, so better to initate from the client and I support process on client...
export const name = 'NCBI';

//todo - handle RNA

//convert genbank file to bunch of blocks
//assume there is always one root construct
//returns array in form [construct, ...blocks]
const genbankToBlock = (gb) => {
  return convertGenbank(gb)
    .then(result => {
      const { blocks, roots } = result;
      const constructIndex = blocks.findIndex(block => block.id === roots[0]);
      const construct = blocks.splice(constructIndex, 1);
      return [...construct, ...blocks];
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

const parseSummary = (summary) => {
  return new Block({
    metadata: {
      name: summary.caption,
      description: summary.title,
      organism: summary.organism,
    },
    sequence: {
      length: summary.slen,
    },
    source: {
      source: 'ncbi',
      id: summary.accessionversion,
    },
  });
};

export const getSummary = (...ids) => {
  if (!ids.length) {
    return Promise.resolve([]);
  }

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
//!! important - Note that NCBI is moving to accession versions from UIDs
//   this should be the accessionversion by this point, as it was set as source.id on parseSummary.
export const get = (accessionVersion) => {
  const parametersMapped = {
    format: 'gb',
  };

  const { format } = parametersMapped;

  const url = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accessionVersion}&rettype=${format}&retmode=text`;

  //todo - this should use accessionversion

  return rejectingFetch(url)
    .then(resp => resp.text())
    .then(genbankToBlock)
    .then(blocks => blocks.map(block => wrapBlock(block, accessionVersion)));
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

export const sourceUrl = ({id}) => {
  return `http://www.ncbi.nlm.nih.gov/nuccore/${id}`;
};
