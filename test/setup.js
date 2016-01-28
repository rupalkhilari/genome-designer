import { jsdom } from 'jsdom';
//import { login } from '../src/middleware/api';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
window.console = global.console;

// setup authentication
// used for middleware functions, which store the sessionKey manually

//we need to require this, so that it runs here and is not part of the static build, as the middleware relies on the window being present, which is set up above
const api = require('../src/middleware/api');
api.login('', '');
