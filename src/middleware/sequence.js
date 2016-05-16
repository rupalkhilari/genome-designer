import rejectingFetch from './rejectingFetch';
import { getItem, setItem } from './localStorageCache';
import { headersGet, headersPost } from './headers';
import { dataApiPath } from './paths';

const getSequenceUrl = (md5, format = null, blockId = null, projectId) => dataApiPath(`sequence/${md5}` + (!!blockId ? `/${blockId}` : ''));

const cacheSequence = (md5, sequence) => {
  //do nothing for now...
  //setItem(md5, sequence);
};

export const getSequence = (md5, format) => {
  const url = getSequenceUrl(md5, format);

  const cached = getItem(md5);
  if (cached) {
    return Promise.resolve(cached);
  }

  return rejectingFetch(url, headersGet())
    .then((resp) => resp.text())
    .then(sequence => {
      cacheSequence(md5, sequence);
      return sequence;
    });
};

export const writeSequence = (md5, sequence, blockId, projectId) => {
  const url = getSequenceUrl(md5, null, blockId, projectId);
  const stringified = JSON.stringify({ sequence });

  cacheSequence(md5, sequence);

  return rejectingFetch(url, headersPost(stringified));
};
