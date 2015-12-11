import { jsdom } from 'jsdom';
import { login } from '../src/middleware/api';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

// setup authentication
// used for middleware functions, which store the sessionKey manually
login('', '');
