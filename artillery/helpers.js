var uuid = require('../node_modules/node-uuid/uuid.js');

module.exports = {

  createUserJSON,
  createSimpleProjectJSON,

};

/**
 * setup the user JSON identically to a user in production.
 * @param requestParams
 * @param context
 * @param ee
 * @param next
 * @returns {*}
 */
function createUserJSON(requestParams, context, ee, next) {
  requestParams.json = {
    user: {
      email: `charles_darwin_${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}@hotmail.com`,
      firstName: 'Charles',
      lastName: 'Darwin',
      password: 'Beagle',
    },
    config: {},
  };
  return next();
}

/**
 * create a simple 1 block project
 * @param requestParams
 * @param context
 * @param ee
 * @param next
 * @returns {*}
 */
function createSimpleProjectJSON(requestParams, context, ee, next) {

  // create project ID and use it to set the end point
  const projectId = `project-${uuid.v4()}`;
  requestParams.url = `/data/projects/${projectId}`;

  // create a parent construct id and a child block id
  const parentId = `block-${uuid.v4()}`;
  const childId = `block-${uuid.v4()}`;

  // for timestamps use now - 5 seconds
  const past = Date.now() - 5000;

  // setup project JSON rollup
  requestParams.json = {
    'project': {
      'id': projectId,
      'parents': [],
      'metadata': {
        'name': '',
        'description': '',
        'authors': [],
        'created': past,
        'tags': {},
      },
      'lastSaved': 0,
      'components': [
        parentId,
      ],
      'settings': {},
    },
    'blocks': {},
  };

  requestParams.json.blocks[parentId] = {
    'id': parentId,
    'parents': [],
    'metadata': {
      'name': '',
      'description': '',
      'authors': [],
      'created': past,
      'tags': {},
      'color': '#D28482',
    },
    'sequence': {
      'md5': '',
      'url': null,
      'length': 0,
      'annotations': [],
      'initialBases': '',
    },
    'source': {
      'source': '',
      'id': '',
      'url': null,
    },
    'rules': {},
    'components': [
      childId,
    ],
    'options': {},
    'notes': {},
    'projectId': projectId,
  };

  requestParams.json.blocks[childId] = {

    'id': childId,
    'parents': [],
    'metadata': {
      'name': '',
      'description': '',
      'authors': [],
      'created': 1474922226091,
      'tags': {},
      'color': '#e7aaa9',
    },
    'sequence': {
      'md5': '',
      'url': null,
      'length': 0,
      'annotations': [],
      'initialBases': '',
    },
    'source': {
      'source': '',
      'id': '',
      'url': null,
    },
    'rules': {
      'role': 'protease',
    },
    'components': [],
    'options': {},
    'notes': {},
    'projectId': projectId,
  };
  return next();
}
