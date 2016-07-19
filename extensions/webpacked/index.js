/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	var manifest = __webpack_require__(/*! json!./package.json */ 1);
	
	function render(container, options) {
	  container.innerHTML = 'extension rendered this!';
	
	  //console.log(options.boundingBox);
	
	  //throw an error for debugging debugging
	  //require('./externalFile.js').doBadThing();
	
	  var subscriber = window.constructor.store.subscribe(function (state, lastAction) {
	    var last = [];
	    var current = state.focus.blockIds;
	    if (current &&
	      current.length &&
	        (current.length !== last.length ||
	        !current.every(function (item, index) {return item !== last[index]}))
	    ) {
	
	      var block = state.blocks[current[0]];
	      block.getSequence().then(function (sequence) {
	        console.log(sequence);
	      });
	
	      console.log(current);
	      last = current;
	    }
	  });
	}
	
	window.constructor.registerExtension(manifest, render);


/***/ },
/* 1 */
/*!**************************************!*\
  !*** ./~/json-loader!./package.json ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = {
		"name": "webpacked",
		"version": "1.0.0",
		"description": "Example extension which uses Webpack to create a bundle.",
		"region": "sequenceDetail",
		"readable": "Webpacked Example",
		"scripts": {
			"prepublish": "npm run build",
			"build": "webpack -d main.js index.js"
		},
		"devDependencies": {
			"json-loader": "^0.5.4",
			"webpack": "^1.13.1"
		}
	};

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map