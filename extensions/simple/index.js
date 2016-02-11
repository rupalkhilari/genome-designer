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
	var external = __webpack_require__(/*! ./externalFile.js */ 2);
	
	function render(container) {
	  container.innerHTML = 'extension loaded!';
	
	  external.doBadThing();
	
	  var subscriber = window.gd.store.subscribe(function (state, lastAction) {
	    var last = [];
	    var current = state.ui.currentBlocks;
	    if (current &&
	      current.length &&
	        (current.length !== last.length ||
	        !current.every(function (item, index) {return item !== last[index]}))
	    ) {
	      console.log(current);
	      last = current;
	    }
	  });
	
	
	}
	
	window.gd.registerExtension(manifest, render);


/***/ },
/* 1 */
/*!**************************************!*\
  !*** ./~/json-loader!./package.json ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = {
		"name": "simple",
		"version": "1.0.0",
		"description": "Simple Extensions",
		"region": "sequenceDetail",
		"readable": "Simple",
		"scripts": {
			"build": "npm install && webpack -d main.js index.js"
		},
		"devDependencies": {
			"json-loader": "^0.5.4"
		}
	};

/***/ },
/* 2 */
/*!*************************!*\
  !*** ./externalFile.js ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = {
	  doBadThing: function doBadThing() {
	    throw new Error('Oh nodes!');
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map