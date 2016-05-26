import express from 'express';

//static registry
import registry from './registry';

const router = express.Router(); //eslint-disable-line new-cap

/**
 * :id - plugin to use (e.g. ncbi)
 * :method - what to do (e.g. search, get)
 * :queryText - query or ID depending on method
 */
router.get('/:id/:method/:queryText', (req, res, next) => {
  const { id, method, queryText } = req.params;
  const queryParams = req.query;

  const plugin = registry[id];

  //checks to make sure plugin + method present
  if (!plugin) { next('PLUGIN_NOT_PRESENT'); }
  if (!method) {next('METHOD_NOT_PROVIDED'); }
  if (!plugin[method]) { next('PLUGIN_METHOD_NOT_SUPPORTED'); }
  if (typeof plugin[method] !== 'function') { next('PLUGIN_METHOD_INVALID'); }

  Promise.resolve(plugin[method](queryText, queryParams))
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).send(err));
});

export default router;
