import invariant from 'invariant';
import * as egf from './egf/index';
import * as igem from './igem/index';

export const registry = {
  egf,
  igem,
};

export const register = (source) => {
  invariant(false, 'not supported yet');
  //todo - checks
  //todo - add to registry
};

export const getSources = () => Object.keys(registry);
