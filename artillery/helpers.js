module.exports = {

  createUserJSON,

};

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
  console.log('JSON:', JSON.stringify(requestParams.json, null, 4));

  return next();
}