import * as egf from './egf/index';

/*
At the moment, these registries are pretty dumb. They just need to expose a search() function which takes a list of terms, and returns a list of Blocks in the proper format. It should return a list for an empty search term as well.
 */

export const registry = {
  egf,
};

export const sources = Object.keys(sources);
