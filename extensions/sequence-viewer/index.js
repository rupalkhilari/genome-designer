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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _viewer = __webpack_require__(1);
	
	var _viewer2 = _interopRequireDefault(_viewer);
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _annotation = __webpack_require__(26);
	
	var _annotation2 = _interopRequireDefault(_annotation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var viewer = void 0;
	var unsubscribe = void 0;
	
	function getDisplayBlocksAndAnnotations() {
	
	  var blocks = [];
	  var annotations = [];
	  var topSelectedBlocks = window.constructor.api.focus.focusGetBlockRange();
	
	  if (topSelectedBlocks) {
	    topSelectedBlocks.forEach(function (block) {
	
	      // map the annotations to a little wrapper object
	      block.sequence.annotations.forEach(function (nativeAnnotation) {
	        annotations.push(new _annotation2.default(nativeAnnotation, block));
	      });
	
	      var children = window.constructor.api.blocks.blockFlattenConstructAndLists(block.id);
	      if (children && children.length === 0) {
	        blocks.push(block);
	      } else {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var node = _step.value;
	
	            if (node.components && node.components.length === 0) {
	              blocks.push(node);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    });
	  }
	  return { blocks: blocks, annotations: annotations };
	}
	
	function extensionClosed() {
	  if (viewer) {
	    unsubscribe();
	    unsubscribe = null;
	    viewer.dispose();
	    viewer = null;
	  }
	}
	
	function render(container, options) {
	
	  // update the viewer
	  var updateViewer = function updateViewer(state) {
	    var _getDisplayBlocksAndA = getDisplayBlocksAndAnnotations();
	
	    var blocks = _getDisplayBlocksAndA.blocks;
	    var annotations = _getDisplayBlocksAndA.annotations;
	
	    viewer.newDataSet(blocks, annotations, state);
	    viewer.render();
	  };
	
	  // create viewer
	  (0, _invariant2.default)(!viewer, 'the viewer should only be created once');
	  viewer = new _viewer2.default({
	    parent: container
	  });
	
	  // initialize with current state of app
	  updateViewer(window.constructor.store.getState());
	
	  // update viewer on various event while saving the unsubscribe event
	  unsubscribe = window.constructor.store.subscribe(function (state, lastAction) {
	    if (['FOCUS_BLOCKS', 'BLOCK_SET_COLOR', 'BLOCK_RENAME', 'FOCUS_BLOCK_OPTION', 'FOCUS_FORCE_BLOCKS', 'BLOCK_SET_SEQUENCE'].includes(lastAction.type)) {
	
	      updateViewer(state);
	    }
	  });
	  return extensionClosed;
	}
	
	// bind this extension, by name, to its render function
	window.constructor.extensions.register('sequence-viewer', render);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _elementcache = __webpack_require__(5);
	
	var _elementcache2 = _interopRequireDefault(_elementcache);
	
	var _charmeasure = __webpack_require__(6);
	
	var _userinterface = __webpack_require__(7);
	
	var _userinterface2 = _interopRequireDefault(_userinterface);
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _box2d = __webpack_require__(14);
	
	var _box2d2 = _interopRequireDefault(_box2d);
	
	var _sequenceRow = __webpack_require__(16);
	
	var _sequenceRow2 = _interopRequireDefault(_sequenceRow);
	
	var _separatorSequenceRow = __webpack_require__(17);
	
	var _separatorSequenceRow2 = _interopRequireDefault(_separatorSequenceRow);
	
	var _reverseSequenceRow = __webpack_require__(18);
	
	var _reverseSequenceRow2 = _interopRequireDefault(_reverseSequenceRow);
	
	var _blockSequenceRow = __webpack_require__(19);
	
	var _blockSequenceRow2 = _interopRequireDefault(_blockSequenceRow);
	
	var _rulerRow = __webpack_require__(20);
	
	var _rulerRow2 = _interopRequireDefault(_rulerRow);
	
	var _annotationRow = __webpack_require__(21);
	
	var _annotationRow2 = _interopRequireDefault(_annotationRow);
	
	__webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * used to track render cycles. It is incremented each time render is called. Rows which
	 * are not touched by the current render cycle are removed from the DOM
	 * @type {number}
	 */
	var renderCycle = 0;
	
	/**
	 * character map for generating the reverse strand
	 * @type {{a: string, t: string, g: string, c: string}}
	 */
	var reverseMap = {
	  'a': 't',
	  't': 'a',
	  'g': 'c',
	  'c': 'g',
	  'A': 'T',
	  'T': 'A',
	  'G': 'C',
	  'C': 'G'
	};
	
	/**
	 * sequence viewer
	 */
	
	var SequenceViewer = function () {
	
	  // constructor saves options and setups basic / empty container
	  function SequenceViewer(options) {
	    _classCallCheck(this, SequenceViewer);
	
	    // setup default option with overrides supplied by caller
	    this.options = Object.assign({
	      parent: null,
	      reverse: true
	    }, options);
	
	    // empty block contents and associated reverse strand
	    this.emptyBlockStr = ' empty block ';
	    this.emptyBlockReverseStr = '-'.repeat(this.emptyBlockStr.length);
	
	    // sequence cache, key = block.id
	    this.sequenceCache = {};
	
	    // set basic empty DOM structure
	    this.fabric();
	    // size to current window, relayout and render
	    this.resized();
	  }
	
	  /**
	   * we are being removed from the app
	   */
	
	
	  _createClass(SequenceViewer, [{
	    key: 'dispose',
	    value: function dispose() {
	      if (!this.disposed) {
	        this.userInterface.dispose();
	        this.userInterface = null;
	        this.disposed = true;
	      }
	    }
	
	    /**
	     * when asked to display new blocks/construct. This resets everything
	     */
	
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.newDataSet();
	      this.render();
	    }
	
	    /**
	     * reset the entire row cache
	     */
	
	  }, {
	    key: 'resetRowCache',
	    value: function resetRowCache() {
	      if (!this.rowCache) {
	        this.rowCache = new _elementcache2.default(10000);
	      } else {
	        this.rowCache.empty();
	      }
	    }
	
	    /**
	     * true if our client area is too small to be useful
	     */
	
	  }, {
	    key: 'tooSmall',
	    value: function tooSmall() {
	      return this.rowLength < 1 || this.rowsContainerBounds.width < 10 || this.rowsContainerBounds.height < 10;
	    }
	
	    /**
	     * call whenever or size is changed.
	     */
	
	  }, {
	    key: 'resized',
	    value: function resized() {
	      // resize events can be sent by the app before we have any data, so protect against that
	      if (!this.blockList) {
	        this.newDataSet();
	      }
	      // rows will all change on size change so reset with a new cache
	      this.resetRowCache();
	      // calculate row length / bounds based on current client size
	      this.calculateSizeMetrics();
	      if (!this.tooSmall()) {
	        // map blocks and annotations to row
	        this.mapDataSet();
	        // ensure firstRow is still valid
	        this.firstRow = Math.min(this.rowList.length - 1, this.firstRow);
	        this.userInterface.updateSelection();
	        // draw
	        this.render();
	      }
	    }
	
	    /**
	     * calculate bounds and row length based on current size
	     */
	
	  }, {
	    key: 'calculateSizeMetrics',
	    value: function calculateSizeMetrics() {
	      // calculate row length for the new window size
	      this.rowsContainerBounds = this.rowsContainer.el.getBoundingClientRect();
	      this.rowLength = Math.floor(this.rowsContainerBounds.width / this.getCharWidth());
	    }
	    /**
	     * number of complete or partial rows that are visible
	     */
	
	  }, {
	    key: 'rowsVisible',
	    value: function rowsVisible() {
	      // if data set is empty, then no rows
	      if (this.rowList.length === 0) {
	        return 0;
	      }
	      var index = this.firstRow;
	      var height = 0;
	      while (height < this.rowsContainerBounds.height && index < this.rowList.length) {
	        height += this.getRowHeight(index);
	        index += 1;
	      }
	      return index - this.firstRow;
	    }
	
	    /**
	     * get the bounds of row, or an empty box if the row is not currently visible
	     */
	
	  }, {
	    key: 'getRowBounds',
	    value: function getRowBounds(index) {
	      var box = new _box2d2.default();
	      var visible = this.rowsVisible();
	      var y = 0;
	      for (var i = this.firstRow; i < this.firstRow + visible; i += 1) {
	        var height = this.getRowHeight(i);
	        if (i === index) {
	          box.y = y;
	          box.width = this.getCharWidth() * this.rowLength;
	          box.height = height;
	          break;
	        }
	        y += height;
	      }
	      return box;
	    }
	
	    /**
	     * return the index of the row containing the given client y position (0 === top of client area )
	     * Returns -1 if y is not within a row
	     * @param y - pixel coordinate relative to window
	     */
	
	  }, {
	    key: 'getRowIndexFromY',
	    value: function getRowIndexFromY(y) {
	      if (y < 0) {
	        return -1;
	      }
	      var visible = this.rowsVisible();
	      var rowIndex = this.firstRow;
	      var currentY = 0;
	      for (var i = this.firstRow; i < this.firstRow + visible; i += 1) {
	        currentY += this.getRowHeight(rowIndex);
	        if (y < currentY) {
	          return rowIndex;
	        }
	        rowIndex += 1;
	      }
	      return -1;
	    }
	
	    /**
	     * return column clamped to length of given row
	     * @param x - pixel coordinate relative to client area
	     */
	
	  }, {
	    key: 'getColumnIndexFromX',
	    value: function getColumnIndexFromX(x, row) {
	      var column = Math.floor(x / this.getCharWidth());
	      var records = this.rowList[row].blockRecords;
	      var record = records[records.length - 1];
	      if (column < 0 || column >= record.startRowOffset + record.length) {
	        return -1;
	      }
	      return column;
	    }
	
	    /**
	     * width of fixed pitch font
	     * @returns {number}
	     */
	
	  }, {
	    key: 'getCharWidth',
	    value: function getCharWidth() {
	      return this.fontMetrics.w;
	    }
	
	    /**
	     * height of fixed pitch font
	     * @returns {number}
	     */
	
	  }, {
	    key: 'getCharHeight',
	    value: function getCharHeight() {
	      return this.fontMetrics.h * 1.3 >> 0;
	    }
	
	    /**
	     * height of a row, including the variable number of annotations
	     * @returns {number}
	     */
	
	  }, {
	    key: 'getRowHeight',
	    value: function getRowHeight(index) {
	      var annotations = this.rowList[index].annotationDepth;
	      return this.getCharHeight() * (annotations + (this.options.reverse ? 8 : 7));
	    }
	
	    /**
	     * show or hide the reverse strand ( argument is optional )
	     * Return the current state of the reverse strand
	     * @param show
	     */
	
	  }, {
	    key: 'showReverseStrand',
	    value: function showReverseStrand(show) {
	      if (arguments.length === 1) {
	        this.options.reverse = show;
	        // reset cache since all rows will change
	        this.resetRowCache();
	      }
	      return this.options.reverse;
	    }
	
	    /**
	     * render the entire view, using cached rows if possible
	     */
	
	  }, {
	    key: 'render',
	    value: function render() {
	      //console.time('Render');
	      (0, _invariant2.default)(this.fontMetrics && this.blockRowMap && this.rowList, 'cannot render until layout has been mapped');
	      // ignore if resized too small
	      if (this.tooSmall()) {
	        return;
	      }
	      // how many rowsContainer ( including partial rowsContainer ) will we accommodate )
	      var rowsFit = this.rowsVisible();
	      var limit = Math.min(this.rowList.length, this.firstRow + rowsFit);
	      // render all rowsContainer and records in each row
	      for (var rowIndex = this.firstRow; rowIndex < limit; rowIndex += 1) {
	        // see if we have this row in our cache otherwise we will have to create and render it
	        var rowEl = this.rowCache.getElement(rowIndex);
	        if (!rowEl) {
	          // row wasn't in the cache so create and render
	          rowEl = this.renderRow(rowIndex);
	          // add to cache
	          this.rowCache.addElement(rowIndex, rowEl);
	        }
	        // position row container
	        var rowBounds = this.getRowBounds(rowIndex);
	        rowEl.setStyles({
	          left: rowBounds.x + 'px',
	          top: rowBounds.y + 'px',
	          width: rowBounds.w + 'px',
	          height: rowBounds.h + 'px'
	        });
	        // add to the DOM if not currently parented
	        if (!rowEl.el.parentNode) {
	          this.rowsContainer.appendChild(rowEl);
	        }
	        // mark this row with the current render cycle
	        rowEl.el.setAttribute('render-cycle', renderCycle);
	      }
	      // remove any rows from the rowsContainer that were not updated during the current render cycle
	      this.rowsContainer.forEachChild(function (rowElement) {
	        if (parseFloat(rowElement.getAttribute('render-cycle')) !== renderCycle) {
	          rowElement.parentNode.removeChild(rowElement);
	        }
	      });
	      // user interface must be re-rendered as well
	      this.userInterface.render();
	      // bump to the next render cycle
	      renderCycle += 1;
	      //console.timeEnd('Render');
	    }
	
	    /**
	     * render a single row of the view
	     * @param rowIndex
	     */
	
	  }, {
	    key: 'renderRow',
	    value: function renderRow(rowIndex) {
	      var _this = this;
	
	      // get the current row
	      var row = this.rowList[rowIndex];
	      // create an element to contain the entire row
	      var rowEl = (0, _dom2.default)('<div class="row-element"></div>');
	      // render all the block records for this row
	      row.blockRecords.forEach(function (record) {
	        // the sequence strand itself
	        (0, _sequenceRow2.default)(_this, rowEl, record, 0);
	        // separator row
	        (0, _separatorSequenceRow2.default)(_this, rowEl, record, _this.getCharHeight());
	        // optional reverse strand
	        if (_this.options.reverse) {
	          (0, _reverseSequenceRow2.default)(_this, rowEl, record, _this.getCharHeight() * 2);
	        }
	        // render the block
	        (0, _blockSequenceRow2.default)(_this, rowEl, record, _this.getCharHeight() * (_this.options.reverse ? 3 : 2));
	      });
	      // render any annotations on this row
	      if (row.annotationRecords) {
	        row.annotationRecords.forEach(function (record) {
	          (0, _annotationRow2.default)(_this, rowEl, record, _this.getCharHeight() * (_this.options.reverse ? 4 : 3));
	        });
	      }
	      // render the sequence ruler with numbers ( 10's ) from start of row to end of row
	      // get the length of this row, which varies only for the last row of the data set
	      var rowChars = rowIndex === this.rowList.length - 1 ? this.lastRowChars() : this.rowLength;
	      var ry = this.getCharHeight() * (row.annotationDepth + (this.options.reverse ? 4 : 3)) + this.getCharHeight() * 0.5;
	      (0, _rulerRow2.default)(this, rowEl, ry, rowIndex * this.rowLength, rowChars);
	
	      // return the row container
	      return rowEl;
	    }
	
	    /**
	     * if the sequence is not available
	     * @param block
	     * @param offset
	     * @param length
	     * @param reverse [optional] returns the reverse strand
	     */
	
	  }, {
	    key: 'getSequence',
	    value: function getSequence(block, offset, length) {
	      var _this2 = this;
	
	      var reverse = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	      // if sequence is empty then return the empty block string
	      if (block.sequence.length === 0) {
	        return this.emptyBlockStr.substr(offset, length);
	      }
	      var cacheEntry = this.sequenceCache[block.id];
	      if (!cacheEntry) {
	        cacheEntry = this.sequenceCache[block.id] = {
	          loading: true,
	          sequence: null
	        };
	        block.getSequence().then(function (sequence) {
	          // ignore if we became disposed in the meantime
	          if (!_this2.disposed) {
	            cacheEntry.loading = false;
	            cacheEntry.sequence = sequence;
	            _this2.invalidateCacheForBlock(block);
	            _this2.render();
	          }
	        });
	      }
	      // return the sequence if we have it
	      if (cacheEntry.sequence) {
	        // return the reverse strand as requested
	        if (reverse) {
	          cacheEntry.reverseSequence = cacheEntry.reverseSequence || this.reverseStrand(cacheEntry.sequence);
	          return cacheEntry.reverseSequence.substr(offset, length);
	        }
	        // actual sequence
	        return cacheEntry.sequence.substr(offset, length);
	      }
	      // must be loading, so return '-'
	      return '-'.repeat(length);
	    }
	
	    /**
	     * return the given reverse strand for a given sequence
	     * @returns {*|string|string}
	     */
	
	  }, {
	    key: 'reverseStrand',
	    value: function reverseStrand(sequence) {
	      var reverse = '';
	      for (var i = 0; i < sequence.length; i += 1) {
	        var char = sequence[i];
	        reverse += reverseMap[char] || '?';
	      }
	      return reverse;
	    }
	  }, {
	    key: 'fabric',
	    value: function fabric() {
	      // we must be given a parent element
	      (0, _invariant2.default)(this.options.parent, 'viewer must be supplied with a parent element');
	
	      // create DOM
	
	      this.outer = (0, _dom2.default)('<div class="viewer"></div>');
	      this.options.parent.appendChild(this.outer.el);
	
	      this.rowsContainer = (0, _dom2.default)('<div class="rows"></div>');
	      this.outer.el.appendChild(this.rowsContainer.el);
	
	      this.userInterface = new _userinterface2.default({
	        viewer: this
	      });
	
	      // character metrics for string measurement
	      this.fontMetrics = (0, _charmeasure.charMeasure)();
	
	      // ensure we have current metrics
	      this.calculateSizeMetrics();
	
	      // setup initial empty data set
	      this.newDataSet();
	    }
	
	    /**
	     * reset or set the current blocks and annotations
	     * @param dataSet
	     */
	
	  }, {
	    key: 'newDataSet',
	    value: function newDataSet() {
	      var blocks = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	      var annotations = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	      var appState = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	      // rows will all change on size change so reset with a new cache
	      this.resetRowCache();
	      // state is all the application state data
	      this.appState = appState;
	      // create n fake blocks
	      this.blockList = blocks || [];
	
	      // FAKE blocks for testing
	      // let totalLength = 0;
	      // for (let i = 0; i < 500; i += 1) {
	      //   const b = new Block({
	      //     callback: this.blockLoaded.bind(this),
	      //   });
	      //   totalLength += this.blockDisplayLength(b);
	      //   this.blockList.push(b);
	      // }
	
	      // generate some fake annotations from 0..totalLength
	      this.annotationList = annotations || [];
	
	      // FAKE annotations for testing
	      // for (let j = 0; j < 500; j += 1) {
	      //   const start = Math.max(0, Math.floor(Math.random() * totalLength - 100));
	      //   const length = Math.max(4, Math.floor(Math.random() * 100));
	      //   const a = new Annotation(start, length);
	      //   this.annotationList.push(a);
	      // }
	
	      // map data to rows
	      this.mapDataSet();
	      // back to first row
	      this.firstRow = 0;
	      // clear selection
	      this.userInterface.setSelection();
	      // display total length of sequence
	      this.userInterface.statusBar.setBasePairs(this.totalSequenceLength);
	      // reset search term since blocks / annotations have changed
	      this.userInterface.statusBar.resetSearch();
	    }
	
	    /**
	     * scroll down
	     */
	
	  }, {
	    key: 'nextRow',
	    value: function nextRow() {
	      this.firstRow = Math.min(this.rowList.length - 1, this.firstRow + 1);
	    }
	
	    /**
	     * scroll up
	     */
	
	  }, {
	    key: 'previousRow',
	    value: function previousRow() {
	      this.firstRow = Math.max(0, this.firstRow - 1);
	    }
	
	    /**
	     * select a given block's range
	     */
	
	  }, {
	    key: 'selectBlock',
	    value: function selectBlock(blockId) {
	      (0, _invariant2.default)(blockId, 'block ID must be provided');
	      var block = this.blockRowMap[blockId].block;
	      (0, _invariant2.default)(block, 'block must be available ');
	      this.userInterface.setSelection({
	        block: block,
	        blockOffset: 0
	      }, {
	        block: block,
	        blockOffset: this.blockDisplayLength(block) - 1
	      });
	    }
	
	    /**
	     * select the given annotation's range
	     * @param annotationId
	     */
	
	  }, {
	    key: 'selectAnnotation',
	    value: function selectAnnotation(annotationId) {
	      (0, _invariant2.default)(annotationId, 'annotation id expected');
	      // get column / row information for the annotation
	      var info = this.annotationRowMap[annotationId];
	      // convert into block coordinates via user interface
	      var startInfo = this.userInterface.columnRowToBlockOffset(new _vector2d2.default(info.startColumn, info.startRow));
	      var endInfo = this.userInterface.columnRowToBlockOffset(new _vector2d2.default(info.endColumn, info.endRow));
	      // select the range
	      this.userInterface.setSelection(startInfo, endInfo);
	    }
	
	    /**
	     * make the first row containing row the top row
	     * @param block
	     */
	
	  }, {
	    key: 'showBlock',
	    value: function showBlock(blockId) {
	      (0, _invariant2.default)(blockId, 'block id must be supplied');
	      var info = this.blockRowMap[blockId];
	      (0, _invariant2.default)(info, 'expected a block info for the block');
	      this.firstRow = info.startRow;
	    }
	
	    /**
	     * bring the given annotation into the view
	     * @param annotationId
	     */
	
	  }, {
	    key: 'showAnnotation',
	    value: function showAnnotation(annotationId) {
	      (0, _invariant2.default)(annotationId, 'annotation id must be supplied');
	      var info = this.annotationRowMap[annotationId];
	      (0, _invariant2.default)(info, 'expected info for the annotation');
	      this.firstRow = info.startRow;
	    }
	
	    /**
	     * after a blocks full data is loaded
	     * @param block
	     */
	
	  }, {
	    key: 'blockLoaded',
	    value: function blockLoaded(block) {
	      // remove rows containing this block from the cache
	      this.invalidateCacheForBlock(block);
	      // block layout doesn't change only the content of a block, so a render is all that is required.
	      this.render();
	    }
	
	    /**
	     * update internal maps to reflect the current data set. Maps blocks to rows and columns
	     * and maps annotations to rows and columns.
	     * NOTE: mapAnnotations MUST be after mapBlocks since it requires block position information.
	     */
	
	  }, {
	    key: 'mapDataSet',
	    value: function mapDataSet() {
	      //console.time('Map Data Set');
	      this.mapBlocks();
	      this.mapAnnotations();
	      //console.timeEnd('Map Data Set');
	    }
	
	    /**
	     * invalidate the cached rows containing the given block
	     * @param block
	     */
	
	  }, {
	    key: 'invalidateCacheForBlock',
	    value: function invalidateCacheForBlock(block) {
	      if (this.blockRowMap && this.rowCache) {
	        var blockInfo = this.blockRowMap[block.id];
	        // need data set may have arrived in the mean time, so blockInfo may not be present
	        if (blockInfo) {
	          // invalid every row containing all or part of the block
	          for (var i = blockInfo.startRow; i <= blockInfo.endRow; i += 1) {
	            this.rowCache.removeElement(i);
	          }
	        }
	      }
	    }
	
	    /**
	     * return the display length for a block, which is either the length of its sequence
	     * or the length of the empty block string
	     * @param block
	     */
	
	  }, {
	    key: 'blockDisplayLength',
	    value: function blockDisplayLength(block) {
	      return block.sequence.length || this.emptyBlockStr.length;
	    }
	
	    /**
	     * map rowsContainer must be called when a block is changed. It constructs two important data structures:
	     * 1. blockRowMap A hash keyed my block.id which gives the starting row and char offset into the
	     *                the row for that block. Also, the ending row and char offset into the row for the block.
	     *                Thus for each block you get:
	     *                - block
	     *                - startRow
	     *                - startRowOffset,
	     *                - endRow,
	     *                - endRowOffset
	     *
	     * 2. rowList     For each row required, a list of record for that row. Each record gives:
	     *                -block,
	     *                -startRowOffset,
	     *                -startBlockOffset,
	     *                -length.
	     *                Each row required 1 or more record to define its content
	     */
	
	  }, {
	    key: 'mapBlocks',
	    value: function mapBlocks() {
	
	      //console.time('Map Blocks and Rows');
	      (0, _invariant2.default)(this.rowLength > 0, 'Rows must be at least one character wide');
	      // reset the two structures we are going to build
	      this.blockRowMap = {};
	      this.rowList = [];
	      // the current row we are on
	      var currentRow = 0;
	      // offset into the current row we are working on
	      var currentRowOffset = 0;
	      // index of current block we are placing
	      var currentBlockIndex = 0;
	      // current block we are placing
	      var block = void 0;
	      // offset into the current block we are placing
	      var currentBlockOffset = void 0;
	      // info structures for the current row and current block
	      var blockInfo = void 0;
	      var rowInfo = void 0;
	      // track the total length of sequences
	      this.totalSequenceLength = 0;
	      // determine how much of the current sequence we can fit into the current row
	      while (currentBlockIndex < this.blockList.length) {
	        // get the next block and setup a block info if we don't have one
	        if (!block) {
	          block = this.blockList[currentBlockIndex];
	          // track the total length of all sequences
	          this.totalSequenceLength += this.blockDisplayLength(block);
	          // create the block info that records the start/end position of this block
	          blockInfo = {
	            block: block,
	            startRow: currentRow,
	            startRowOffset: currentRowOffset,
	            endRow: -1,
	            endRowOffset: -1
	          };
	          this.blockRowMap[block.id] = blockInfo;
	          // reset offset into current block
	          currentBlockOffset = 0;
	        }
	        (0, _invariant2.default)(block && blockInfo, 'expected a block and blockInfo here');
	
	        // if we don't have information about the row then create it now
	        if (!rowInfo) {
	          rowInfo = {
	            // there must be at least one block on each row, so this isn't wasteful
	            blockRecords: [],
	            // depth of nesting of annotations, 0 means no annotations on this row.
	            annotationDepth: 0
	          };
	          this.rowList.push(rowInfo);
	        }
	
	        // length of sequence still remaining for current block
	        var blockRemaining = this.blockDisplayLength(block) - currentBlockOffset;
	        // space available in the current row
	        var rowRemaining = this.rowLength - currentRowOffset;
	        // max amount we can take from the current block
	        var fit = Math.min(blockRemaining, rowRemaining);
	        (0, _invariant2.default)(fit >= 0, 'expected to fit zero or more characters');
	
	        // if we can't fit anything then end the current row
	        if (fit === 0) {
	          currentRow += 1;
	          currentRowOffset = 0;
	          rowInfo = null;
	        } else {
	          // take fit characters from the current block and add a record to the current rowInfo
	          rowInfo.blockRecords.push({
	            block: block,
	            startRowOffset: currentRowOffset,
	            startBlockOffset: currentBlockOffset,
	            length: fit
	          });
	          // update offsets into row and block
	          currentRowOffset += fit;
	          currentBlockOffset += fit;
	          // if we have consumed the entire sequence from the current block then move to the next block
	          (0, _invariant2.default)(currentBlockOffset <= this.blockDisplayLength(block), 'currentBlockOffset should never exceed sequence in block');
	          // reach end of the current block?
	          if (currentBlockOffset === this.blockDisplayLength(block)) {
	            blockInfo.endRow = currentRow;
	            blockInfo.endRowOffset = currentRowOffset;
	            block = blockInfo = null;
	            currentBlockIndex += 1;
	            currentBlockOffset = 0;
	          }
	        }
	      }
	    }
	
	    /**
	     * map annotations to rows and columns. mapBlocks must be called first.
	     */
	
	  }, {
	    key: 'mapAnnotations',
	    value: function mapAnnotations() {
	      // maps annotation to their starting / ending column row, keyed by annotation id
	      this.annotationRowMap = {};
	      // intersect each annotation with this row
	      for (var a = 0; a < this.annotationList.length; a += 1) {
	        var annotation = this.annotationList[a];
	        // ensure we have the block, some annotations appears to not reference correctly?
	
	        // now that blocks are mapped we can correctly set the global start/end for the annotation
	        annotation.setStartEnd(this);
	        // get the first and last row this annotation spans
	        var firstRow = Math.floor(annotation.start / this.rowLength);
	        var lastRow = Math.floor(annotation.end / this.rowLength);
	
	        // record the starting / end row / column for each annotation in the a map
	        this.annotationRowMap[annotation.id] = {
	          startRow: firstRow,
	          endRow: lastRow,
	          startColumn: annotation.start % this.rowLength,
	          endColumn: annotation.end % this.rowLength
	        };
	
	        // determine the extent of the intersection with each row
	        for (var i = firstRow; i <= lastRow; i += 1) {
	          var startOfRow = i * this.rowLength;
	          // calculate the intersection with the current row
	          var rstart = Math.max(startOfRow, annotation.start);
	          var rend = Math.min(startOfRow + this.rowLength - 1, annotation.end);
	          // we expect some sort of intersection
	          (0, _invariant2.default)(rend - rstart >= 0, 'expected an intersection');
	
	          // create a record for the annotation intersection to be associated with the row
	          // ( annotations maybe outside the currently displayed rows )
	          if (i >= 0 && i < this.rowList.length) {
	            var rowInfo = this.rowList[i];
	            rowInfo.annotationRecords = rowInfo.annotationRecords || [];
	            // each record is the starting offset and ending offset into the row
	            // .depth is the depth of the annotation since several can overlap.
	            var record = {
	              annotation: annotation,
	              start: rstart - startOfRow,
	              end: rend - startOfRow,
	              depth: 0
	            };
	            while (true) {
	              // find the shallowest depth where this annotation will not intersect another annotation
	              var start = void 0,
	                  end = void 0,
	                  aRecord = void 0,
	                  intersected = false;
	              for (var k = 0; k < rowInfo.annotationRecords.length; k += 1) {
	                aRecord = rowInfo.annotationRecords[k];
	                // test for intersection if at the same depth
	                if (aRecord.depth == record.depth) {
	                  start = Math.max(aRecord.start, record.start);
	                  end = Math.min(aRecord.end, record.end);
	                  if (end - start >= 0) {
	                    // there was an intersection
	                    intersected = true;
	                    break;
	                  }
	                }
	              }
	              // if hit at this depth, try the next one
	              if (intersected) {
	                record.depth += 1;
	              } else {
	                break;
	              }
	            }
	            // update the annotation depth on the rowInfo
	            rowInfo.annotationDepth = Math.max(record.depth + 1, rowInfo.annotationDepth);
	
	            // add to the annotations records for this row
	            rowInfo.annotationRecords.push(record);
	          }
	        }
	      };
	    }
	
	    /**
	     * return the number of characters in the last row the data set. This is useful number for various
	     * UI tasks since the last row may be shorter than the other rows
	     */
	
	  }, {
	    key: 'lastRowChars',
	    value: function lastRowChars() {
	      var lastRow = this.rowList[this.rowList.length - 1];
	      var lastRecord = lastRow.blockRecords[lastRow.blockRecords.length - 1];
	      return lastRecord.startRowOffset + lastRecord.length;
	    }
	  }]);
	
	  return SequenceViewer;
	}();
	
	exports.default = SequenceViewer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout.call(null, cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout.call(null, timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout.call(null, drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = function () {
	  return new (Function.prototype.bind.apply(ElementList, [null].concat(Array.prototype.slice.call(arguments))))();
	};
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _extendableBuiltin(cls) {
	  function ExtendableBuiltin() {
	    var instance = Reflect.construct(cls, Array.from(arguments));
	    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	    return instance;
	  }
	
	  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
	    constructor: {
	      value: cls,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	
	  if (Object.setPrototypeOf) {
	    Object.setPrototypeOf(ExtendableBuiltin, cls);
	  } else {
	    ExtendableBuiltin.__proto__ = cls;
	  }
	
	  return ExtendableBuiltin;
	}
	
	/**
	 * simplest regex for identifying a tag string versus a selector string
	 * @type {RegExp}
	 */
	var tagRegex = new RegExp('<.[^(><.)]+>');
	
	/**
	 * static WeakMap used to bind arbitrary data to DOM nodes.
	 * See methods setData, getData
	 */
	var nodeMap = new WeakMap();
	
	/**
	 * the actual elements class which inherits from native Array
	 */
	
	var ElementList = function (_extendableBuiltin2) {
	  _inherits(ElementList, _extendableBuiltin2);
	
	  function ElementList() {
	    _classCallCheck(this, ElementList);
	
	    // this will be the elements we wrap
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ElementList).call(this));
	
	    var elements = [];
	    // first option is first argument is a CSS selector string and second optional element is the root element to apply the selector to.
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if ((args.length === 1 || args.length == 2) && typeof args[0] === 'string' && !tagRegex.exec(args[0])) {
	      var root = args.length === 1 ? document : _this.getNode(args[1]);
	      // return a proxy using the results of the selector as the initial array
	      elements = Array.from(root.querySelectorAll(args[0]));
	    } else {
	      // second option is that args if just a string e.g. '<div class="xyz"><p>Title</p></div>'
	      if (args.length === 1 && typeof args[0] === 'string' && tagRegex.exec(args[0])) {
	        // use a temporary DIV and insertAdjacentHTML to construct the DOM
	        var d = document.createElement('DIV');
	        d.insertAdjacentHTML('afterbegin', args[0]);
	        // setup elements to wrap
	        elements = Array.from(d.childNodes);
	        // remove all the children of the temporary div, so that the newly created top level nodes will be unparented
	        while (d.childElementCount) {
	          d.removeChild(d.firstChild);
	        }
	      } else {
	        // only remaining option is that each argument is a DOM node or possible another elements list
	        args.forEach(function (arg) {
	          if (arg instanceof ElementList) {
	            elements = elements.concat(arg);
	          } else {
	            elements.push(arg);
	          }
	        });
	        elements = args;
	      }
	    }
	    elements.forEach(function (item) {
	      return _this.push(item);
	    });
	    return _this;
	  }
	  /**
	   * apply the key/value pairs in hash to all our elements
	   */
	
	
	  _createClass(ElementList, [{
	    key: 'setStyles',
	    value: function setStyles(hash) {
	      this.forEach(function (element) {
	        if (element.nodeType === Node.ELEMENT_NODE) {
	          Object.keys(hash).forEach(function (key) {
	            element.style[key] = hash[key];
	          });
	        }
	      });
	      return this;
	    }
	    /**
	     * if the obj is a ElementList then return the first member otherwise assume
	     * the object is a node and return it.
	     */
	
	  }, {
	    key: 'getNode',
	    value: function getNode(obj) {
	      if (obj instanceof ElementList) return obj[0];
	      return obj;
	    }
	    /**
	     * if the obj is a ElementList return it, otherwise wrap the node in a ElementList
	     */
	
	  }, {
	    key: 'getNodes',
	    value: function getNodes(obj) {
	      if (obj instanceof ElementList) return obj;
	      return new ElementList(obj);
	    }
	    /**
	     * return the native el of the first element in the list
	     */
	
	  }, {
	    key: 'empty',
	
	
	    /**
	     * remove all elements from the elements in ourlist
	     */
	    value: function empty() {
	      this.forEach(function (element) {
	        while (element.firstChild) {
	          element.removeChild(element.firstChild);
	        }
	      });
	      return this;
	    }
	
	    /**
	     * append our list to the given DOM element of first member of an ElementList
	     */
	
	  }, {
	    key: 'appendTo',
	    value: function appendTo(d) {
	      var _this2 = this;
	
	      this.forEach(function (element) {
	        _this2.getNode(d).appendChild(element);
	      });
	      return this;
	    }
	    /**
	     * append the given node ( or all the nodes if d is an ElementList object )
	     * to our first element.
	     */
	
	  }, {
	    key: 'appendChild',
	    value: function appendChild(d) {
	      var _this3 = this;
	
	      if (this.length) {
	        this.getNodes(d).forEach(function (node) {
	          _this3[0].appendChild(node);
	        });
	      }
	      return this;
	    }
	    /**
	     * remove all the nodes or node from the first node in our collection
	     */
	
	  }, {
	    key: 'removeChild',
	    value: function removeChild(d) {
	      var _this4 = this;
	
	      this.forEach(function (parent) {
	        _this4.getNodes(d).forEach(function (child) {
	          parent.removeChild(child);
	        });
	      });
	      return this;
	    }
	
	    /**
	     * remove all our nodes from their parents
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.forEach(function (node) {
	        if (node.parentNode) {
	          node.parentNode.removeChild(node);
	        }
	      });
	      return this;
	    }
	
	    /**
	     * iterate every node and all their children looking for data-ref="name" attributes.
	     * Assign targetObject[name] to the matching DOM element.
	     * Commonly you import some template or HTML fragment into a class so that the member of
	     * that class can simple ref to this.name.
	     */
	
	  }, {
	    key: 'importRefs',
	    value: function importRefs(targetObject) {
	      this.forEach(function (node) {
	        var stack = [node];
	        while (stack.length) {
	          var element = stack.pop();
	          var name = element.getAttribute('data-ref');
	          if (name) {
	            targetObject[name] = new ElementList(element);
	          }
	          for (var i = 0; i < element.children.length; i += 1) {
	            stack.push(element.children[i]);
	          }
	        }
	      });
	    }
	
	    /**
	     * invoke the callback for all immediate children of all nodes in the list
	     * @param callback
	     */
	
	  }, {
	    key: 'forEachChild',
	    value: function forEachChild(callback) {
	      var _this5 = this;
	
	      this.forEach(function (node) {
	        // convert ElementList to a simple array since the callback may modify the list during the callback
	        var children = Array.prototype.slice.call(node.childNodes);
	        for (var i = 0; i < children.length; i += 1) {
	          callback.call(_this5, children[i], i);
	        }
	      });
	    }
	
	    /**
	     * add white space separated classes to our elements classList
	     */
	
	  }, {
	    key: 'addClasses',
	    value: function addClasses(classes) {
	      var _this6 = this;
	
	      classes.split(' ').filter(function (className) {
	        return className.trim().length;
	      }).forEach(function (className) {
	        _this6.forEach(function (element) {
	          element.classList.add(className);
	        });
	      });
	      return this;
	    }
	
	    /**
	     * remove white space separated class names from the classList of each node
	     * @param classes
	     * @returns {ElementList}
	     */
	
	  }, {
	    key: 'removeClasses',
	    value: function removeClasses(classes) {
	      var _this7 = this;
	
	      classes.split(' ').filter(function (className) {
	        return className.trim().length;
	      }).forEach(function (className) {
	        _this7.forEach(function (element) {
	          element.classList.remove(className);
	        });
	      });
	      return this;
	    }
	
	    /**
	     * return a new ElementList contain a deep cloned copy
	     * each node
	     */
	
	  }, {
	    key: 'clone',
	    value: function clone() {
	      return new ElementList([].concat(_toConsumableArray(this.map(function (n) {
	        return n.cloneNode(true);
	      }))));
	    }
	
	    /**
	     * set the given attribute on all nodes
	     */
	
	  }, {
	    key: 'setAttr',
	    value: function setAttr(name, value) {
	      this.forEach(function (n) {
	        return n.setAttribute(name, value);
	      });
	      return this;
	    }
	
	    /**
	     * return the attribute value.
	     * @param name
	     */
	
	  }, {
	    key: 'getAttr',
	    value: function getAttr(name) {
	      return this.map(function (n) {
	        return n.getAttribute(name);
	      });
	    }
	
	    /**
	     * The class maintains a static WeakMap hash that can be used to associated
	     * random with a DOM element.
	     */
	
	  }, {
	    key: 'setData',
	    value: function setData(value) {
	      this.forEach(function (n) {
	        return nodeMap[n] = value;
	      });
	    }
	    /**
	     * Returns the data associated with our DOM nodes. Data is returned
	     * as an array where null is used for DOM nodes with no associated data.
	     */
	
	  }, {
	    key: 'getData',
	    value: function getData() {
	      return this.map(function (n) {
	        return nodeMap[n];
	      });
	    }
	
	    /**
	     * called addEventListener for each element in the list,
	     * @param event
	     * @param handler
	     */
	
	  }, {
	    key: 'on',
	    value: function on(event, handler) {}
	
	    /**
	     * There are three ways to call off.
	     * 1. With a specific event and handler (identical to a previous call to .on)
	     * 2. With just an event name, all handlers for that event will be removeEventListener
	     * 3. With no parameters, all event handlers will be removed
	     * @param event
	     * @param handler
	     */
	
	  }, {
	    key: 'off',
	    value: function off(event, handler) {}
	  }, {
	    key: 'el',
	    get: function get() {
	      return this.length ? this[0] : null;
	    }
	  }]);
	
	  return ElementList;
	}(_extendableBuiltin(Array));
	
	;
	
	/**
	 * We export a factory function for ElementList so there is no need to the new operator
	 */
	;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * cache for elements based on user supplied keys. Cache can be configured with
	 * a time interval upon which to delete elements from the cache ( only if not present in the DOM ).
	 */
	var ElementCache = function () {
	
	  /**
	   * initialize with time to live. NOTE: An element must be expired AND not parented into the DOM
	   * to be purged from the cache.
	   * @param ttl
	   */
	  function ElementCache() {
	    var ttl = arguments.length <= 0 || arguments[0] === undefined ? 10000 : arguments[0];
	
	    _classCallCheck(this, ElementCache);
	
	    this.empty();
	    this.ttl = ttl;
	    setInterval(this.purge.bind(this), this.ttl);
	  }
	
	  /**
	   * purge elements that are not parented and have exceeded the ttl since they were last used
	   */
	
	
	  _createClass(ElementCache, [{
	    key: 'purge',
	    value: function purge() {
	      var _this = this;
	
	      var now = Date.now();
	      // find all the expired keys
	      Object.keys(this.cache).filter(function (key) {
	        var entry = _this.cache[key];
	        return !entry.element.el.parentNode && now - entry.lastReferenced >= _this.ttl;
	      }).forEach(function (key) {
	        delete _this.cache[key];
	      });
	    }
	
	    /**
	     * return the element using the given key or null if not present.
	     * If present the lastReferenced time of the resource is updated.
	     * @param key
	     */
	
	  }, {
	    key: 'getElement',
	    value: function getElement(key) {
	      var entry = this.cache[key];
	      if (entry) {
	        // update the lastReferenced time of the entry
	        entry.lastReferenced = Date.now();
	        return entry.element;
	      }
	      return null;
	    }
	
	    /**
	     * add an element to the cache and initialize its lastRefereced property to now.
	     * Overwrites any existing element with the same cache key
	     * @param key
	     */
	
	  }, {
	    key: 'addElement',
	    value: function addElement(key, element) {
	      this.cache[key] = new CacheEntry(key, element);
	    }
	
	    /**
	     * remove the given element from the cache
	     * @param key
	     */
	
	  }, {
	    key: 'removeElement',
	    value: function removeElement(key) {
	      delete this.cache[key];
	    }
	
	    /**
	     * empty the entire cache
	     */
	
	  }, {
	    key: 'empty',
	    value: function empty() {
	      this.cache = {};
	    }
	  }]);
	
	  return ElementCache;
	}();
	
	/**
	 * individual entry in the cache
	 */
	
	
	exports.default = ElementCache;
	
	var CacheEntry = function CacheEntry(key, element) {
	  _classCallCheck(this, CacheEntry);
	
	  this.key = key;
	  this.element = element;
	  this.lastReferenced = Date.now();
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * measure the width / height of characters using the exact font and styles that will be used to render
	 * the sequence. This should be called only once to obtain the size since it is costly.
	 * @returns {{w: number, h: number}}
	 */
	var charMeasure = exports.charMeasure = function charMeasure() {
	  // create a temporary div for measuring its contents
	  var textDIV = document.createElement('DIV');
	  textDIV.className = "roboto fixed font-size inline-block";
	  textDIV.style.visibility = 'hidden';
	  document.body.appendChild(textDIV);
	  // use a representative string hoping for the best average
	  var probe = 'abcdefghijklmnopqrstuvwxyz01234567890-:+';
	  textDIV.innerHTML = probe;
	  // measure the actual dimensions
	  var results = {
	    w: textDIV.clientWidth / probe.length,
	    h: textDIV.clientHeight
	  };
	  // dispose DIV once we have measured
	  document.body.removeChild(textDIV);
	  return results;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _mousetrap = __webpack_require__(8);
	
	var _mousetrap2 = _interopRequireDefault(_mousetrap);
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _box2d = __webpack_require__(14);
	
	var _box2d2 = _interopRequireDefault(_box2d);
	
	var _statusBar = __webpack_require__(15);
	
	var _statusBar2 = _interopRequireDefault(_statusBar);
	
	var _underscore = __webpack_require__(11);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Pixels from top or bottom of client where autoscrolling is triggered
	 * @type {number}
	 */
	var kAUTOSCROLL = 30;
	
	/**
	 * viewport resizes are throttled to this number of MS
	 * @type {number}
	 */
	var kRESIZE = 100;
	
	/**
	 * mouse wheel events are throttles to this interval
	 * @type {number}
	 */
	var kWHEEL = 75;
	
	var UserInterface = function () {
	  function UserInterface(options) {
	    _classCallCheck(this, UserInterface);
	
	    this.options = Object.assign({
	      viewer: null
	    }, options);
	    this.viewer = this.options.viewer;
	    (0, _invariant2.default)(this.viewer, 'viewer must be supplied to user interface');
	
	    this.layer = (0, _dom2.default)('<div class="userinterface"></div>');
	    this.viewer.outer.el.appendChild(this.layer.el);
	
	    this.statusBar = new _statusBar2.default(this.viewer);
	
	    // setup mouse interface
	    this.mouseTrap = new _mousetrap2.default({
	      element: this.layer.el,
	      mouseDown: this.mouseDown.bind(this),
	      mouseUp: this.mouseUp.bind(this),
	      mouseMove: this.mouseMove.bind(this),
	      mouseDrag: this.mouseDrag.bind(this),
	      mouseLeave: this.mouseLeave.bind(this),
	      mouseWheel: _underscore2.default.throttle(this.mouseWheel.bind(this), kWHEEL, { trailing: false }),
	      doubleClick: this.doubleClick.bind(this)
	    });
	
	    // resize requires an update
	    window.addEventListener('resize', this.resizeHandler = _underscore2.default.throttle(this.onResize.bind(this), kRESIZE));
	
	    // // toggle reverse strand
	    // document.getElementById('toggleReverseStrand').addEventListener('click', () => {
	    //   this.viewer.showReverseStrand(!this.viewer.showReverseStrand());
	    //   this.viewer.mapDataSet();
	    //   this.viewer.render();
	    // });
	    //
	    // document.getElementById('firstRow').addEventListener('click', () => {
	    //   this.viewer.firstRow = 0;
	    //   this.viewer.render();
	    // });
	    //
	    // document.getElementById('lastRow').addEventListener('click', () => {
	    //   this.viewer.firstRow = this.viewer.rowList.length - 1;
	    //   this.viewer.render();
	    // });
	  }
	
	  /**
	   * cleanup
	   */
	
	
	  _createClass(UserInterface, [{
	    key: 'dispose',
	    value: function dispose() {
	      (0, _invariant2.default)(!this.disposed, 'Already disposed');
	      this.disposed = true;
	      window.removeEventListener('resize', this.resizeHandler);
	      this.mouseTrap.dispose();
	    }
	    /**
	     * throttled window resize
	     */
	
	  }, {
	    key: 'onResize',
	    value: function onResize() {
	      (0, _invariant2.default)(!this.viewer.disposed, 'viewer has been disposed');
	      this.viewer.resized();
	    }
	
	    /**
	     * Select annotation if directly clicked or range of clicked annotation
	     * @param event
	     * @param localPosition
	     */
	
	  }, {
	    key: 'doubleClick',
	    value: function doubleClick(event, local) {
	
	      var info = this.localToRowDetails(local);
	      if (info) {
	        switch (info.location) {
	
	          case 'annotation':
	            this.viewer.selectAnnotation(info.annotation.id);
	            break;
	
	          case 'block':
	            this.viewer.selectBlock(info.blockInfo.block.id);
	            break;
	
	          default:
	            this.setSelection();
	        }
	      } else {
	        this.setSelection();
	      }
	      this.viewer.render();
	    }
	
	    /**
	     * mouse wheel handler
	     * @param event
	     */
	
	  }, {
	    key: 'mouseWheel',
	    value: function mouseWheel(event, localPosition, normalized) {
	      // ignore if no y component
	      if (normalized.spinY === 0) {
	        return;
	      }
	      // save current firstRow so we can determine if anything changed
	      var firstRow = this.viewer.firstRow;
	      // spinY is a float 0..n
	      for (var i = 0; i <= Math.abs(normalized.spinY); i += 1) {
	        if (normalized.spinY < 0) {
	          this.viewer.previousRow();
	        } else {
	          this.viewer.nextRow();
	        }
	      }
	      // if anything changed update
	      if (this.viewer.firstRow !== firstRow) {
	        // pass wheel event through to mouse move
	        this.mouseMove(event, localPosition);
	        // redraw
	        this.viewer.render();
	      }
	    }
	
	    /**
	     * cancel autoscroll if running
	     */
	
	  }, {
	    key: 'stopAutoScroll',
	    value: function stopAutoScroll() {
	      window.clearTimeout(this.autoScrollId);
	      this.autoScrollId = null;
	    }
	
	    /**
	     * mouse down handler from mouse trap.
	     * @param event
	     * @param local
	     */
	
	  }, {
	    key: 'mouseDown',
	    value: function mouseDown(event, local) {
	      this.cursor = null;
	      var bo = this.localToBlockOffset(local);
	      if (bo) {
	        this.anchor = bo;
	        this.localMousePreviousDrag = local;
	        this.setSelection(bo);
	        this.stopAutoScroll();
	      } else {
	        this.setSelection();
	      }
	      this.render();
	    }
	
	    /**
	     * cancal auto scroll when mouse released
	     * @param event
	     * @param local
	     */
	
	  }, {
	    key: 'mouseUp',
	    value: function mouseUp(event, local) {
	      this.stopAutoScroll();
	    }
	
	    /**
	     * autoscroll up or down according to location of mouse.
	     */
	
	  }, {
	    key: 'autoScroll',
	    value: function autoScroll() {
	      var b = this.layer.el.getBoundingClientRect();
	      if (this.localMousePreviousDrag.y < kAUTOSCROLL) {
	        this.viewer.previousRow();
	        this.mouseDrag(null, this.localMousePreviousDrag);
	      } else {
	        if (this.localMousePreviousDrag.y >= b.bottom - b.top - kAUTOSCROLL) {
	          this.viewer.nextRow();
	          this.mouseDrag(null, this.localMousePreviousDrag);
	        }
	      }
	    }
	
	    /**
	     * update selection as user drags
	     */
	
	  }, {
	    key: 'mouseDrag',
	    value: function mouseDrag(event, local) {
	      if (this.selection) {
	        this.localMousePreviousDrag = local;
	        var bo = this.localToBlockOffset(local);
	        if (bo) {
	          this.setSelection(this.anchor, bo);
	        }
	        // start auto scroll if not already
	        if (!this.autoScrollId) {
	          this.autoScrollId = window.setInterval(this.autoScroll.bind(this), 100);
	        }
	      }
	      this.viewer.render();
	    }
	
	    /**
	     * mouse move, which should only occur if not dragging ( selecting )
	     */
	
	  }, {
	    key: 'mouseMove',
	    value: function mouseMove(event, local) {
	      // the cursor is stored in client area column/row
	      var v = this.localToColumnRow(local);
	      if (!v) {
	        this.cursor = null;
	      } else {
	        this.cursor = v.sub(new _vector2d2.default(0, this.viewer.firstRow));
	      }
	      this.clampCursor();
	      this.renderCursor();
	    }
	
	    /**
	     * hide cursor on mouse leave
	     */
	
	  }, {
	    key: 'mouseLeave',
	    value: function mouseLeave() {
	      this.hideCursor();
	    }
	
	    /**
	     * hide the cursor
	     */
	
	  }, {
	    key: 'hideCursor',
	    value: function hideCursor() {
	      this.cursor = null;
	      this.renderCursor();
	    }
	
	    /**
	     * ensure the current cursor position is still within the data range
	     */
	
	  }, {
	    key: 'clampCursor',
	    value: function clampCursor() {
	      if (this.cursor) {
	        var clientTop = new _vector2d2.default(0, this.viewer.firstRow);
	        var blockOffset = this.columnRowToBlockOffset(this.cursor.add(clientTop));
	        if (!blockOffset) {
	          // clamp to last character of last block
	          var block = this.viewer.blockList[this.viewer.blockList.length - 1];
	          blockOffset = {
	            block: block,
	            blockOffset: this.viewer.blockDisplayLength(block) - 1
	          };
	          this.cursor = this.blockOffsetToColumnRow(blockOffset).sub(clientTop);
	        }
	      }
	    }
	
	    /**
	     * Takes a local coordinates and returns as a column/row vector
	     * @param vector
	     */
	
	  }, {
	    key: 'localToColumnRow',
	    value: function localToColumnRow(vector) {
	
	      // get and test row first
	      var row = this.viewer.getRowIndexFromY(vector.y);
	      if (row < 0) {
	        return null;
	      }
	      // get and test column
	      var column = this.viewer.getColumnIndexFromX(vector.x, row);
	      if (column < 0) {
	        return null;
	      }
	      // both are within the data set
	      return new _vector2d2.default(column, row);
	    }
	
	    /**
	     * get detailed information about the column / row clicked and what exactly is
	     * at the location. Used for operation like double click where we need to know
	     * if the user clicked an annotation or the block.
	     * Returns:
	     * If the point is within a column and row we return
	     * {
	     *  row: number,
	     *  column: number,
	     *  location: one of ['sequence', 'separator', 'reverse', 'block', 'annotation', 'ruler']
	     *  block: if location === 'block' this is the blockInfo
	     *  annotation: if location === 'annotation' this is the annotationInfo
	     * }
	     *
	     * @param vector
	     */
	
	  }, {
	    key: 'localToRowDetails',
	    value: function localToRowDetails(vector) {
	      var _this = this;
	
	      var columnRow = this.localToColumnRow(vector);
	      var info = null;
	      if (columnRow) {
	        (function () {
	          // initialize info with column and row
	          info = { column: columnRow.x, row: columnRow.y };
	          // location is valid, figure out where the user clicked.
	          var box = _this.viewer.getRowBounds(columnRow.y);
	          // click was within the sequence row?
	          if (vector.y < box.y + _this.viewer.getCharHeight()) {
	            info.location = 'sequence';
	          }
	          // click was within separator row?
	          if (!info.location && vector.y < box.y + _this.viewer.getCharHeight() * 2) {
	            info.location = 'separator';
	          }
	          // reverse strand if present
	          if (!info.location && _this.viewer.options.reverse && vector.y < box.y + _this.viewer.getCharHeight() * 3) {
	            info.location = 'reverse';
	          }
	          // block?
	          var yOffset = _this.viewer.options.reverse ? _this.viewer.getCharHeight() * 4 : _this.viewer.getCharHeight() * 3;
	          if (!info.location && vector.y < box.y + yOffset) {
	            info.location = 'block';
	            info.blockInfo = _this.columnRowToBlockOffset(columnRow);
	          }
	          // one of the annotations?
	          if (!info.location) {
	            (function () {
	              // get first row for annotations
	              var startRow = _this.viewer.options.reverse ? 4 : 3;
	              // search for an annotation containing the x/y position
	              var rowInfo = _this.viewer.rowList[columnRow.y];
	              if (rowInfo.annotationRecords) {
	                var aRecord = rowInfo.annotationRecords.find(function (aRecord) {
	                  var aBox = new _box2d2.default(aRecord.start * _this.viewer.getCharWidth(), (startRow + aRecord.depth) * _this.viewer.getCharHeight(), (aRecord.end - aRecord.start) * _this.viewer.getCharWidth(), _this.viewer.getCharHeight());
	                  return aBox.pointInBox(new _vector2d2.default(vector.x, vector.y - box.y));
	                });
	                // did we hit an annotation ?
	                if (aRecord) {
	                  info.location = 'annotation';
	                  info.annotation = aRecord.annotation;
	                }
	              }
	            })();
	          }
	          // test for ruler, which is below everything else
	          if (!info.location) {
	            // take into account depth of annotation nested an 1/2 char vertical padding before ruler
	            var aDepth = _this.viewer.rowList[columnRow.y].annotationDepth + 0.5;
	            var _yOffset = (aDepth + (_this.viewer.options.reverse ? 4 : 3)) * _this.viewer.getCharHeight();
	            if (!info.location && vector.y >= box.y + _yOffset) {
	              info.location = 'ruler';
	            }
	          }
	        })();
	      }
	      return info;
	    }
	
	    /**
	     * return the block and offset into the block denoted by the given
	     * column/row vector
	     * @param vector
	     */
	
	  }, {
	    key: 'columnRowToBlockOffset',
	    value: function columnRowToBlockOffset(vector) {
	      // get all the records for the row
	      var rowInfo = this.viewer.rowList[vector.y];
	      // out of bounds
	      if (!rowInfo) {
	        return null;
	      }
	      // iterate through row records to find the answer
	      var offset = 0;
	      for (var i = 0; i < rowInfo.blockRecords.length; i += 1) {
	        var info = rowInfo.blockRecords[i];
	        if (vector.x < offset + info.length) {
	          // falls within this block
	          return {
	            block: info.block,
	            blockOffset: vector.x - offset + info.startBlockOffset
	          };
	        } else {
	          offset += info.length;
	        }
	      }
	      // if here the user clicked beyond the end of the last block
	      return null;
	    }
	
	    /**
	     * convert a block and block offset into a column and row i.e. takes the output of columnToBlockOffset
	     * and converts it back to a column/row vector
	     * @param info
	     */
	
	  }, {
	    key: 'blockOffsetToColumnRow',
	    value: function blockOffsetToColumnRow(info) {
	      // get the starting / end row and column for the block
	      var blockInfo = this.viewer.blockRowMap[info.block.id];
	      var row = blockInfo.startRow + ((blockInfo.startRowOffset + info.blockOffset) / this.viewer.rowLength >> 0);
	      var col = (blockInfo.startRowOffset + info.blockOffset) % this.viewer.rowLength;
	      return new _vector2d2.default(col, row);
	    }
	
	    /**
	     * convert local mouse coordinates directly into block/blockOffset with clamping as requested by user
	     * @param local
	     * @returns {boolean}
	     */
	
	  }, {
	    key: 'localToBlockOffset',
	    value: function localToBlockOffset(local) {
	      var v = this.localToColumnRow(local);
	      return v ? this.columnRowToBlockOffset(v) : null;
	    }
	
	    /**
	     * render all user interface components
	     */
	
	  }, {
	    key: 'render',
	    value: function render() {
	      //console.time('Render UI');
	      this.renderCursor();
	      this.renderSelection();
	      //console.timeEnd('Render UI')
	    }
	
	    /**
	     * render the cursor
	     */
	
	  }, {
	    key: 'renderCursor',
	    value: function renderCursor() {
	      // cursor is defined by block and offset
	      if (this.cursor) {
	        // create DOM as necessary and update
	        if (!this.cursorEl) {
	          this.cursorEl = (0, _dom2.default)('<div class="cursor"></div>');
	          this.layer.appendChild(this.cursorEl);
	        }
	        var box = this.viewer.getRowBounds(this.cursor.y + this.viewer.firstRow);
	        this.cursorEl.setStyles({
	          left: this.viewer.getCharWidth() * this.cursor.x + 'px',
	          top: box.y + 'px',
	          width: this.viewer.getCharWidth() + 'px',
	          height: box.height - this.viewer.getCharHeight() * 3.5 + 'px'
	        });
	        this.statusBar.setPosition((this.cursor.y + this.viewer.firstRow) * this.viewer.rowLength + this.cursor.x);
	      } else {
	        // no cursor defined remove DOM if present
	        if (this.cursorEl) {
	          this.cursorEl.remove();
	          this.cursorEl = null;
	          this.statusBar.setPosition();
	        }
	      }
	    }
	
	    /**
	     * render the current selection into the viewers DOM
	     */
	
	  }, {
	    key: 'renderSelection',
	    value: function renderSelection() {
	      // remove existing selection elements
	      if (this.selectionElements) {
	        this.selectionElements.forEach(function (el) {
	          el.remove();
	        });
	        this.selectionElements = null;
	      }
	      if (this.selection) {
	        // only display selection body if there is a range
	        if (this.selection.columnRowEnd) {
	          // get the range of the selection and clamp to the current bounds of the client area
	          var viewerFirstRow = this.viewer.firstRow;
	          var viewerLastRow = this.viewer.firstRow + this.viewer.rowsVisible();
	          var start = Math.max(this.selection.columnRowStart.y, viewerFirstRow);
	          var end = Math.min(this.selection.columnRowEnd.y, viewerLastRow);
	          // if any of the range is visible then display it
	          for (var i = start; i <= end; i += 1) {
	            var el = (0, _dom2.default)('<div class="selection-box"></div>');
	            var box = this.viewer.getRowBounds(i);
	            // ignore if row not visible
	            if (!box.isEmpty()) {
	              // adjust box if this is the first row and add left border class
	              if (i === this.selection.columnRowStart.y) {
	                box.x = this.selection.columnRowStart.x * this.viewer.getCharWidth();
	                box.w = (this.viewer.rowLength - this.selection.columnRowStart.x) * this.viewer.getCharWidth();
	                el.addClasses('left-edge');
	              }
	              // adjust box again if this is the last row and add right edge css class
	              if (i === this.selection.columnRowEnd.y) {
	                box.w -= (this.viewer.rowLength - this.selection.columnRowEnd.x - 1) * this.viewer.getCharWidth();
	                el.addClasses('right-edge');
	              }
	              el.setStyles({
	                left: box.x + 'px',
	                top: box.y + 'px',
	                width: box.w + 'px',
	                height: box.h - this.viewer.getCharHeight() * 3.5 + 'px'
	              });
	              // add to list of selection elements and add to the DOM
	              this.selectionElements = this.selectionElements || [];
	              this.selectionElements.push(el);
	              this.layer.appendChild(el);
	            }
	          }
	        }
	      }
	    }
	
	    /**
	     * compare two block offset for equality
	     * @param bo1
	     * @param bo2
	     */
	
	  }, {
	    key: 'blockOffsetEqual',
	    value: function blockOffsetEqual(bo1, bo2) {
	      // both false, equal
	      if (!bo1 && !bo2) {
	        return true;
	      }
	      // one is false, other is true
	      if (!!bo1 !== !!bo2) {
	        return false;
	      }
	      return bo1.block.id === bo2.block.id && bo1.blockOffset === bo2.blockOffset;
	    }
	
	    /**
	     * set the range of the current selection. All parameters are optional.
	     * If no parameters are provided the selection is reset.
	     * If only the start is given the selection is just a location, if both are provided
	     * it defines a range.
	     * @param blockOffsetStart
	     * @param blockOffsetEnd
	     */
	
	  }, {
	    key: 'setSelection',
	    value: function setSelection(blockOffsetStart, blockOffsetEnd) {
	
	      // reset if no selection given
	      if (!blockOffsetStart && !blockOffsetEnd) {
	        this.selection = null;
	      } else {
	        (0, _invariant2.default)(blockOffsetStart, 'start must be defined unless resetting the selection');
	        // start to column/row
	        var columnRowStart = this.blockOffsetToColumnRow(blockOffsetStart);
	        // define start point if only start given
	        if (!blockOffsetEnd) {
	          this.selection = {
	            blockOffsetStart: blockOffsetStart,
	            columnRowStart: columnRowStart
	          };
	        } else {
	          // calculate the column/row vector for the selection and normalize to ensure start <= end
	          var columnRowEnd = this.blockOffsetToColumnRow(blockOffsetEnd);
	          if (columnRowStart.y < columnRowEnd.y || columnRowStart.y === columnRowEnd.y && columnRowStart.x <= columnRowEnd.x) {
	            // start is already <= end
	            this.selection = {
	              blockOffsetStart: blockOffsetStart,
	              blockOffsetEnd: blockOffsetEnd,
	              columnRowStart: columnRowStart,
	              columnRowEnd: columnRowEnd
	            };
	          } else {
	            // swap start and end
	            this.selection = {
	              blockOffsetStart: blockOffsetEnd,
	              blockOffsetEnd: blockOffsetStart,
	              columnRowStart: columnRowEnd,
	              columnRowEnd: columnRowStart
	            };
	          }
	        }
	      }
	      // update status bar with selection
	      if (this.selection && this.selection.columnRowStart) {
	        this.statusBar.setStart(this.selection.columnRowStart.y * this.viewer.rowLength + this.selection.columnRowStart.x);
	      } else {
	        this.statusBar.setStart();
	      }
	      if (this.selection && this.selection.columnRowEnd) {
	        this.statusBar.setEnd(this.selection.columnRowEnd.y * this.viewer.rowLength + this.selection.columnRowEnd.x);
	      } else {
	        this.statusBar.setEnd();
	      }
	    }
	
	    /**
	     * set selection from columnRow vectors versus blocks
	     */
	
	  }, {
	    key: 'setSelectionFromColumnRow',
	    value: function setSelectionFromColumnRow(start, end) {
	      this.setSelection(this.columnRowToBlockOffset(start), this.columnRowToBlockOffset(end));
	    }
	
	    /**
	     * called when the size is changed to reset our selection
	     */
	
	  }, {
	    key: 'updateSelection',
	    value: function updateSelection() {
	      this.setSelection(this.selection ? this.selection.blockOffsetStart : null, this.selection ? this.selection.blockOffsetEnd : null);
	    }
	  }]);
	
	  return UserInterface;
	}();
	
	exports.default = UserInterface;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * mouse wheel constants
	 */
	var PIXEL_STEP = 10;
	var LINE_HEIGHT = 40;
	var PAGE_HEIGHT = 800;
	
	/**
	 * MS and pixel thresholds to register a double click
	 */
	var doubleClickTimeThreshold = 500;
	var doubleClickSpatialThreshold = 4;
	/**
	 * handle mousedown,mousemove,mouseup events for the given element including
	 * converting to local coordinates and capturing the mouse on the document.body
	 * during a drag.
	 * Callbacks which should exist are:
	 * mouseTrapDown(client point, event)
	 * mouseTrapMove(client point, event)
	 * mouseTrapUp(client point, event)
	 * mouseTrapDrag(client point, event) - which is a mousemove with the button held down
	 *
	 * A drag can be cancelled at anytime by calling cancelDrag on this instance.
	 * Call dispose to end all mouse captures. Do not use the instance after this.
	 */
	
	var MouseTrap = function () {
	
	  /**
	   * owner is any object that will get the callbacks. Element is
	   * the target element you want the events on.
	   */
	  function MouseTrap(options) {
	    _classCallCheck(this, MouseTrap);
	
	    // save our options, which at the very least must contain the targeted element.
	    // Options are:
	    //
	    // element: HTMLElement - the element which we listen to
	    // mouseEnter: Function - callback for mouseenter event (event)
	    // mouseLeave: Function - callback for mouseleave event (event)
	    // mouseDown: Function - callback for mousedown event (point, event)
	    // mouseMove: Function - callback for mousemove event (point, event)
	    // mouseDrag: Function - callback for mousemove with button held down event (point, event)
	    // mouseUp: Function - callback for mouseup event (point, event) only when mousedown preceeded.
	    // mouseWheel: Function - callback for normalized mouse wheel events. (event, normalized data)
	    // doubleClick: Function - callback for double click with left button
	    this.options = Object.assign({}, options);
	    (0, _invariant2.default)(this.options.element, 'options must contain an element');
	    this.element = options.element;
	
	    // create bound versions of the listener which we can remove as well as add
	    this.mouseEnter = this.onMouseEnter.bind(this);
	    this.mouseLeave = this.onMouseLeave.bind(this);
	    this.mouseDown = this.onMouseDown.bind(this);
	    this.mouseMove = this.onMouseMove.bind(this);
	    this.mouseDrag = this.onMouseDrag.bind(this);
	    this.mouseUp = this.onMouseUp.bind(this);
	    this.mouseWheel = this.onMouseWheel.bind(this);
	
	    // mouse enter/leave are always running
	    this.element.addEventListener('mouseenter', this.mouseEnter);
	    this.element.addEventListener('mouseleave', this.mouseLeave);
	    // sink the mousedown, later dynamically add the move/up handlers
	    this.element.addEventListener('mousedown', this.mouseDown);
	    // for normal mouse move with no button we track via the target element itself
	    this.element.addEventListener('mousemove', this.mouseMove);
	    // mouse wheel events
	    this.element.addEventListener('wheel', this.mouseWheel);
	  }
	
	  /**
	   * mouse enter/leave handlers
	   */
	
	
	  _createClass(MouseTrap, [{
	    key: 'onMouseEnter',
	    value: function onMouseEnter(event) {
	      this.callback('mouseEnter', event);
	    }
	  }, {
	    key: 'onMouseLeave',
	    value: function onMouseLeave(event) {
	      this.callback('mouseLeave', event);
	    }
	
	    /**
	     * mouse down handler, invoked on our target element
	     */
	
	  }, {
	    key: 'onMouseDown',
	    value: function onMouseDown(event) {
	      // whenever our element gets a mouse down ( any button ) ensure any inputs are unfocused
	      if (document.activeElement && document.activeElement.tagName && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
	        document.activeElement.blur();
	      }
	
	      // left button only
	      if (event.which !== 1) {
	        return;
	      }
	      (0, _invariant2.default)(!this.dragging, 'mousetrap is already in drag mode');
	
	      // get local position and record the starting position and setup move/up handlers on the mouseLayer
	      var localPosition = this.eventToLocal(event);
	      var time = Date.now();
	
	      // check for a double click before starting a drag
	      if (this.lastLeftClick && this.lastLeftClick.sub(localPosition).len() <= doubleClickSpatialThreshold && time - this.lastLeftClickTime <= doubleClickTimeThreshold) {
	        this.lastLeftClick = null;
	        this.callback('doubleClick', event, localPosition);
	        return;
	      }
	      // remember this click, it may be the first click of a double click
	      this.lastLeftClick = localPosition;
	      this.lastLeftClickTime = time;
	
	      this.mouseLayer = (0, _dom2.default)('<div class="sv-mouseLayer"></div>');
	      this.mouseLayer.appendTo(document.body);
	
	      // start a drag
	      this.dragging = {
	        mouseLayer: this.mouseLayer.el,
	        startPosition: localPosition
	      };
	      this.mouseLayer.el.addEventListener('mousemove', this.mouseDrag);
	      this.mouseLayer.el.addEventListener('mouseup', this.mouseUp);
	
	      // invoke optional callback
	      this.callback('mouseDown', event, localPosition);
	    }
	
	    /**
	     * mousemove event
	     */
	
	  }, {
	    key: 'onMouseMove',
	    value: function onMouseMove(event) {
	      var localPosition = this.eventToLocal(event);
	      this.callback('mouseMove', event, localPosition);
	    }
	
	    /**
	     * mousemove event binding during a drag operation
	     */
	
	  }, {
	    key: 'onMouseDrag',
	    value: function onMouseDrag(event) {
	      if (event.target === this.mouseLayer.el) {
	        (0, _invariant2.default)(this.dragging, 'only expect mouse moves during a drag');
	        // send the mouse move, then check for the begin of a drag
	        var localPosition = this.eventToLocal(event);
	        var distance = localPosition.sub(this.dragging.startPosition).len();
	        // invoke optional callback
	        this.callback('mouseDrag', event, localPosition, this.dragging.startPosition, distance);
	      }
	    }
	
	    /**
	     * mouseup handler
	     */
	
	  }, {
	    key: 'onMouseUp',
	    value: function onMouseUp(event) {
	      // left drag only
	      if (event.which !== 1 || event.target !== this.mouseLayer.el) {
	        return;
	      }
	      (0, _invariant2.default)(this.dragging, 'only expect mouse up during a drag');
	      var localPosition = this.eventToLocal(event);
	      this.cancelDrag();
	      this.callback('mouseUp', event, localPosition);
	    }
	
	    /**
	     * cancel a drag track in progress
	     * @return {[type]} [description]
	     */
	
	  }, {
	    key: 'cancelDrag',
	    value: function cancelDrag() {
	      if (this.dragging) {
	        var e = this.mouseLayer.el;
	        e.removeEventListener('mousemove', this.mouseDrag);
	        e.removeEventListener('mouseup', this.mouseUp);
	        e.parentElement.removeChild(e);
	        this.mouseLayer = null;
	        this.dragging = null;
	      }
	    }
	
	    /**
	     * mouse wheel handler
	     * @param event
	     */
	
	  }, {
	    key: 'onMouseWheel',
	    value: function onMouseWheel(event) {
	      var localPosition = this.eventToLocal(event);
	      this.callback('mouseWheel', event, localPosition, this.normalizeWheel(event));
	    }
	
	    /**
	     * a nice try at normalizing wheel events. Provided by our friends at Facebook:
	     * https://github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
	     * @param event
	     * @returns {{spinX: number, spinY: number, pixelX: number, pixelY: number}}
	     */
	
	  }, {
	    key: 'normalizeWheel',
	    value: function normalizeWheel(event) {
	      var sX = 0,
	          sY = 0,
	          // spinX, spinY
	      pX = 0,
	          pY = 0; // pixelX, pixelY
	
	      // Legacy
	      if ('detail' in event) {
	        sY = event.detail;
	      }
	      if ('wheelDelta' in event) {
	        sY = -event.wheelDelta / 120;
	      }
	      if ('wheelDeltaY' in event) {
	        sY = -event.wheelDeltaY / 120;
	      }
	      if ('wheelDeltaX' in event) {
	        sX = -event.wheelDeltaX / 120;
	      }
	
	      // side scrolling on FF with DOMMouseScroll
	      if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
	        sX = sY;
	        sY = 0;
	      }
	
	      pX = sX * PIXEL_STEP;
	      pY = sY * PIXEL_STEP;
	
	      if ('deltaY' in event) {
	        pY = event.deltaY;
	      }
	      if ('deltaX' in event) {
	        pX = event.deltaX;
	      }
	
	      if ((pX || pY) && event.deltaMode) {
	        if (event.deltaMode == 1) {
	          // delta in LINE units
	          pX *= LINE_HEIGHT;
	          pY *= LINE_HEIGHT;
	        } else {
	          // delta in PAGE units
	          pX *= PAGE_HEIGHT;
	          pY *= PAGE_HEIGHT;
	        }
	      }
	
	      // Fall-back if spin cannot be determined
	      if (pX && !sX) {
	        sX = pX < 1 ? -1 : 1;
	      }
	      if (pY && !sY) {
	        sY = pY < 1 ? -1 : 1;
	      }
	
	      return { spinX: sX,
	        spinY: sY,
	        pixelX: pX,
	        pixelY: pY };
	    }
	
	    /**
	     * if given, invoke one of the named optional callbacks with a clone of the local point
	     */
	
	  }, {
	    key: 'callback',
	    value: function callback(eventName, event) {
	      if (this.options[eventName]) {
	        // if the client wants a callback preventDefault
	        event.preventDefault();
	        // slice the event name off the arguments but forward everything else
	        var args = Array.prototype.slice.call(arguments, 1);
	        this.options[eventName].apply(this, args);
	      }
	    }
	
	    /**
	     * cleanup all event listeners. Instance cannot be used after this.
	     */
	
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      this.element.removeEventListener('mouseenter', this.mouseEnter);
	      this.element.removeEventListener('mouseleave', this.mouseLeave);
	      this.element.removeEventListener('mousedown', this.mouseDown);
	      this.element.removeEventListener('mousemove', this.mouseMove);
	      this.element.removeEventListener('wheel', this.mouseWheel);
	      this.cancelDrag();
	      this.dragging = this.element = this.owner = null;
	    }
	
	    /**
	     * the target of the event is expected to be our element or one of its children
	     * @param node
	     * @param point
	     */
	
	  }, {
	    key: 'eventToDocument',
	    value: function eventToDocument(event) {
	      // only workds on newer browsers with pageX/pageY
	      (0, _invariant2.default)(event.pageX !== undefined, 'event must support pageX/Y');
	      return new _vector2d2.default(event.pageX + this.element.scrollLeft - document.body.scrollLeft, event.pageY + this.element.scrollTop - document.body.scrollTop);
	    }
	
	    /**
	     * event relative to our element
	     * @param event
	     */
	
	  }, {
	    key: 'eventToLocal',
	    value: function eventToLocal(event) {
	      var b = this.element.getBoundingClientRect();
	      var p = this.eventToDocument(event);
	      return new _vector2d2.default(p.x - b.left, p.y - b.top);
	    }
	  }]);
	
	  return MouseTrap;
	}();
	
	exports.default = MouseTrap;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _utils = __webpack_require__(10);
	
	var _line2d = __webpack_require__(12);
	
	var _line2d2 = _interopRequireDefault(_line2d);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * a 2D Vector/Point
	 */
	var Vector2D = function () {
	  /**
	   * @constructor
	   * @param {Number} x
	   * @param {Number} y
	   */
	  function Vector2D() {
	    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	    _classCallCheck(this, Vector2D);
	
	    (0, _invariant2.default)((0, _utils.isRealNumber)(x) && (0, _utils.isRealNumber)(y), 'Bad parameters');
	    this._v = [x, y];
	  }
	
	  _createClass(Vector2D, [{
	    key: 'toObject',
	
	
	    /**
	     * comma separated string representation
	     * @returns {String}
	     */
	    value: function toObject() {
	      return this.x + ',' + this.y;
	    }
	
	    /**
	     * reverse of toObject, but a static member that constructs a new instance
	     */
	
	  }, {
	    key: 'toString',
	
	
	    /**
	     * string out
	     */
	    value: function toString() {
	      return 'v2d(' + this.x + ', ' + this.y + ')';
	    }
	
	    /**
	     * return a copy of ourselves
	     * @returns {Vector2D}
	     */
	
	  }, {
	    key: 'clone',
	    value: function clone() {
	      return new Vector2D(this.x, this.y);
	    }
	
	    /**
	     * return a new vector rounded to the nearest k integer
	     * @param {Number} grid [description]
	     * @return {Vector2D}   [description]
	     */
	
	  }, {
	    key: 'snap',
	    value: function snap(grid) {
	      return new Vector2D(Math.floor(this.x / grid) * grid, Math.floor(this.y / grid) * grid);
	    }
	
	    /**
	     * Point on circumference of circle
	     * @param {Number} xc
	     * @param {Number} yc
	     * @param {Number} radius
	     * @param {Number} degrees
	     */
	
	  }, {
	    key: 'angleBetween',
	
	
	    /**
	     * angle in degrees between two vectors
	     * @param {Number} other
	     */
	    value: function angleBetween(other) {
	      var rads = Math.atan2(other.y - this.y, other.x - this.x);
	
	      // atan2 return negative PI radians for the 180-360 degrees ( 9 o'clock to 3 o'clock )
	      if (rads < 0) {
	        rads = 2 * Math.PI + rads;
	      }
	
	      return (0, _utils.rad2deg)(rads);
	    }
	
	    /**
	     * add another vector
	     * @param {Vector2D} vector
	     * @returns {Vector2D}
	     */
	
	  }, {
	    key: 'add',
	    value: function add(vector) {
	      return new Vector2D(this.x + vector.x, this.y + vector.y);
	    }
	
	    /**
	     * subtract another vector
	     * @param {Vector2D} vector
	     * @returns {Vector2D}
	     */
	
	  }, {
	    key: 'sub',
	    value: function sub(vector) {
	      return new Vector2D(this.x - vector.x, this.y - vector.y);
	    }
	
	    /**
	     * multiply vector by coeffecient or another vector
	     * @param {Number|Vector2D} multiplier
	     * @returns {Vector2D | Number}
	     */
	
	  }, {
	    key: 'multiply',
	    value: function multiply(multiplier) {
	      return (0, _utils.isRealNumber)(multiplier) ? new Vector2D(this.x * multiplier, this.y * multiplier) : new Vector2D(this.x * multiplier.x, this.y * multiplier.y);
	    }
	
	    /**
	     * scale is an alias for multiply
	     */
	
	  }, {
	    key: 'scale',
	    value: function scale(multiplier) {
	      return this.multiply(multiplier);
	    }
	
	    /**
	     * divide vector by a constant
	     * @param {Number} divisor
	     * @returns {Vector2D}
	     */
	
	  }, {
	    key: 'divide',
	    value: function divide(divisor) {
	      return new Vector2D(this.x / divisor, this.y / divisor);
	    }
	
	    /**
	     * length of vector
	     * @returns {number}
	     */
	
	  }, {
	    key: 'len',
	    value: function len() {
	      return Math.sqrt(this.x * this.x + this.y * this.y);
	    }
	
	    /**
	     * distance between two points
	     * @param {vector} other [description]
	     * @return {Number}       [description]
	     */
	
	  }, {
	    key: 'distance',
	    value: function distance(other) {
	      return new _line2d2.default(this, other).len();
	    }
	
	    /**
	     * dot product
	     * @param {vector} other
	     * @returns Vector2D
	     */
	
	  }, {
	    key: 'dot',
	    value: function dot(other) {
	      return this.x * other.x + this.y * other.y;
	    }
	
	    /**
	     * return if within a certain threshold of proximity
	     * @param {vector} other     [description]
	     * @param {Number} threshold [description]
	     * @return {boolean}           [description]
	     */
	
	  }, {
	    key: 'similar',
	    value: function similar(other) {
	      var threshold = arguments.length <= 1 || arguments[1] === undefined ? 1e-6 : arguments[1];
	
	      var dx = Math.abs(this.x - other.x);
	      var dy = Math.abs(this.y - other.y);
	      return dx < threshold && dy < threshold;
	    }
	
	    /**
	     * equality test
	     * @param other
	     * @returns {boolean}
	     */
	
	  }, {
	    key: 'equals',
	    value: function equals(other) {
	      return this.x === other.x && this.y === other.y;
	    }
	
	    /**
	     * Given a source width/height of a box, return the aspect ratio correct size of the box when scaled down ( or optionally
	     * up ) to fit within the given window
	     * @param {Number} sourceWidth
	     * @param {Number} sourceHeight
	     * @param {Number} maxWidth
	     * @param {Number} maxHeight
	     * @param {Number} upscale
	     * @returns {Vector2D}
	     */
	
	  }, {
	    key: 'x',
	    get: function get() {
	      return this._v[0];
	    },
	    set: function set(newValue) {
	      (0, _invariant2.default)((0, _utils.isRealNumber)(newValue), 'Bad parameter');
	      this._v[0] = newValue;
	    }
	  }, {
	    key: 'y',
	    get: function get() {
	      return this._v[1];
	    },
	    set: function set(newValue) {
	      (0, _invariant2.default)((0, _utils.isRealNumber)(newValue), 'Bad parameter');
	
	      this._v[1] = newValue;
	    }
	  }], [{
	    key: 'fromObject',
	    value: function fromObject(str) {
	      (0, _invariant2.default)(str, 'Bad parameter');
	      var ary = str.split(',');
	      (0, _invariant2.default)(ary.length === 2, 'Bad parameter');
	      var vector = new Vector2D();
	      vector.x = parseFloat(ary[0]);
	      vector.y = parseFloat(ary[1]);
	      (0, _invariant2.default)((0, _utils.isRealNumber)(vector.x), 'Bad parameter');
	      (0, _invariant2.default)((0, _utils.isRealNumber)(vector.y), 'Bad parameter');
	      return vector;
	    }
	  }, {
	    key: 'pointOnCircumference',
	    value: function pointOnCircumference(xc, yc, radius, degrees) {
	      return new Vector2D(xc + radius * Math.cos((0, _utils.deg2rad)(degrees)), yc + radius * Math.sin((0, _utils.deg2rad)(degrees)));
	    }
	  }, {
	    key: 'scaleToWindow',
	    value: function scaleToWindow(sourceWidth, sourceHeight, maxWidth, maxHeight, upscale) {
	      // will hold thumb size on exit from this section
	      var tx = void 0;
	      var ty = void 0;
	
	      // if image fits entirely in window then just go with image size unless upscaling required
	      if (sourceWidth <= maxWidth && sourceHeight <= maxHeight && !upscale) {
	        tx = sourceWidth;
	        ty = sourceHeight;
	      } else {
	        // 1. Figure out which dimension is the worst fit, this is the axis/side
	        //    that we have to accommodate.
	
	        if (maxWidth / sourceWidth < maxHeight / sourceHeight) {
	          // width is the worst fit
	          // make width == window width
	          tx = maxWidth;
	
	          // make height in correct ratio to original
	          ty = sourceHeight * (maxWidth / sourceWidth) >> 0;
	        } else {
	          // height is the worst fit
	          // make height == window height
	          ty = maxHeight;
	
	          // make height in correct ratio to original
	          tx = sourceWidth * (maxHeight / sourceHeight) >> 0;
	        }
	      }
	
	      return new Vector2D(tx, ty);
	    }
	  }]);
	
	  return Vector2D;
	}();
	
	exports.default = Vector2D;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.nearly = exports.isZero = exports.isOne = exports.isRealNumber = exports.rad2deg = exports.deg2rad = undefined;
	
	var _underscore = __webpack_require__(11);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var deg2rad = exports.deg2rad = function deg2rad(deg) {
	  return deg * (Math.PI / 180);
	};
	
	var rad2deg = exports.rad2deg = function rad2deg(rad) {
	  return rad * (180 / Math.PI);
	};
	
	/**
	 * true is a number (including NaN!)
	 */
	var isRealNumber = exports.isRealNumber = function isRealNumber(val) {
	  return _underscore2.default.isNumber(val);
	};
	
	/**
	 * true if ~1
	 * @param  {number} val
	 * @return {boolean}
	 */
	var isOne = exports.isOne = function isOne(val) {
	  return Math.abs(1 - val) <= 1e-6;
	};
	
	/**
	 * true if ~0
	 * @param  {number} val
	 * @return {boolean}
	 */
	var isZero = exports.isZero = function isZero(val) {
	  return Math.abs(val) <= 1e-6;
	};
	
	/**
	 * true if the number v is very close to K
	 * @param  {number} v1
	 * @param  {number} v2
	 * @return {boolean}
	 */
	var nearly = exports.nearly = function nearly(v1, v2) {
	  return Math.abs(v1 - v2) < 1e-6;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _intersection2d = __webpack_require__(13);
	
	var _intersection2d2 = _interopRequireDefault(_intersection2d);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//shallow hasOwnProperty check
	var hasProp = function hasProp(obj, prop) {
	  return obj.hasOwnProperty(prop);
	};
	
	var Line2D = function () {
	
	  /**
	   * a line composed of a start and end point
	   * @constructor
	   * @param {Vector2D} start
	   * @param {Vector2D} end
	   */
	  function Line2D(start, end) {
	    _classCallCheck(this, Line2D);
	
	    switch (arguments.length) {
	      case 0:
	        this._start = new _vector2d2.default();
	        this._end = new _vector2d2.default();
	        break;
	
	      case 1:
	        (0, _invariant2.default)(hasProp(start, 'x1') && hasProp(start, 'y1') && hasProp(start, 'x2') && hasProp(start, 'y2'), 'Bad parameter');
	        this._start = new _vector2d2.default(start.x1, start.y1);
	        this._end = new _vector2d2.default(start.x2, start.y2);
	        break;
	
	      case 2:
	        this._start = start.clone();
	        this._end = end.clone();
	        break;
	
	      case 4:
	        this._start = new _vector2d2.default(arguments[0], arguments[1]);
	        this._end = new _vector2d2.default(arguments[2], arguments[3]);
	        break;
	
	      default:
	        throw new Error('Bad parameters');
	    }
	  }
	
	  /**
	   * getter for start of line
	   * @return {Vector2D} [description]
	   */
	
	
	  _createClass(Line2D, [{
	    key: 'clone',
	
	
	    /**
	     * clone the line
	     * @return {Line2D}
	     */
	    value: function clone() {
	      return new Line2D(this.start, this.end);
	    }
	
	    /**
	     * JSONable version of object
	     * @return object
	     */
	
	  }, {
	    key: 'toObject',
	    value: function toObject() {
	      return {
	        start: this.start.toObject(),
	        end: this.end.toObject()
	      };
	    }
	
	    /**
	     * static constructor, produces a Line from the product of toObject
	     * @param  {object} obj
	     * @return Line2D
	     */
	
	  }, {
	    key: 'len',
	
	
	    /**
	     * return length of line
	     * return number
	     */
	    value: function len() {
	      var xl = this.x2 - this.x1;
	      var yl = this.y2 - this.y1;
	      return Math.sqrt(xl * xl + yl * yl);
	    }
	
	    /**
	     * return the slope of the line. Returns infinity if the line is vertical
	     * @return {number} [description]
	     */
	
	  }, {
	    key: 'slope',
	    value: function slope() {
	      var xd = this.start.x - this.end.x;
	      if (xd === 0) {
	        return Infinity;
	      }
	      return (this.start.y - this.end.y) / xd;
	    }
	
	    /**
	     * distance of point to line segment formed by this.start, this.end squared.
	     * @param {Vector2D} point
	     * @return {number} [description]
	     */
	
	  }, {
	    key: 'distanceToSegment',
	    value: function distanceToSegment(point) {
	      return Math.sqrt(this.distanceToSegmentSquared(point));
	    }
	
	    /**
	     * return the squared distance of the point to this line
	     * @param  {Vector2D} point
	     * @return {number}
	     */
	
	  }, {
	    key: 'distanceToSegmentSquared',
	    value: function distanceToSegmentSquared(point) {
	      function sqr(xp) {
	        return xp * xp;
	      }
	
	      function dist2(p1, p2) {
	        return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
	      }
	
	      var startv = this.start;
	      var endv = this.end;
	      var l2 = dist2(startv, endv);
	      if (l2 === 0) {
	        return dist2(point, startv);
	      }
	      var dst = ((point.x - startv.x) * (endv.x - startv.x) + (point.y - startv.y) * (endv.y - startv.y)) / l2;
	      if (dst < 0) {
	        return dist2(point, startv);
	      }
	      if (dst > 1) {
	        return dist2(point, endv);
	      }
	      return dist2(point, {
	        x: startv.x + dst * (endv.x - startv.x),
	        y: startv.y + dst * (endv.y - startv.y)
	      });
	    }
	
	    /**
	     * parametric point on line
	     * @param {number} point
	     */
	
	  }, {
	    key: 'pointOnLine',
	    value: function pointOnLine(point) {
	      var x = this.x1 + (this.x2 - this.x1) * point;
	      var y = this.y1 + (this.y2 - this.y1) * point;
	      return new _vector2d2.default(x, y);
	    }
	
	    /**
	     * intersection of this line with another line. This is really line segment intersection since
	     * it considers the lines finite as defined by their end points
	      * @param {Line2D} other - other line segment to intersect with
	     * @returns {Intersection2D}
	     */
	
	  }, {
	    key: 'intersectWithLine',
	    value: function intersectWithLine(other) {
	      var result = void 0;
	      var uaT = (other.x2 - other.x1) * (this.y1 - other.y1) - (other.y2 - other.y1) * (this.x1 - other.x1);
	      var ubT = (this.x2 - this.x1) * (this.y1 - other.y1) - (this.y2 - this.y1) * (this.x1 - other.x1);
	      var uB = (other.y2 - other.y1) * (this.x2 - this.x1) - (other.x2 - other.x1) * (this.y2 - this.y1);
	
	      if (uB !== 0) {
	        var ua = uaT / uB;
	        var ub = ubT / uB;
	
	        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
	          result = new _intersection2d2.default(new _vector2d2.default(this.x1 + ua * (this.x2 - this.x1), this.y1 + ua * (this.y2 - this.y1)));
	
	          result.status = 'Intersection';
	        } else {
	          result = new _intersection2d2.default('No Intersection');
	        }
	      } else {
	        if (uaT === 0 || ubT === 0) {
	          result = new _intersection2d2.default('Coincident');
	        } else {
	          result = new _intersection2d2.default('Parallel');
	        }
	      }
	      return result;
	    }
	
	    /**
	     * multiple / scale the line by the given coeffecient
	     * @param (numner) v
	     */
	
	  }, {
	    key: 'multiply',
	    value: function multiply(multiplier) {
	      return new Line2D(this.start.multiply(multiplier), this.end.multiply(multiplier));
	    }
	
	    /**
	     * stringify the line
	     * @return {string}
	     */
	
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'line2d: ' + this.start.toString() + ' : ' + this.end.toString();
	    }
	  }, {
	    key: 'start',
	    get: function get() {
	      return this._start.clone();
	    }
	
	    /**
	     * setter for start
	     * @param  {Vector2D} vector
	     */
	    ,
	
	
	    /**
	     * setter for end
	     * @param  {Vector2D} vector
	     */
	    set: function set(vector) {
	      this._end = vector.clone();
	    }
	
	    /**
	     * getter for x start
	     * @return {number}
	     */
	
	  }, {
	    key: 'end',
	
	
	    /**
	     * getter for end of line
	     * @return {Vector2D} [description]
	     */
	    get: function get() {
	      return this._end.clone();
	    }
	  }, {
	    key: 'x1',
	    get: function get() {
	      return this.start.x;
	    }
	
	    /**
	     * getter for y start
	     * @return {number}
	     */
	
	  }, {
	    key: 'y1',
	    get: function get() {
	      return this.start.y;
	    }
	
	    /**
	     * getter for x end
	     * @return {number}
	     */
	
	  }, {
	    key: 'x2',
	    get: function get() {
	      return this.end.x;
	    }
	
	    /**
	     * getter for y end
	     * @return {number}
	     */
	
	  }, {
	    key: 'y2',
	    get: function get() {
	      return this.end.y;
	    }
	  }], [{
	    key: 'fromObject',
	    value: function fromObject(obj) {
	      (0, _invariant2.default)(obj && obj.start && obj.end, 'Bad parameter');
	      return new Line2D(_vector2d2.default.fromObject(obj.start), _vector2d2.default.fromObject(obj.end));
	    }
	  }]);
	
	  return Line2D;
	}();
	
	exports.default = Line2D;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Intersection2D = function () {
	  /**
	   * the generic results of various types of intersection test.
	   * For valid intersections the points property is an array of
	   * Vector2D objects. There is also a point property that returns
	   * the first point in the points array. The status property is a string that indicates why the intersection test
	   * failed if any
	   * @constructor
	   * @param {G.Vector2D|String|undefined} arg - can be a vector or a status string or nothing
	   */
	  function Intersection2D(arg) {
	    _classCallCheck(this, Intersection2D);
	
	    if (arg && arg.constructor.name === 'Vector2D') {
	      this.points = [arg];
	    } else {
	      if (typeof arg === 'string') {
	        this._status = arg;
	      }
	      this.points = [];
	    }
	  }
	
	  /**
	   * return the first point in our intersection set or null if there are no intersections
	   * @return {[type]} [description]
	   */
	
	
	  _createClass(Intersection2D, [{
	    key: 'add',
	
	
	    /**
	     * add a point to our intersection set
	     * @param {Vector2D} point
	     */
	    value: function add(point) {
	      this.points = this.points || [];
	      this.points.push(point);
	    }
	  }, {
	    key: 'point',
	    get: function get() {
	      if (this.points && this.points.length) {
	        return this.points[0];
	      }
	      return null;
	    }
	
	    /**
	     * return our status string
	     * @return String
	     */
	
	  }, {
	    key: 'status',
	    get: function get() {
	      return this._status;
	    }
	
	    /**
	     * setter for our status
	     * @param  {String} str
	     */
	    ,
	    set: function set(str) {
	      (0, _invariant2.default)(typeof str === 'string', 'expected a string');
	      this._status = str;
	    }
	  }]);
	
	  return Intersection2D;
	}();
	
	exports.default = Intersection2D;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _line2d = __webpack_require__(12);
	
	var _line2d2 = _interopRequireDefault(_line2d);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Box2D = function () {
	  /**
	   * flexible axis aligned box class. Can be initialized with almost any
	   * reasonable values or object i.e. 4 numbers, an object with a combination
	   * or x,y,w,h,l,t,r,b,left,top,right,bottom,width,height
	   * @param [x]
	   * @param [y]
	   * @param [w]
	   * @param [h]
	   * @constructor
	   */
	  function Box2D(x, y, w, h) {
	    _classCallCheck(this, Box2D);
	
	    // parse arguments
	    if (arguments.length === 4) {
	      this.x = x;
	      this.y = y;
	      this.w = w;
	      this.h = h;
	    } else {
	      if (arguments.length === 1) {
	        // map the properties ( keys ), if present, to our
	        // named property ( the values )
	        this.extend(arguments[0], {
	          x: 'x',
	          left: 'x',
	          y: 'y',
	          top: 'y',
	          w: 'w',
	          h: 'h',
	          width: 'w',
	          height: 'h',
	          right: 'r',
	          bottom: 'b',
	          r: 'r',
	          b: 'b'
	        });
	      } else {
	        if (arguments.length === 0) {
	          this.x = this.y = this.w = this.h = 0;
	        } else {
	          throw new Error('Bad parameters');
	        }
	      }
	    }
	  }
	
	  /**
	   * extend ourselves with any of the property names in props,
	   * renaming them to the given target property name
	   * @param  {[type]} from  [description]
	   * @param  {[type]} props [description]
	   * @return {[type]}       [description]
	   */
	
	
	  _createClass(Box2D, [{
	    key: 'extend',
	    value: function extend(from, props) {
	      for (var key in props) {
	        if (from.hasOwnProperty(key)) {
	          this[props[key]] = from[key];
	        }
	      }
	    }
	
	    /**
	     * simple toString 4 CSV values
	     * @returns {*}
	     */
	
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h;
	    }
	
	    /**
	     * construct a box from a string, opposite of toString
	     */
	
	  }, {
	    key: 'clone',
	
	
	    /**
	     * return a cloned copy of this
	     * @return Box2D
	     */
	    value: function clone() {
	      return new Box2D(this.x, this.y, this.w, this.h);
	    }
	
	    /**
	     * normalize by returning a new box with positive extents
	     */
	
	  }, {
	    key: 'normalize',
	    value: function normalize() {
	      return new Box2D(Math.min(this.x, this.right), Math.min(this.y, this.bottom), Math.abs(this.w), Math.abs(this.h));
	    }
	
	    /**
	     * return a new Box inflated by the given signed amount
	     * @param {number} inflateX
	     * @param {number} inflateY
	     */
	
	  }, {
	    key: 'inflate',
	    value: function inflate(inflateX, inflateY) {
	      var box = new Box2D(this.x, this.y, this.w + inflateX * 2, this.h + inflateY * 2);
	      box.cx = this.cx;
	      box.cy = this.cy;
	      return box;
	    }
	
	    /**
	     * scale width/height of box around center returning a new box
	     * @param x
	     * @param y
	     */
	
	  }, {
	    key: 'scale',
	    value: function scale(x, y) {
	      return new Box2D(this.cx - this.width * x / 2, this.cy - this.height * y / 2, this.width * x, this.height * y);
	    }
	
	    /**
	     * return a new box that is this box * e
	     * @param multiplier
	     */
	
	  }, {
	    key: 'multiply',
	    value: function multiply(multiplier) {
	      return new Box2D(this.x * multiplier, this.y * multiplier, this.width * multiplier, this.height * multiplier);
	    }
	
	    /**
	     * return a new box that is this box / e
	     * @param divisor
	     */
	
	  }, {
	    key: 'divide',
	    value: function divide(divisor) {
	      return new Box2D(this.x / divisor, this.y / divisor, this.width / divisor, this.height / divisor);
	    }
	
	    /**
	     * return true if this box is identical to another box
	     * @param other
	     * @returns {boolean}
	     */
	
	  }, {
	    key: 'equals',
	    value: function equals(other) {
	      return other.x === this.x && other.y === this.y && other.width === this.width && other.height === this.height;
	    }
	
	    /**
	     * return a new box that is the union of this box and some other box/rect like object
	     * @param box - anything with x,y,w,h properties
	     * @returns Box2D - the union of this and box
	     */
	
	  }, {
	    key: 'union',
	    value: function union(box) {
	      var uni = new Box2D(Math.min(this.x, box.x), Math.min(this.y, box.y), 0, 0);
	
	      uni.right = Math.max(this.right, box.x + box.w);
	      uni.bottom = Math.max(this.bottom, box.y + box.h);
	
	      return uni;
	    }
	
	    /**
	     * get the nth edge
	     * 0: top left -> top right
	     * 1: top right -> bottom right
	     * 2: bottom right -> bottom left
	     * 3: bottom left -> top left
	     * @param {Number} nth
	     */
	
	  }, {
	    key: 'getEdge',
	    value: function getEdge(nth) {
	      (0, _invariant2.default)(nth >= 0 && nth < 4, 'Bad parameter');
	      switch (nth) {
	        case 0:
	          return new _line2d2.default(new _vector2d2.default(this.x, this.y), new _vector2d2.default(this.right, this.y));
	        case 1:
	          return new _line2d2.default(new _vector2d2.default(this.right, this.y), new _vector2d2.default(this.right, this.bottom));
	        case 2:
	          return new _line2d2.default(new _vector2d2.default(this.right, this.bottom), new _vector2d2.default(this.x, this.bottom));
	        default:
	          return new _line2d2.default(new _vector2d2.default(this.x, this.bottom), new _vector2d2.default(this.x, this.y));
	      }
	    }
	
	    /**
	     * return the union of the given boxes or an empty box if the list is empty
	     * @static
	     */
	
	  }, {
	    key: 'intersectWithBox',
	
	
	    /**
	     * return the intersection of this box with the other box
	     * @param box
	     */
	    value: function intersectWithBox(box) {
	      // minimum of right edges
	      var minx = Math.min(this.right, box.right);
	      // maximum of left edges
	      var maxx = Math.max(this.x, box.x);
	      // minimum of bottom edges
	      var miny = Math.min(this.bottom, box.bottom);
	      // maximum of top edges
	      var maxy = Math.max(this.y, box.y);
	      // if area is greater than zero there is an intersection
	      if (maxx < minx && maxy < miny) {
	        var x = Math.min(minx, maxx);
	        var y = Math.min(miny, maxy);
	        var w = Math.max(minx, maxx) - x;
	        var h = Math.max(miny, maxy) - y;
	        return new Box2D(x, y, w, h);
	      }
	      return null;
	    }
	
	    /**
	     * return true if we are completely inside the other box
	     * @param other
	     */
	
	  }, {
	    key: 'isInside',
	    value: function isInside(other) {
	      return this.x >= other.x && this.y >= other.y && this.right <= other.right && this.bottom <= other.bottom;
	    }
	
	    /**
	     * return true if the given point ( anything with x/y properties ) is inside the box
	     * @param point
	     */
	
	  }, {
	    key: 'pointInBox',
	    value: function pointInBox(point) {
	      return point.x >= this.x && point.y >= this.y && point.x < this.right && point.y < this.bottom;
	    }
	
	    /**
	     * return true if the box have zero or negative extents in either axis
	     */
	
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.w <= 0 || this.h <= 0;
	    }
	  }, {
	    key: 'left',
	
	
	    /**
	     * accessors for all corners, edges of the box
	     */
	    get: function get() {
	      return this.x;
	    },
	    set: function set(_x) {
	      this.x = _x;
	    }
	  }, {
	    key: 'width',
	    get: function get() {
	      return this.w;
	    },
	    set: function set(_w) {
	      this.w = _w;
	    }
	  }, {
	    key: 'height',
	    get: function get() {
	      return this.h;
	    },
	    set: function set(_h) {
	      this.h = _h;
	    }
	  }, {
	    key: 'top',
	    get: function get() {
	      return this.y;
	    },
	    set: function set(_y) {
	      this.y = _y;
	    }
	  }, {
	    key: 'right',
	    get: function get() {
	      return this.x + this.w;
	    },
	    set: function set(_r) {
	      this.w = _r - this.x;
	    }
	  }, {
	    key: 'bottom',
	    get: function get() {
	      return this.y + this.h;
	    },
	    set: function set(_b) {
	      this.h = _b - this.y;
	    }
	  }, {
	    key: 'cx',
	    get: function get() {
	      return this.x + this.w / 2;
	    },
	    set: function set(_cx) {
	      this.x = _cx - this.w / 2;
	    }
	  }, {
	    key: 'cy',
	    get: function get() {
	      return this.y + this.h / 2;
	    },
	    set: function set(_cy) {
	      this.y = _cy - this.h / 2;
	    }
	  }, {
	    key: 'center',
	    get: function get() {
	      return new _vector2d2.default(this.cx, this.cy);
	    },
	    set: function set(vector) {
	      this.cx = vector.x;
	      this.cy = vector.y;
	    }
	  }, {
	    key: 'topLeft',
	    get: function get() {
	      return new _vector2d2.default(this.x, this.y);
	    },
	    set: function set(vector) {
	      this.x = vector.x;
	      this.y = vector.y;
	    }
	  }, {
	    key: 'topRight',
	    get: function get() {
	      return new _vector2d2.default(this.right, this.y);
	    },
	    set: function set(vector) {
	      this.right = vector.x;
	      this.y = vector.y;
	    }
	  }, {
	    key: 'bottomRight',
	    get: function get() {
	      return new _vector2d2.default(this.right, this.bottom);
	    },
	    set: function set(vector) {
	      this.right = vector.x;
	      this.bottom = vector.y;
	    }
	  }, {
	    key: 'bottomLeft',
	    get: function get() {
	      return new _vector2d2.default(this.x, this.bottom);
	    },
	    set: function set(vector) {
	      this.x = vector.x;
	      this.bottom = vector.y;
	    }
	  }], [{
	    key: 'fromString',
	    value: function fromString(str) {
	      (0, _invariant2.default)(str, 'Bad parameter');
	      var values = str.split(',');
	      (0, _invariant2.default)(values && values.length === 4, 'Unexpected format');
	      return new Box2D(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));
	    }
	
	    /**
	     * return an AABB defined by the limits of this point
	     * and another point
	     * @param  {[Vector2D} ary
	     * @return {Box2D}
	     */
	
	  }, {
	    key: 'boxFromPoints',
	    value: function boxFromPoints(ary) {
	      var xmin = Number.MAX_VALUE;
	      var ymin = Number.MAX_VALUE;
	      var xmax = -Number.MAX_VALUE;
	      var ymax = -Number.MAX_VALUE;
	
	      for (var i = 0; i < ary.length; i += 1) {
	        xmin = Math.min(xmin, ary[i].x);
	        ymin = Math.min(ymin, ary[i].y);
	        xmax = Math.max(xmax, ary[i].x);
	        ymax = Math.max(ymax, ary[i].y);
	      }
	
	      return new Box2D(xmin, ymin, xmax - xmin, ymax - ymin);
	    }
	  }, {
	    key: 'union',
	    value: function union(boxes) {
	      var uni = new Box2D(0, 0, 0, 0);
	
	      if (boxes && boxes.length) {
	        uni.x = Math.min.apply(null, boxes.map(function (box) {
	          return box.x;
	        }));
	        uni.y = Math.min.apply(null, boxes.map(function (box) {
	          return box.y;
	        }));
	        uni.r = Math.min.apply(null, boxes.map(function (box) {
	          return box.r;
	        }));
	        uni.b = Math.min.apply(null, boxes.map(function (box) {
	          return box.b;
	        }));
	      }
	      return uni;
	    }
	  }]);
	
	  return Box2D;
	}();
	
	exports.default = Box2D;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _vector2d = __webpack_require__(9);
	
	var _vector2d2 = _interopRequireDefault(_vector2d);
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ViewerStatusBar = function () {
	
	  /**
	   * constructor only needs the viewer
	   * @param viewer
	   */
	  function ViewerStatusBar(viewer) {
	    _classCallCheck(this, ViewerStatusBar);
	
	    this.viewer = viewer;
	    this.outer = (0, _dom2.default)('<div class="viewer-status-bar">\n        <span>Search</span><input maxlength="128" data-ref="searchBox"/>\n        <span>Start</span><input maxlength="20" data-ref="startBox"/>\n        <span>End</span><input maxlength="20" data-ref="endBox"/>\n        <span data-ref="lengthSpan">Length:</span>\n        <span data-ref="positionSpan"></span>\n      </div>');
	    this.viewer.options.parent.appendChild(this.outer.el);
	    this.outer.importRefs(this);
	
	    this.startBox.el.addEventListener('input', this.updateSelection.bind(this));
	    this.endBox.el.addEventListener('input', this.updateSelection.bind(this));
	    this.searchBox.el.addEventListener('input', this.onSearchTermChanged.bind(this));
	  }
	
	  /**
	   * set the start/end value
	   * @param index
	   */
	
	
	  _createClass(ViewerStatusBar, [{
	    key: 'setStart',
	    value: function setStart(index) {
	      this.startBox.el.value = arguments.length ? index : '';
	    }
	  }, {
	    key: 'setEnd',
	    value: function setEnd(index) {
	      this.endBox.el.value = arguments.length ? index : '';
	    }
	
	    /**
	     * set the base pairs information
	     * @param n
	     */
	
	  }, {
	    key: 'setBasePairs',
	    value: function setBasePairs(n) {
	      this.basePairs = n || 0;
	      this.lengthSpan.el.innerText = 'Length: ' + this.basePairs + ' BP';
	    }
	
	    /**
	     * display the position box or hide
	     * @param index
	     */
	
	  }, {
	    key: 'setPosition',
	    value: function setPosition(index) {
	      this.positionSpan.el.innerText = arguments.length ? 'Position: ' + index : '';
	    }
	
	    /**
	     * called to reset search term box
	     */
	
	  }, {
	    key: 'resetSearch',
	    value: function resetSearch() {
	      this.searchBox.el.value = '';
	    }
	
	    /**
	     * update selection from text in inputs
	     */
	
	  }, {
	    key: 'updateSelection',
	    value: function updateSelection() {
	      var limits = this.getStartEndFromInputs();
	      if (limits) {
	        this.viewer.userInterface.setSelectionFromColumnRow(limits.start, limits.end);
	        this.viewer.firstRow = limits.start.y;
	        this.viewer.render();
	      }
	    }
	    /**
	     * if both start and end are currently valid then return
	     * the start and end as Vector2D
	     */
	
	  }, {
	    key: 'getStartEndFromInputs',
	    value: function getStartEndFromInputs() {
	      var start = Number.parseFloat(this.startBox.el.value);
	      var end = Number.parseFloat(this.endBox.el.value);
	      if (Number.isNaN(start) || Number.isNaN(end)) {
	        return null;
	      }
	      // clamp to available number of base pair
	      start = Math.max(0, Math.min(start, this.basePairs - 1));
	      end = Math.max(0, Math.min(end, this.basePairs - 1));
	      // range must be right side up
	      if (end <= start) {
	        return null;
	      }
	      return {
	        start: new _vector2d2.default(start % this.viewer.rowLength, Math.floor(start / this.viewer.rowLength)),
	        end: new _vector2d2.default(end % this.viewer.rowLength, Math.floor(end / this.viewer.rowLength))
	      };
	    }
	
	    /**
	     * return a hash of the bigrams for a given string.
	     * Each hash entry is key:biggram, value: number of occurrences
	     * @param str
	     */
	
	  }, {
	    key: 'bigrams',
	    value: function bigrams(str) {
	      (0, _invariant2.default)(str && str.length >= 2, 'string must be 2 chars at least');
	      var hash = {};
	      for (var i = 0; i < str.length - 1; i += 1) {
	        var bigram = str.substr(i, 2);
	        var record = hash[bigram];
	        if (record) {
	          record.count += 1;
	        } else {
	          hash[bigram] = { count: 1 };
	        }
	      }
	      // add number of pairs to hash and return
	      return hash;
	    }
	    /**
	     * Match two string using the sorensen-dice algorithm
	     * http://www.algomation.com/algorithm/sorensen-dice-string-similarity
	     * @param pattern
	     * @param matter
	     */
	
	  }, {
	    key: 'sorensenDice',
	    value: function sorensenDice(_str1, _str2) {
	      (0, _invariant2.default)(_str1 && _str2, 'both must be strings with at least 1 char');
	      // always compare with case
	      var str1 = _str1.toUpperCase();
	      var str2 = _str2.toUpperCase();
	
	      // if the pattern string is 1 char then just return 1 / length
	      // of match string if the char occurs in the target
	      if (str1.length === 1) {
	        return str2.indexOf(str1) >= 0 ? 1 / str2.length : 0;
	      }
	      // likewise if the pattern is only 1 char
	      if (str2.length === 1) {
	        return str1.indexOf(str2) >= 0 ? 1 / str1.length : 0;
	      }
	      // both strings have one or more bigrams so we can use the algorithm
	      var b1 = this.bigrams(str1);
	      var b2 = this.bigrams(str2);
	      // count the occurrences of the b1 pairs in b2
	      var bigrams = Object.keys(b1);
	      var matches = 0;
	      for (var i = 0; i < bigrams.length; i += 1) {
	        var bigram = bigrams[i];
	        var match = b2[bigram];
	        if (match) {
	          match.count = Math.max(0, match.count - 1);
	          matches += 1;
	        }
	      }
	      // return a normalize ( 0..1 ) value by returning the number
	      // matches to the total number of pairs in str2
	      return matches / Object.keys(b2).length;
	    }
	
	    /**
	     * search term was changed, start a new search of the blocks and annotations for the closest name
	     * match.
	     */
	
	  }, {
	    key: 'onSearchTermChanged',
	    value: function onSearchTermChanged() {
	      var _this = this;
	
	      var term = this.searchBox.el.value.trim();
	      if (term) {
	        (function () {
	          // find the highest scoring block or annotation
	          var best = null;
	          var bestScore = -Infinity;
	          var blockOrAnnotation = null;
	
	          // score blocks
	          _this.viewer.blockList.forEach(function (block) {
	            var score = _this.sorensenDice(block.getName(), term);
	            if (score > bestScore) {
	              bestScore = score;
	              best = block;
	              blockOrAnnotation = 'block';
	            }
	          });
	
	          // score annotations
	          _this.viewer.annotationList.forEach(function (annotation) {
	            var score = _this.sorensenDice(annotation.name, term);
	            if (score > bestScore) {
	              bestScore = score;
	              best = annotation;
	              blockOrAnnotation = 'annotation';
	            }
	          });
	
	          // select and show the highest scoring item
	          if (best && blockOrAnnotation === 'block') {
	            _this.viewer.selectBlock(best.id);
	            _this.viewer.showBlock(best.id);
	          }
	          if (best && blockOrAnnotation === 'annotation') {
	            _this.viewer.selectAnnotation(best.id);
	            _this.viewer.showAnnotation(best.id);
	          }
	          if (best) {
	            _this.viewer.render();
	          }
	        })();
	      }
	    }
	  }]);
	
	  return ViewerStatusBar;
	}();
	
	exports.default = ViewerStatusBar;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderSequenceRow;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render a sequence of chars with appearance as for primary sequence
	 */
	function renderSequenceRow(viewer, rowEl, record, y) {
	  var e = (0, _dom2.default)('<div class="sequence-text roboto fixed font-size"></div>');
	  e.setStyles({
	    left: record.startRowOffset * viewer.getCharWidth() + 'px',
	    width: record.length * viewer.getCharWidth() + 'px',
	    top: y + 'px',
	    height: viewer.getCharHeight() + 'px',
	    lineHeight: viewer.getCharHeight() + 'px'
	  });
	  e.el.innerText = viewer.getSequence(record.block, record.blockOffset, record.length);
	  rowEl.appendChild(e);
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderSeparatorSequenceRow;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render the row of ++++ chars between the primary and reverse sequence
	 */
	function renderSeparatorSequenceRow(viewer, rowEl, record, y) {
	  var e = (0, _dom2.default)('<div class="sequence-text-marker roboto fixed font-size"></div>');
	  e.setStyles({
	    left: record.startRowOffset * viewer.getCharWidth() + 'px',
	    width: record.length * viewer.getCharWidth() + 'px',
	    top: y + 'px',
	    height: viewer.getCharHeight() + 'px',
	    lineHeight: viewer.getCharHeight() + 'px'
	  });
	  e.el.innerText = "+".repeat(record.length);
	  rowEl.appendChild(e);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderReverseSequenceRow;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render a sequence of chars with appearance as for primary sequence
	 */
	function renderReverseSequenceRow(viewer, rowEl, record, y) {
	  var e = (0, _dom2.default)('<div class="sequence-text-reverse roboto fixed font-size"></div>');
	  e.setStyles({
	    left: record.startRowOffset * viewer.getCharWidth() + 'px',
	    width: record.length * viewer.getCharWidth() + 'px',
	    top: y + 'px',
	    height: viewer.getCharHeight() + 'px',
	    lineHeight: viewer.getCharHeight() + 'px'
	  });
	  e.el.innerText = viewer.getSequence(record.block, record.blockOffset, record.length, true);
	  rowEl.appendChild(e);
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderBlockSequenceRow;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render a sequence of chars with appearance as for primary sequence
	 */
	function renderBlockSequenceRow(viewer, rowEl, record, y) {
	  var e = (0, _dom2.default)('<div class="sequence-name roboto fixed font-size"></div>');
	  e.setStyles({
	    left: record.startRowOffset * viewer.getCharWidth() + 'px',
	    width: record.length * viewer.getCharWidth() + 'px',
	    top: y + 'px',
	    height: viewer.getCharHeight() + 'px',
	    lineHeight: viewer.getCharHeight() + 'px',
	    backgroundColor: record.block.metadata.color || 'lightgray'
	  });
	  e.el.innerText = '•' + record.block.getName() + '•';
	  rowEl.appendChild(e);
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderSequenceRuler;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render a sequence of chars with appearance as for primary sequence
	 */
	function renderSequenceRuler(viewer, rowEl, y, start, length) {
	  // render the ruler container which is tall enough for the markers.
	  // Its top border is set
	  var e = (0, _dom2.default)('<div class="sequence-ruler roboto fixed font-size"></div>');
	  var H = viewer.getCharHeight() * 1.5;
	  e.setStyles({
	    left: '0px',
	    width: length * viewer.getCharWidth() + 'px',
	    top: y + 'px',
	    height: H + 'px',
	    lineHeight: H + 'px'
	  });
	  // begin at start position rounded down to nearest 10
	  var initial = Math.floor(start / 10) * 10;
	
	  for (var i = 0; i <= length; i += 10) {
	    // xp is the location of the tick mark
	    var xp = (initial - start + i) * viewer.getCharWidth() + viewer.getCharWidth() / 2;
	    // text value of marker
	    var value = (initial + i).toString();
	    // width of element including text
	    var width = value.length * viewer.getCharWidth();
	    // the tick + number must be complete visible or we don't render
	    if (xp - width / 2 >= 0 && xp + width / 2 <= viewer.rowLength * viewer.getCharWidth()) {
	      // create tick mark
	      var tick = (0, _dom2.default)('<div class="tick"></div>');
	      tick.setStyles({
	        left: xp + 'px',
	        height: viewer.getCharHeight() / 2 + 'px'
	      });
	      e.appendChild(tick);
	      // add numeric value
	      var number = (0, _dom2.default)('<div class="number">' + value + '</div>');
	      number.setStyles({
	        left: xp - width / 2 + 'px',
	        top: viewer.getCharHeight() / 2 + 'px',
	        width: width + 'px',
	        height: viewer.getCharHeight() + 'px',
	        lineHeight: viewer.getCharHeight() + 'px'
	      });
	      e.appendChild(number);
	    }
	  }
	  // add the entire ruler to the viewer
	  rowEl.appendChild(e);
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderAnnotation;
	
	var _dom = __webpack_require__(4);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * render an annotation block
	 */
	function renderAnnotation(viewer, rowEl, record, y) {
	  var e = (0, _dom2.default)('<div class="annotation roboto fixed font-size"></div>');
	  e.setStyles({
	    left: record.start * viewer.getCharWidth() + 'px',
	    width: (record.end - record.start + 1) * viewer.getCharWidth() + 'px',
	    top: y + record.depth * viewer.getCharHeight() + 'px',
	    height: viewer.getCharHeight() + 'px',
	    lineHeight: viewer.getCharHeight() + 'px',
	    backgroundColor: record.annotation.color
	  });
	  e.el.innerText = record.annotation.name;
	  rowEl.appendChild(e);
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(25)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./viewer.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./viewer.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(24)();
	// imports
	
	
	// module
	exports.push([module.id, "/* supplies correct font family for fixed pitch monospace sequence text etc*/\n.roboto {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* if you want fixed pitch font with no mystery meat in the kerning etc this is a good starting point*/\n/* webpack included directly */\n.fixed {\n  padding: 0;\n  letter-spacing: 0;\n  -webkit-font-kerning: none;\n          font-kerning: none;\n  white-space: nowrap;\n}\n\n.font-size {\n  font-size: 12px;\n}\n\n.inline-block {\n  display: inline-block;\n}\n\n/* status bar below DNA in sequence viewer */\n.viewer-status-bar {\n  position: relative;\n  box-sizing: content-box;\n  width: 100%;\n  height: 2rem;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: lightgray;\n}\n\n.viewer-status-bar span {\n  color: gray;\n  margin-left: 1rem;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.viewer-status-bar input {\n  margin: 0;\n  padding: 0;\n  border: none;\n  margin-left: 1rem;\n  width: 6rem;\n}\n\n/* the viewer itself */\n.viewer {\n  position: relative;\n  box-sizing: content-box;\n  width: calc(100% - 2rem);\n  margin: 0 1rem 0 1rem;\n  height: calc(100% - 2rem);\n  overflow: hidden;\n}\n\n/* contains the actual rowsContainer with the content */\n.rows {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n.row-element {\n  position: absolute;\n  display: inline-block;\n}\n\n/* user interface layer */\n.userinterface {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n}\n\n.userinterface .selection-box {\n  position: absolute;\n  box-sizing: border-box;\n  background-color: rgba(51, 153, 255, 0.1);\n  pointer-events: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.userinterface .left-edge {\n  border-left: 2px solid dodgerblue;\n}\n\n.userinterface .right-edge {\n  border-right: 2px solid dodgerblue;\n}\n\n/* style for sequence tet */\n.sequence-text {\n  position: absolute;\n  display: inline-block;\n  text-align: left;\n  color: black;\n  white-space: pre;\n}\n\n.sequence-text-reverse {\n  position: absolute;\n  display: inline-block;\n  text-align: left;\n  color: lightgray;\n  white-space: pre;\n}\n\n.sequence-text-marker {\n  position: absolute;\n  display: inline-block;\n  text-align: left;\n  color: lightgray;\n}\n\n/* style for colored block that contains the block name */\n.sequence-name {\n  position: absolute;\n  display: inline-block;\n  text-align: center;\n  color: black;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  border-left: 1px solid white;\n}\n\n.sequence-ruler {\n  position: absolute;\n  display: inline-block;\n  box-sizing: border-box;\n  border-top: 1px solid lightgray;\n}\n\n.sequence-ruler .tick {\n  position: absolute;\n  display: inline-block;\n  box-sizing: border-box;\n  top: 0px;\n  width: 1px;\n  border-left: 1px solid lightgray;\n}\n\n.sequence-ruler .number {\n  position: absolute;\n  display: inline-block;\n  color: lightgray;\n  text-align: center;\n}\n\n.annotation {\n  position: absolute;\n  display: inline-block;\n  text-align: center;\n  color: dimgray;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  border-top: 1px solid white;\n  border-left: 1px solid white;\n}\n\n.cursor {\n  position: absolute;\n  display: inline-block;\n  background-color: transparent;\n  border: 1px solid orange;\n  box-sizing: border-box;\n}\n\n.sv-mouseLayer {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: transparent;\n  cursor: pointer;\n}\n", ""]);
	
	// exports


/***/ },
/* 24 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _invariant = __webpack_require__(2);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _nodeUuid = __webpack_require__(27);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * internally the sequence viewer uses a wrapper class for annotations to overcome certain limitations e.g.
	 * they have no id, start/end are relative to the block etc. The viewer annotations are not constrained to blocks.
	 * Native object looks something like this:
	
	 {
	  "tags": {},
	  "name": "transposase",
	  "description": "",
	  "color": "#8EC78D",
	  "role": "cds",
	  "sequence": "",
	  "start": 0,
	  "end": 275,
	  "isForward": false,
	  "notes": {
	    "genbank": {
	      "locus_tag": "VT52_RS35370",
	      "inference": "EXISTENCE: similar to AA sequence:RefSeq:WP_019889618.1",
	      "old_locus_tag": "VT52_35365",
	      "codon_start": "1",
	      "pseudo": "",
	      "product": "transposase",
	      "transl_table": "11",
	      "note": "incomplete; too short partial abutting assembly gap; missing stop; Derived by automated computational analysis using gene prediction method: Protein Homology.",
	      "type": "CDS"
	    }
	  }
	}"
	
	 */
	var Annotation = function () {
	  function Annotation(annotation, block) {
	    _classCallCheck(this, Annotation);
	
	    this.id = _nodeUuid2.default.v4();
	    this.name = annotation.name;
	    this.color = annotation.color || 'lightgray';
	    // save reference to block from whence we came
	    this.block = block;
	    // save reference to our native annotation
	    this.nativeAnnotation = annotation;
	  }
	
	  /**
	   * our block start/end/length is only calculated once we are added to the viewer
	   * and the global position of our parent block is known ( since the native annotation
	   * start and end are relative to that block )
	   * @param viewer
	   */
	
	
	  _createClass(Annotation, [{
	    key: 'setStartEnd',
	    value: function setStartEnd(viewer) {
	      // we assume blocks have already been mapped to columns and rows and that the information
	      // is available on the viewer object
	      var blockInfo = viewer.blockRowMap[this.block.id];
	      // some annotations are applied to the construct. The construct block is not
	      // part of the list of blocks the viewer is displaying. For those we assume
	      // the start and end are relative to the entire sequence
	      var startIndex = 0;
	      if (blockInfo) {
	        startIndex = blockInfo.startRow * viewer.rowLength + blockInfo.startRowOffset;
	      } else {
	        (0, _invariant2.default)(viewer.appState.blocks[this.block.id], 'expected block to be the app state at least');
	      }
	      // now we set the global start / end of this annotation
	      this.start = this.nativeAnnotation.start + startIndex;
	      this.length = this.nativeAnnotation.end - this.nativeAnnotation.start;
	      this.end = this.start + this.length - 1;
	    }
	  }]);
	
	  return Annotation;
	}();
	
	exports.default = Annotation;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(Buffer) {//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	
	/*global window, require, define */
	(function(_window) {
	  'use strict';
	
	  // Unique ID creation requires a high quality random # generator.  We feature
	  // detect to determine the best RNG source, normalizing to a function that
	  // returns 128-bits of randomness, since that's what's usually required
	  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;
	
	  function setupBrowser() {
	    // Allow for MSIE11 msCrypto
	    var _crypto = _window.crypto || _window.msCrypto;
	
	    if (!_rng && _crypto && _crypto.getRandomValues) {
	      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	      //
	      // Moderately fast, high quality
	      try {
	        var _rnds8 = new Uint8Array(16);
	        _whatwgRNG = _rng = function whatwgRNG() {
	          _crypto.getRandomValues(_rnds8);
	          return _rnds8;
	        };
	        _rng();
	      } catch(e) {}
	    }
	
	    if (!_rng) {
	      // Math.random()-based (RNG)
	      //
	      // If all else fails, use Math.random().  It's fast, but is of unspecified
	      // quality.
	      var  _rnds = new Array(16);
	      _mathRNG = _rng = function() {
	        for (var i = 0, r; i < 16; i++) {
	          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
	          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	        }
	
	        return _rnds;
	      };
	      if ('undefined' !== typeof console && console.warn) {
	        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
	      }
	    }
	  }
	
	  function setupNode() {
	    // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
	    //
	    // Moderately fast, high quality
	    if (true) {
	      try {
	        var _rb = __webpack_require__(32).randomBytes;
	        _nodeRNG = _rng = _rb && function() {return _rb(16);};
	        _rng();
	      } catch(e) {}
	    }
	  }
	
	  if (_window) {
	    setupBrowser();
	  } else {
	    setupNode();
	  }
	
	  // Buffer class to use
	  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;
	
	  // Maps for number <-> hex string conversion
	  var _byteToHex = [];
	  var _hexToByte = {};
	  for (var i = 0; i < 256; i++) {
	    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	    _hexToByte[_byteToHex[i]] = i;
	  }
	
	  // **`parse()` - Parse a UUID into it's component bytes**
	  function parse(s, buf, offset) {
	    var i = (buf && offset) || 0, ii = 0;
	
	    buf = buf || [];
	    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	      if (ii < 16) { // Don't overflow!
	        buf[i + ii++] = _hexToByte[oct];
	      }
	    });
	
	    // Zero out remaining bytes if string was short
	    while (ii < 16) {
	      buf[i + ii++] = 0;
	    }
	
	    return buf;
	  }
	
	  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	  function unparse(buf, offset) {
	    var i = offset || 0, bth = _byteToHex;
	    return  bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]];
	  }
	
	  // **`v1()` - Generate time-based UUID**
	  //
	  // Inspired by https://github.com/LiosK/UUID.js
	  // and http://docs.python.org/library/uuid.html
	
	  // random #'s we need to init node and clockseq
	  var _seedBytes = _rng();
	
	  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	  var _nodeId = [
	    _seedBytes[0] | 0x01,
	    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	  ];
	
	  // Per 4.2.2, randomize (14 bit) clockseq
	  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	  // Previous uuid creation time
	  var _lastMSecs = 0, _lastNSecs = 0;
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v1(options, buf, offset) {
	    var i = buf && offset || 0;
	    var b = buf || [];
	
	    options = options || {};
	
	    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;
	
	    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();
	
	    // Per 4.2.1.2, use count of uuid's generated during the current clock
	    // cycle to simulate higher resolution clock
	    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;
	
	    // Time since last uuid creation (in msecs)
	    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	    // Per 4.2.1.2, Bump clockseq on clock regression
	    if (dt < 0 && options.clockseq == null) {
	      clockseq = clockseq + 1 & 0x3fff;
	    }
	
	    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	    // time interval
	    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
	      nsecs = 0;
	    }
	
	    // Per 4.2.1.2 Throw error if too many uuids are requested
	    if (nsecs >= 10000) {
	      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	    }
	
	    _lastMSecs = msecs;
	    _lastNSecs = nsecs;
	    _clockseq = clockseq;
	
	    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	    msecs += 12219292800000;
	
	    // `time_low`
	    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	    b[i++] = tl >>> 24 & 0xff;
	    b[i++] = tl >>> 16 & 0xff;
	    b[i++] = tl >>> 8 & 0xff;
	    b[i++] = tl & 0xff;
	
	    // `time_mid`
	    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	    b[i++] = tmh >>> 8 & 0xff;
	    b[i++] = tmh & 0xff;
	
	    // `time_high_and_version`
	    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	    b[i++] = tmh >>> 16 & 0xff;
	
	    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	    b[i++] = clockseq >>> 8 | 0x80;
	
	    // `clock_seq_low`
	    b[i++] = clockseq & 0xff;
	
	    // `node`
	    var node = options.node || _nodeId;
	    for (var n = 0; n < 6; n++) {
	      b[i + n] = node[n];
	    }
	
	    return buf ? buf : unparse(b);
	  }
	
	  // **`v4()` - Generate random UUID**
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v4(options, buf, offset) {
	    // Deprecated - 'format' argument, as supported in v1.2
	    var i = buf && offset || 0;
	
	    if (typeof(options) === 'string') {
	      buf = (options === 'binary') ? new BufferClass(16) : null;
	      options = null;
	    }
	    options = options || {};
	
	    var rnds = options.random || (options.rng || _rng)();
	
	    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	    rnds[6] = (rnds[6] & 0x0f) | 0x40;
	    rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	    // Copy bytes to buffer, if provided
	    if (buf) {
	      for (var ii = 0; ii < 16; ii++) {
	        buf[i + ii] = rnds[ii];
	      }
	    }
	
	    return buf || unparse(rnds);
	  }
	
	  // Export public API
	  var uuid = v4;
	  uuid.v1 = v1;
	  uuid.v4 = v4;
	  uuid.parse = parse;
	  uuid.unparse = unparse;
	  uuid.BufferClass = BufferClass;
	  uuid._rng = _rng;
	  uuid._mathRNG = _mathRNG;
	  uuid._nodeRNG = _nodeRNG;
	  uuid._whatwgRNG = _whatwgRNG;
	
	  if (('undefined' !== typeof module) && module.exports) {
	    // Publish as node.js module
	    module.exports = uuid;
	  } else if (true) {
	    // Publish as AMD module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return uuid;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	
	  } else {
	    // Publish as global (in browsers)
	    _previousRoot = _window.uuid;
	
	    // **`noConflict()` - (browser only) to reset global 'uuid' var**
	    uuid.noConflict = function() {
	      _window.uuid = _previousRoot;
	      return uuid;
	    };
	
	    _window.uuid = uuid;
	  }
	})('undefined' !== typeof window ? window : null);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(29)
	var ieee754 = __webpack_require__(30)
	var isArray = __webpack_require__(31)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer, (function() { return this; }())))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 30 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var rng = __webpack_require__(33)
	
	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}
	
	exports.createHash = __webpack_require__(35)
	
	exports.createHmac = __webpack_require__(47)
	
	exports.randomBytes = function(size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)))
	    } catch (err) { callback(err) }
	  } else {
	    return new Buffer(rng(size))
	  }
	}
	
	function each(a, f) {
	  for(var i in a)
	    f(a[i], i)
	}
	
	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160']
	}
	
	var p = __webpack_require__(48)(exports)
	exports.pbkdf2 = p.pbkdf2
	exports.pbkdf2Sync = p.pbkdf2Sync
	
	
	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials'
	, 'createCipher'
	, 'createCipheriv'
	, 'createDecipher'
	, 'createDecipheriv'
	, 'createSign'
	, 'createVerify'
	, 'createDiffieHellman'
	], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet')
	  }
	})
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {(function() {
	  var g = ('undefined' === typeof window ? global : window) || {}
	  _crypto = (
	    g.crypto || g.msCrypto || __webpack_require__(34)
	  )
	  module.exports = function(size) {
	    // Modern Browsers
	    if(_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */
	    
	      _crypto.getRandomValues(bytes);
	      return bytes;
	    }
	    else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size)
	    }
	    else
	      throw new Error(
	        'secure random number generation not supported by this browser\n'+
	        'use chrome, FireFox or Internet Explorer 11'
	      )
	  }
	}())
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(28).Buffer))

/***/ },
/* 34 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(36)
	
	var md5 = toConstructor(__webpack_require__(44))
	var rmd160 = toConstructor(__webpack_require__(46))
	
	function toConstructor (fn) {
	  return function () {
	    var buffers = []
	    var m= {
	      update: function (data, enc) {
	        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
	        buffers.push(data)
	        return this
	      },
	      digest: function (enc) {
	        var buf = Buffer.concat(buffers)
	        var r = fn(buf)
	        buffers = null
	        return enc ? r.toString(enc) : r
	      }
	    }
	    return m
	  }
	}
	
	module.exports = function (alg) {
	  if('md5' === alg) return new md5()
	  if('rmd160' === alg) return new rmd160()
	  return createHash(alg)
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var exports = module.exports = function (alg) {
	  var Alg = exports[alg]
	  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
	  return new Alg()
	}
	
	var Buffer = __webpack_require__(28).Buffer
	var Hash   = __webpack_require__(37)(Buffer)
	
	exports.sha1 = __webpack_require__(38)(Buffer, Hash)
	exports.sha256 = __webpack_require__(42)(Buffer, Hash)
	exports.sha512 = __webpack_require__(43)(Buffer, Hash)


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function (Buffer) {
	
	  //prototype class for hash functions
	  function Hash (blockSize, finalSize) {
	    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize
	    this._blockSize = blockSize
	    this._len = 0
	    this._s = 0
	  }
	
	  Hash.prototype.init = function () {
	    this._s = 0
	    this._len = 0
	  }
	
	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8"
	      data = new Buffer(data, enc)
	    }
	
	    var l = this._len += data.length
	    var s = this._s = (this._s || 0)
	    var f = 0
	    var buffer = this._block
	
	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
	      var ch = (t - f)
	
	      for (var i = 0; i < ch; i++) {
	        buffer[(s % this._blockSize) + i] = data[i + f]
	      }
	
	      s += ch
	      f += ch
	
	      if ((s % this._blockSize) === 0) {
	        this._update(buffer)
	      }
	    }
	    this._s = s
	
	    return this
	  }
	
	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8
	
	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80
	
	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1)
	
	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block)
	      this._block.fill(0)
	    }
	
	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4)
	
	    var hash = this._update(this._block) || this._hash()
	
	    return enc ? hash.toString(enc) : hash
	  }
	
	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass')
	  }
	
	  return Hash
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */
	
	var inherits = __webpack_require__(39).inherits
	
	module.exports = function (Buffer, Hash) {
	
	  var A = 0|0
	  var B = 4|0
	  var C = 8|0
	  var D = 12|0
	  var E = 16|0
	
	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80)
	
	  var POOL = []
	
	  function Sha1 () {
	    if(POOL.length)
	      return POOL.pop().init()
	
	    if(!(this instanceof Sha1)) return new Sha1()
	    this._w = W
	    Hash.call(this, 16*4, 14*4)
	
	    this._h = null
	    this.init()
	  }
	
	  inherits(Sha1, Hash)
	
	  Sha1.prototype.init = function () {
	    this._a = 0x67452301
	    this._b = 0xefcdab89
	    this._c = 0x98badcfe
	    this._d = 0x10325476
	    this._e = 0xc3d2e1f0
	
	    Hash.prototype.init.call(this)
	    return this
	  }
	
	  Sha1.prototype._POOL = POOL
	  Sha1.prototype._update = function (X) {
	
	    var a, b, c, d, e, _a, _b, _c, _d, _e
	
	    a = _a = this._a
	    b = _b = this._b
	    c = _c = this._c
	    d = _d = this._d
	    e = _e = this._e
	
	    var w = this._w
	
	    for(var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j*4)
	        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)
	
	      var t = add(
	        add(rol(a, 5), sha1_ft(j, b, c, d)),
	        add(add(e, W), sha1_kt(j))
	      )
	
	      e = d
	      d = c
	      c = rol(b, 30)
	      b = a
	      a = t
	    }
	
	    this._a = add(a, _a)
	    this._b = add(b, _b)
	    this._c = add(c, _c)
	    this._d = add(d, _d)
	    this._e = add(e, _e)
	  }
	
	  Sha1.prototype._hash = function () {
	    if(POOL.length < 100) POOL.push(this)
	    var H = new Buffer(20)
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a|0, A)
	    H.writeInt32BE(this._b|0, B)
	    H.writeInt32BE(this._c|0, C)
	    H.writeInt32BE(this._d|0, D)
	    H.writeInt32BE(this._e|0, E)
	    return H
	  }
	
	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if(t < 20) return (b & c) | ((~b) & d);
	    if(t < 40) return b ^ c ^ d;
	    if(t < 60) return (b & c) | (b & d) | (c & d);
	    return b ^ c ^ d;
	  }
	
	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	           (t < 60) ? -1894007588 : -899497514;
	  }
	
	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return (x + y ) | 0
	  //lets see how this goes on testling.
	  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  //  return (msw << 16) | (lsw & 0xFFFF);
	  }
	
	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt));
	  }
	
	  return Sha1
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(40);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(41);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 41 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */
	
	var inherits = __webpack_require__(39).inherits
	
	module.exports = function (Buffer, Hash) {
	
	  var K = [
	      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	    ]
	
	  var W = new Array(64)
	
	  function Sha256() {
	    this.init()
	
	    this._w = W //new Array(64)
	
	    Hash.call(this, 16*4, 14*4)
	  }
	
	  inherits(Sha256, Hash)
	
	  Sha256.prototype.init = function () {
	
	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0
	
	    this._len = this._s = 0
	
	    return this
	  }
	
	  function S (X, n) {
	    return (X >>> n) | (X << (32 - n));
	  }
	
	  function R (X, n) {
	    return (X >>> n);
	  }
	
	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }
	
	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }
	
	  function Sigma0256 (x) {
	    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	  }
	
	  function Sigma1256 (x) {
	    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	  }
	
	  function Gamma0256 (x) {
	    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	  }
	
	  function Gamma1256 (x) {
	    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	  }
	
	  Sha256.prototype._update = function(M) {
	
	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var T1, T2
	
	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0
	
	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16
	        ? M.readInt32BE(j * 4)
	        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]
	
	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w
	
	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
	    }
	
	    this._a = (a + this._a) | 0
	    this._b = (b + this._b) | 0
	    this._c = (c + this._c) | 0
	    this._d = (d + this._d) | 0
	    this._e = (e + this._e) | 0
	    this._f = (f + this._f) | 0
	    this._g = (g + this._g) | 0
	    this._h = (h + this._h) | 0
	
	  };
	
	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32)
	
	    H.writeInt32BE(this._a,  0)
	    H.writeInt32BE(this._b,  4)
	    H.writeInt32BE(this._c,  8)
	    H.writeInt32BE(this._d, 12)
	    H.writeInt32BE(this._e, 16)
	    H.writeInt32BE(this._f, 20)
	    H.writeInt32BE(this._g, 24)
	    H.writeInt32BE(this._h, 28)
	
	    return H
	  }
	
	  return Sha256
	
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(39).inherits
	
	module.exports = function (Buffer, Hash) {
	  var K = [
	    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	  ]
	
	  var W = new Array(160)
	
	  function Sha512() {
	    this.init()
	    this._w = W
	
	    Hash.call(this, 128, 112)
	  }
	
	  inherits(Sha512, Hash)
	
	  Sha512.prototype.init = function () {
	
	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0
	
	    this._al = 0xf3bcc908|0
	    this._bl = 0x84caa73b|0
	    this._cl = 0xfe94f82b|0
	    this._dl = 0x5f1d36f1|0
	    this._el = 0xade682d1|0
	    this._fl = 0x2b3e6c1f|0
	    this._gl = 0xfb41bd6b|0
	    this._hl = 0x137e2179|0
	
	    this._len = this._s = 0
	
	    return this
	  }
	
	  function S (X, Xl, n) {
	    return (X >>> n) | (Xl << (32 - n))
	  }
	
	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }
	
	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }
	
	  Sha512.prototype._update = function(M) {
	
	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var al, bl, cl, dl, el, fl, gl, hl
	
	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0
	
	    al = this._al | 0
	    bl = this._bl | 0
	    cl = this._cl | 0
	    dl = this._dl | 0
	    el = this._el | 0
	    fl = this._fl | 0
	    gl = this._gl | 0
	    hl = this._hl | 0
	
	    for (var i = 0; i < 80; i++) {
	      var j = i * 2
	
	      var Wi, Wil
	
	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4)
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4)
	
	      } else {
	        var x  = W[j - 15*2]
	        var xl = W[j - 15*2 + 1]
	        var gamma0  = S(x, xl, 1) ^ S(x, xl, 8) ^ (x >>> 7)
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7)
	
	        x  = W[j - 2*2]
	        xl = W[j - 2*2 + 1]
	        var gamma1  = S(x, xl, 19) ^ S(xl, x, 29) ^ (x >>> 6)
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6)
	
	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7  = W[j - 7*2]
	        var Wi7l = W[j - 7*2 + 1]
	
	        var Wi16  = W[j - 16*2]
	        var Wi16l = W[j - 16*2 + 1]
	
	        Wil = gamma0l + Wi7l
	        Wi  = gamma0  + Wi7 + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0)
	        Wil = Wil + gamma1l
	        Wi  = Wi  + gamma1  + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0)
	        Wil = Wil + Wi16l
	        Wi  = Wi  + Wi16 + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0)
	
	        W[j] = Wi
	        W[j + 1] = Wil
	      }
	
	      var maj = Maj(a, b, c)
	      var majl = Maj(al, bl, cl)
	
	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7)
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7)
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9)
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9)
	
	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j]
	      var Kil = K[j + 1]
	
	      var ch = Ch(e, f, g)
	      var chl = Ch(el, fl, gl)
	
	      var t1l = hl + sigma1l
	      var t1 = h + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0)
	      t1l = t1l + chl
	      t1 = t1 + ch + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0)
	      t1l = t1l + Kil
	      t1 = t1 + Ki + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0)
	      t1l = t1l + Wil
	      t1 = t1 + Wi + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0)
	
	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl
	      var t2 = sigma0h + maj + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0)
	
	      h  = g
	      hl = gl
	      g  = f
	      gl = fl
	      f  = e
	      fl = el
	      el = (dl + t1l) | 0
	      e  = (d + t1 + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	      d  = c
	      dl = cl
	      c  = b
	      cl = bl
	      b  = a
	      bl = al
	      al = (t1l + t2l) | 0
	      a  = (t1 + t2 + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0
	    }
	
	    this._al = (this._al + al) | 0
	    this._bl = (this._bl + bl) | 0
	    this._cl = (this._cl + cl) | 0
	    this._dl = (this._dl + dl) | 0
	    this._el = (this._el + el) | 0
	    this._fl = (this._fl + fl) | 0
	    this._gl = (this._gl + gl) | 0
	    this._hl = (this._hl + hl) | 0
	
	    this._a = (this._a + a + ((this._al >>> 0) < (al >>> 0) ? 1 : 0)) | 0
	    this._b = (this._b + b + ((this._bl >>> 0) < (bl >>> 0) ? 1 : 0)) | 0
	    this._c = (this._c + c + ((this._cl >>> 0) < (cl >>> 0) ? 1 : 0)) | 0
	    this._d = (this._d + d + ((this._dl >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	    this._e = (this._e + e + ((this._el >>> 0) < (el >>> 0) ? 1 : 0)) | 0
	    this._f = (this._f + f + ((this._fl >>> 0) < (fl >>> 0) ? 1 : 0)) | 0
	    this._g = (this._g + g + ((this._gl >>> 0) < (gl >>> 0) ? 1 : 0)) | 0
	    this._h = (this._h + h + ((this._hl >>> 0) < (hl >>> 0) ? 1 : 0)) | 0
	  }
	
	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64)
	
	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset)
	      H.writeInt32BE(l, offset + 4)
	    }
	
	    writeInt64BE(this._a, this._al, 0)
	    writeInt64BE(this._b, this._bl, 8)
	    writeInt64BE(this._c, this._cl, 16)
	    writeInt64BE(this._d, this._dl, 24)
	    writeInt64BE(this._e, this._el, 32)
	    writeInt64BE(this._f, this._fl, 40)
	    writeInt64BE(this._g, this._gl, 48)
	    writeInt64BE(this._h, this._hl, 56)
	
	    return H
	  }
	
	  return Sha512
	
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	
	var helpers = __webpack_require__(45);
	
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << ((len) % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;
	
	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;
	
	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	
	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
	
	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
	
	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
	
	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
	
	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);
	
	}
	
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}
	
	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var intSize = 4;
	var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
	var chrsz = 8;
	
	function toArray(buf, bigEndian) {
	  if ((buf.length % intSize) !== 0) {
	    var len = buf.length + (intSize - (buf.length % intSize));
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }
	
	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}
	
	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}
	
	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}
	
	module.exports = { hash: hash };
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	module.exports = ripemd160
	
	
	
	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	
	// Constants table
	var zl = [
	    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
	var zr = [
	    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
	var sl = [
	     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
	var sr = [
	    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];
	
	var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];
	
	var bytesToWords = function (bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << (24 - b % 32);
	  }
	  return words;
	};
	
	var wordsToBytes = function (words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	  }
	  return bytes;
	};
	
	var processBlock = function (H, M, offset) {
	
	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];
	
	    // Swap
	    M[offset_i] = (
	        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	    );
	  }
	
	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;
	
	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = (al +  M[offset+zl[i]])|0;
	    if (i<16){
	        t +=  f1(bl,cl,dl) + hl[0];
	    } else if (i<32) {
	        t +=  f2(bl,cl,dl) + hl[1];
	    } else if (i<48) {
	        t +=  f3(bl,cl,dl) + hl[2];
	    } else if (i<64) {
	        t +=  f4(bl,cl,dl) + hl[3];
	    } else {// if (i<80) {
	        t +=  f5(bl,cl,dl) + hl[4];
	    }
	    t = t|0;
	    t =  rotl(t,sl[i]);
	    t = (t+el)|0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;
	
	    t = (ar + M[offset+zr[i]])|0;
	    if (i<16){
	        t +=  f5(br,cr,dr) + hr[0];
	    } else if (i<32) {
	        t +=  f4(br,cr,dr) + hr[1];
	    } else if (i<48) {
	        t +=  f3(br,cr,dr) + hr[2];
	    } else if (i<64) {
	        t +=  f2(br,cr,dr) + hr[3];
	    } else {// if (i<80) {
	        t +=  f1(br,cr,dr) + hr[4];
	    }
	    t = t|0;
	    t =  rotl(t,sr[i]) ;
	    t = (t+er)|0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t    = (H[1] + cl + dr)|0;
	  H[1] = (H[2] + dl + er)|0;
	  H[2] = (H[3] + el + ar)|0;
	  H[3] = (H[4] + al + br)|0;
	  H[4] = (H[0] + bl + cr)|0;
	  H[0] =  t;
	};
	
	function f1(x, y, z) {
	  return ((x) ^ (y) ^ (z));
	}
	
	function f2(x, y, z) {
	  return (((x)&(y)) | ((~x)&(z)));
	}
	
	function f3(x, y, z) {
	  return (((x) | (~(y))) ^ (z));
	}
	
	function f4(x, y, z) {
	  return (((x) & (z)) | ((y)&(~(z))));
	}
	
	function f5(x, y, z) {
	  return ((x) ^ ((y) |(~(z))));
	}
	
	function rotl(x,n) {
	  return (x<<n) | (x>>>(32-n));
	}
	
	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
	
	  if (typeof message == 'string')
	    message = new Buffer(message, 'utf8');
	
	  var m = bytesToWords(message);
	
	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;
	
	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	  );
	
	  for (var i=0 ; i<m.length; i += 16) {
	    processBlock(H, m, i);
	  }
	
	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	      // Shortcut
	    var H_i = H[i];
	
	    // Swap
	    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	  }
	
	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(35)
	
	var zeroBuffer = new Buffer(128)
	zeroBuffer.fill(0)
	
	module.exports = Hmac
	
	function Hmac (alg, key) {
	  if(!(this instanceof Hmac)) return new Hmac(alg, key)
	  this._opad = opad
	  this._alg = alg
	
	  var blocksize = (alg === 'sha512') ? 128 : 64
	
	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key
	
	  if(key.length > blocksize) {
	    key = createHash(alg).update(key).digest()
	  } else if(key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize)
	  }
	
	  var ipad = this._ipad = new Buffer(blocksize)
	  var opad = this._opad = new Buffer(blocksize)
	
	  for(var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36
	    opad[i] = key[i] ^ 0x5C
	  }
	
	  this._hash = createHash(alg).update(ipad)
	}
	
	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc)
	  return this
	}
	
	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest()
	  return createHash(this._alg).update(this._opad).update(h).digest(enc)
	}
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var pbkdf2Export = __webpack_require__(49)
	
	module.exports = function (crypto, exports) {
	  exports = exports || {}
	
	  var exported = pbkdf2Export(crypto)
	
	  exports.pbkdf2 = exported.pbkdf2
	  exports.pbkdf2Sync = exported.pbkdf2Sync
	
	  return exports
	}


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function(crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest
	      digest = undefined
	    }
	
	    if ('function' !== typeof callback)
	      throw new Error('No callback provided to pbkdf2')
	
	    setTimeout(function() {
	      var result
	
	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest)
	      } catch (e) {
	        return callback(e)
	      }
	
	      callback(undefined, result)
	    })
	  }
	
	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations)
	      throw new TypeError('Iterations not a number')
	
	    if (iterations < 0)
	      throw new TypeError('Bad iterations')
	
	    if ('number' !== typeof keylen)
	      throw new TypeError('Key length not a number')
	
	    if (keylen < 0)
	      throw new TypeError('Bad key length')
	
	    digest = digest || 'sha1'
	
	    if (!Buffer.isBuffer(password)) password = new Buffer(password)
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)
	
	    var hLen, l = 1, r, T
	    var DK = new Buffer(keylen)
	    var block1 = new Buffer(salt.length + 4)
	    salt.copy(block1, 0, 0, salt.length)
	
	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length)
	
	      var U = crypto.createHmac(digest, password).update(block1).digest()
	
	      if (!hLen) {
	        hLen = U.length
	        T = new Buffer(hLen)
	        l = Math.ceil(keylen / hLen)
	        r = keylen - (l - 1) * hLen
	
	        if (keylen > (Math.pow(2, 32) - 1) * hLen)
	          throw new TypeError('keylen exceeds maximum length')
	      }
	
	      U.copy(T, 0, 0, hLen)
	
	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest()
	
	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k]
	        }
	      }
	
	      var destPos = (i - 1) * hLen
	      var len = (i == l ? r : hLen)
	      T.copy(DK, destPos, 0, len)
	    }
	
	    return DK
	  }
	
	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28).Buffer))

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOThmNGQ3ZTllOWUyNjNmMGI3MGEiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvdmlld2VyLmpzIiwid2VicGFjazovLy8uL34vaW52YXJpYW50L2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL2phdmFzY3JpcHRzL2RvbS9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvZG9tL2VsZW1lbnRjYWNoZS5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvY2hhcm1lYXN1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvdmlld2VyL3VzZXJpbnRlcmZhY2UuanMiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvaW5wdXQvbW91c2V0cmFwLmpzIiwid2VicGFjazovLy8uL2phdmFzY3JpcHRzL2dlb21ldHJ5L3ZlY3RvcjJkLmpzIiwid2VicGFjazovLy8uL2phdmFzY3JpcHRzL2dlb21ldHJ5L3V0aWxzLmpzIiwid2VicGFjazovLy8uL34vdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwid2VicGFjazovLy8uL2phdmFzY3JpcHRzL2dlb21ldHJ5L2xpbmUyZC5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy9nZW9tZXRyeS9pbnRlcnNlY3Rpb24yZC5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy9nZW9tZXRyeS9ib3gyZC5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvc3RhdHVzLWJhci5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL3NlcXVlbmNlLXJvdy5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL3NlcGFyYXRvci1zZXF1ZW5jZS1yb3cuanMiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvdmlld2VyL3Jvdy10eXBlcy9yZXZlcnNlLXNlcXVlbmNlLXJvdy5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL2Jsb2NrLXNlcXVlbmNlLXJvdy5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL3J1bGVyLXJvdy5qcyIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL2Fubm90YXRpb24tcm93LmpzIiwid2VicGFjazovLy8uL3N0eWxlcy92aWV3ZXIuY3NzP2Y0MTAiLCJ3ZWJwYWNrOi8vLy4vc3R5bGVzL3ZpZXdlci5jc3MiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdHMvdmlld2VyL2Fubm90YXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9ub2RlLXV1aWQvdXVpZC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL34vYmFzZTY0LWpzL2xpYi9iNjQuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL34vaWVlZTc1NC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9idWZmZXIvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsIndlYnBhY2s6Ly8vY3J5cHRvIChpZ25vcmVkKSIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9jcmVhdGUtaGFzaC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9oYXNoLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL3NoYTEuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvfi9zaGEuanMvc2hhMjU2LmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL3NoYTUxMi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9tZDUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3JpcGVtZDE2MC9saWIvcmlwZW1kMTYwLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L2NyZWF0ZS1obWFjLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L3Bia2RmMi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3Bia2RmMi1jb21wYXQvcGJrZGYyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxLQUFJLGVBQUo7QUFDQSxLQUFJLG9CQUFKOztBQUVBLFVBQVMsOEJBQVQsR0FBMEM7O0FBRXhDLE9BQUksU0FBUyxFQUFiO0FBQ0EsT0FBSSxjQUFjLEVBQWxCO0FBQ0EsT0FBTSxvQkFBb0IsT0FBTyxXQUFQLENBQW1CLEdBQW5CLENBQXVCLEtBQXZCLENBQTZCLGtCQUE3QixFQUExQjs7QUFFQSxPQUFJLGlCQUFKLEVBQXVCO0FBQ3JCLHVCQUFrQixPQUFsQixDQUEwQixpQkFBUzs7QUFFakM7QUFDQSxhQUFNLFFBQU4sQ0FBZSxXQUFmLENBQTJCLE9BQTNCLENBQW1DLDRCQUFvQjtBQUNyRCxxQkFBWSxJQUFaLENBQWlCLHlCQUFlLGdCQUFmLEVBQWlD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QTtBQUNBO0FBQ0EsOEJBQTZCLGdCQUFnQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFvRDtBQUNwRCxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQztBQUMxQyxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2REFBNEQsWUFBWTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBOEMsWUFBWTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQThDLFlBQVk7QUFDMUQ7QUFDQTtBQUNBLHNCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLFlBQVk7QUFDekQ7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVksOEJBQThCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBc0Q7QUFDdEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFxQixjQUFjO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQixZQUFZO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPLGVBQWU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBcUIsZUFBZTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0EsMEJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSw2Q0FBNEMsbUJBQW1CO0FBQy9EO0FBQ0E7QUFDQSwwQ0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQTZFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QSxJQUFHO0FBQ0g7QUFDQSxtREFBdUIsYUFBYTs7O0FBR3BDLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7O0FDL1FEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBZ0Isb0NBQW9DO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWEsaUJBQWlCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWdELEVBQUU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFtQiw2QkFBNkI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxvQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0RBQXVELE9BQU87QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF1RCxPQUFPO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLGdCQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxtQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxvQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0Esd0NBQXVDLFNBQVM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFpQixZQUFZO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLGdCQUFnQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzNnREE7O0FBRUEsRUFBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBaUQsWUFBWTtBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQyw2QkFBcUQ7Ozs7Ozs7QUMzSHREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFRLFdBQVc7O0FBRW5CO0FBQ0E7QUFDQTtBQUNBLFNBQVEsV0FBVzs7QUFFbkI7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVEsV0FBVzs7QUFFbkI7QUFDQTtBQUNBLFNBQVEsVUFBVTs7QUFFbEI7QUFDQTs7Ozs7OztBQ25GQSxrQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTs7Ozs7OztBQ0pBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLLGNBQWM7QUFDbkIsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7O0FDcEREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7O0FDekJELGdCOzs7Ozs7QUNBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ1hBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCLFFBQVE7QUFDN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxtQkFBa0IsUUFBUTtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCx3QkFBdUIsU0FBUztBQUNoQztBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBNEMsS0FBSzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLG9DQUFtQyxPQUFPO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSwwREFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1gsVUFBUztBQUNUO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFNBQVM7QUFDcEI7QUFDQSxZQUFXLFNBQVM7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7OztBQ3prQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGFBQVksT0FBTyxPQUFPLFlBQVksT0FBTyxPQUFPLE9BQU87QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xKQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixRQUFRO0FBQzNCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFnQixjQUFjO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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RUE7QUFDQTs7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixRQUFRO0FBQzNCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNCQUFxQixnQkFBZ0I7QUFDckM7O0FBRUEsd0JBQXVCLFVBQVU7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIuLi9nZW5vbWUtZGVzaWduZXIvZXh0ZW5zaW9ucy9zZXF1ZW5jZS12aWV3ZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDk4ZjRkN2U5ZTllMjYzZjBiNzBhXG4gKiovIiwiaW1wb3J0IFNlcXVlbmNlVmlld2VyIGZyb20gJy4vdmlld2VyL3ZpZXdlcic7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgQW5ub3RhdGlvbiBmcm9tICcuL3ZpZXdlci9hbm5vdGF0aW9uJztcblxubGV0IHZpZXdlcjtcbmxldCB1bnN1YnNjcmliZTtcblxuZnVuY3Rpb24gZ2V0RGlzcGxheUJsb2Nrc0FuZEFubm90YXRpb25zKCkge1xuXG4gIGxldCBibG9ja3MgPSBbXTtcbiAgbGV0IGFubm90YXRpb25zID0gW107XG4gIGNvbnN0IHRvcFNlbGVjdGVkQmxvY2tzID0gd2luZG93LmNvbnN0cnVjdG9yLmFwaS5mb2N1cy5mb2N1c0dldEJsb2NrUmFuZ2UoKTtcblxuICBpZiAodG9wU2VsZWN0ZWRCbG9ja3MpIHtcbiAgICB0b3BTZWxlY3RlZEJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcblxuICAgICAgLy8gbWFwIHRoZSBhbm5vdGF0aW9ucyB0byBhIGxpdHRsZSB3cmFwcGVyIG9iamVjdFxuICAgICAgYmxvY2suc2VxdWVuY2UuYW5ub3RhdGlvbnMuZm9yRWFjaChuYXRpdmVBbm5vdGF0aW9uID0+IHtcbiAgICAgICAgYW5ub3RhdGlvbnMucHVzaChuZXcgQW5ub3RhdGlvbihuYXRpdmVBbm5vdGF0aW9uLCBibG9jaykpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gd2luZG93LmNvbnN0cnVjdG9yLmFwaS5ibG9ja3MuYmxvY2tGbGF0dGVuQ29uc3RydWN0QW5kTGlzdHMoYmxvY2suaWQpO1xuICAgICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBub2RlIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKG5vZGUuY29tcG9uZW50cyAmJiBub2RlLmNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBibG9ja3MucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge2Jsb2NrcywgYW5ub3RhdGlvbnN9O1xufVxuXG5mdW5jdGlvbiBleHRlbnNpb25DbG9zZWQoKSB7XG4gIGlmICh2aWV3ZXIpIHtcbiAgICB1bnN1YnNjcmliZSgpO1xuICAgIHVuc3Vic2NyaWJlID0gbnVsbDtcbiAgICB2aWV3ZXIuZGlzcG9zZSgpO1xuICAgIHZpZXdlciA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyKGNvbnRhaW5lciwgb3B0aW9ucykge1xuXG4gIC8vIHVwZGF0ZSB0aGUgdmlld2VyXG4gIGNvbnN0IHVwZGF0ZVZpZXdlciA9IChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHtibG9ja3MsIGFubm90YXRpb25zfSA9IGdldERpc3BsYXlCbG9ja3NBbmRBbm5vdGF0aW9ucygpO1xuICAgIHZpZXdlci5uZXdEYXRhU2V0KGJsb2NrcywgYW5ub3RhdGlvbnMsIHN0YXRlKTtcbiAgICB2aWV3ZXIucmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gY3JlYXRlIHZpZXdlclxuICBpbnZhcmlhbnQoIXZpZXdlciwgJ3RoZSB2aWV3ZXIgc2hvdWxkIG9ubHkgYmUgY3JlYXRlZCBvbmNlJyk7XG4gIHZpZXdlciA9IG5ldyBTZXF1ZW5jZVZpZXdlcih7XG4gICAgcGFyZW50OiBjb250YWluZXIsXG4gIH0pO1xuXG4gIC8vIGluaXRpYWxpemUgd2l0aCBjdXJyZW50IHN0YXRlIG9mIGFwcFxuICB1cGRhdGVWaWV3ZXIod2luZG93LmNvbnN0cnVjdG9yLnN0b3JlLmdldFN0YXRlKCkpO1xuXG4gIC8vIHVwZGF0ZSB2aWV3ZXIgb24gdmFyaW91cyBldmVudCB3aGlsZSBzYXZpbmcgdGhlIHVuc3Vic2NyaWJlIGV2ZW50XG4gIHVuc3Vic2NyaWJlID0gd2luZG93LmNvbnN0cnVjdG9yLnN0b3JlLnN1YnNjcmliZSgoc3RhdGUsIGxhc3RBY3Rpb24pID0+IHtcbiAgICBpZiAoW1xuICAgICAgICAnRk9DVVNfQkxPQ0tTJyxcbiAgICAgICAgJ0JMT0NLX1NFVF9DT0xPUicsXG4gICAgICAgICdCTE9DS19SRU5BTUUnLFxuICAgICAgICAnRk9DVVNfQkxPQ0tfT1BUSU9OJyxcbiAgICAgICAgJ0ZPQ1VTX0ZPUkNFX0JMT0NLUycsXG4gICAgICAgICdCTE9DS19TRVRfU0VRVUVOQ0UnXS5pbmNsdWRlcyhsYXN0QWN0aW9uLnR5cGUpKSB7XG5cbiAgICAgIHVwZGF0ZVZpZXdlcihzdGF0ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGV4dGVuc2lvbkNsb3NlZDtcbn1cblxuXG4vLyBiaW5kIHRoaXMgZXh0ZW5zaW9uLCBieSBuYW1lLCB0byBpdHMgcmVuZGVyIGZ1bmN0aW9uXG53aW5kb3cuY29uc3RydWN0b3IuZXh0ZW5zaW9ucy5yZWdpc3Rlcignc2VxdWVuY2Utdmlld2VyJywgcmVuZGVyKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdHMvbWFpbi5qc1xuICoqLyIsImltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCBEIGZyb20gJy4uL2RvbS9kb20nO1xuaW1wb3J0IEVsZW1lbnRDYWNoZSBmcm9tICcuLi9kb20vZWxlbWVudGNhY2hlJztcbmltcG9ydCB7Y2hhck1lYXN1cmV9IGZyb20gJy4vY2hhcm1lYXN1cmUnO1xuaW1wb3J0IFVzZXJJbnRlcmZhY2UgZnJvbSAnLi91c2VyaW50ZXJmYWNlJztcbmltcG9ydCBWZWN0b3IyRCBmcm9tICcuLi9nZW9tZXRyeS92ZWN0b3IyZCc7XG5pbXBvcnQgQm94MkQgZnJvbSAnLi4vZ2VvbWV0cnkvYm94MmQnO1xuaW1wb3J0IHJlbmRlclNlcXVlbmNlUm93IGZyb20gJy4vcm93LXR5cGVzL3NlcXVlbmNlLXJvdyc7XG5pbXBvcnQgcmVuZGVyU2VwYXJhdG9yU2VxdWVuY2VSb3cgZnJvbSAnLi9yb3ctdHlwZXMvc2VwYXJhdG9yLXNlcXVlbmNlLXJvdyc7XG5pbXBvcnQgcmVuZGVyUmV2ZXJzZVNlcXVlbmNlUm93IGZyb20gJy4vcm93LXR5cGVzL3JldmVyc2Utc2VxdWVuY2Utcm93JztcbmltcG9ydCByZW5kZXJCbG9ja1NlcXVlbmNlUm93IGZyb20gJy4vcm93LXR5cGVzL2Jsb2NrLXNlcXVlbmNlLXJvdyc7XG5pbXBvcnQgcmVuZGVyU2VxdWVuY2VSdWxlciBmcm9tICcuL3Jvdy10eXBlcy9ydWxlci1yb3cnO1xuaW1wb3J0IHJlbmRlckFubm90YXRpb24gZnJvbSAnLi9yb3ctdHlwZXMvYW5ub3RhdGlvbi1yb3cnO1xuXG5pbXBvcnQgJy4uLy4uL3N0eWxlcy92aWV3ZXIuY3NzJztcblxuLyoqXG4gKiB1c2VkIHRvIHRyYWNrIHJlbmRlciBjeWNsZXMuIEl0IGlzIGluY3JlbWVudGVkIGVhY2ggdGltZSByZW5kZXIgaXMgY2FsbGVkLiBSb3dzIHdoaWNoXG4gKiBhcmUgbm90IHRvdWNoZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyIGN5Y2xlIGFyZSByZW1vdmVkIGZyb20gdGhlIERPTVxuICogQHR5cGUge251bWJlcn1cbiAqL1xubGV0IHJlbmRlckN5Y2xlID0gMDtcblxuLyoqXG4gKiBjaGFyYWN0ZXIgbWFwIGZvciBnZW5lcmF0aW5nIHRoZSByZXZlcnNlIHN0cmFuZFxuICogQHR5cGUge3thOiBzdHJpbmcsIHQ6IHN0cmluZywgZzogc3RyaW5nLCBjOiBzdHJpbmd9fVxuICovXG5jb25zdCByZXZlcnNlTWFwID0ge1xuICAnYSc6ICd0JyxcbiAgJ3QnOiAnYScsXG4gICdnJzogJ2MnLFxuICAnYyc6ICdnJyxcbiAgJ0EnOiAnVCcsXG4gICdUJzogJ0EnLFxuICAnRyc6ICdDJyxcbiAgJ0MnOiAnRycsXG59O1xuXG4vKipcbiAqIHNlcXVlbmNlIHZpZXdlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXF1ZW5jZVZpZXdlciB7XG5cbiAgLy8gY29uc3RydWN0b3Igc2F2ZXMgb3B0aW9ucyBhbmQgc2V0dXBzIGJhc2ljIC8gZW1wdHkgY29udGFpbmVyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIC8vIHNldHVwIGRlZmF1bHQgb3B0aW9uIHdpdGggb3ZlcnJpZGVzIHN1cHBsaWVkIGJ5IGNhbGxlclxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcGFyZW50IDogbnVsbCxcbiAgICAgIHJldmVyc2U6IHRydWUsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyBlbXB0eSBibG9jayBjb250ZW50cyBhbmQgYXNzb2NpYXRlZCByZXZlcnNlIHN0cmFuZFxuICAgIHRoaXMuZW1wdHlCbG9ja1N0ciA9ICcgZW1wdHkgYmxvY2sgJztcbiAgICB0aGlzLmVtcHR5QmxvY2tSZXZlcnNlU3RyID0gJy0nLnJlcGVhdCh0aGlzLmVtcHR5QmxvY2tTdHIubGVuZ3RoKTtcblxuICAgIC8vIHNlcXVlbmNlIGNhY2hlLCBrZXkgPSBibG9jay5pZFxuICAgIHRoaXMuc2VxdWVuY2VDYWNoZSA9IHt9O1xuXG4gICAgLy8gc2V0IGJhc2ljIGVtcHR5IERPTSBzdHJ1Y3R1cmVcbiAgICB0aGlzLmZhYnJpYygpO1xuICAgIC8vIHNpemUgdG8gY3VycmVudCB3aW5kb3csIHJlbGF5b3V0IGFuZCByZW5kZXJcbiAgICB0aGlzLnJlc2l6ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB3ZSBhcmUgYmVpbmcgcmVtb3ZlZCBmcm9tIHRoZSBhcHBcbiAgICovXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKCF0aGlzLmRpc3Bvc2VkKSB7XG4gICAgICB0aGlzLnVzZXJJbnRlcmZhY2UuZGlzcG9zZSgpO1xuICAgICAgdGhpcy51c2VySW50ZXJmYWNlID0gbnVsbDtcbiAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB3aGVuIGFza2VkIHRvIGRpc3BsYXkgbmV3IGJsb2Nrcy9jb25zdHJ1Y3QuIFRoaXMgcmVzZXRzIGV2ZXJ5dGhpbmdcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubmV3RGF0YVNldCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogcmVzZXQgdGhlIGVudGlyZSByb3cgY2FjaGVcbiAgICovXG4gIHJlc2V0Um93Q2FjaGUoKSB7XG4gICAgaWYgKCF0aGlzLnJvd0NhY2hlKSB7XG4gICAgICB0aGlzLnJvd0NhY2hlID0gbmV3IEVsZW1lbnRDYWNoZSgxMDAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm93Q2FjaGUuZW1wdHkoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdHJ1ZSBpZiBvdXIgY2xpZW50IGFyZWEgaXMgdG9vIHNtYWxsIHRvIGJlIHVzZWZ1bFxuICAgKi9cbiAgdG9vU21hbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93TGVuZ3RoIDwgMSB8fCB0aGlzLnJvd3NDb250YWluZXJCb3VuZHMud2lkdGggPCAxMCB8fCB0aGlzLnJvd3NDb250YWluZXJCb3VuZHMuaGVpZ2h0IDwgMTA7XG4gIH1cblxuICAvKipcbiAgICogY2FsbCB3aGVuZXZlciBvciBzaXplIGlzIGNoYW5nZWQuXG4gICAqL1xuICByZXNpemVkKCkge1xuICAgIC8vIHJlc2l6ZSBldmVudHMgY2FuIGJlIHNlbnQgYnkgdGhlIGFwcCBiZWZvcmUgd2UgaGF2ZSBhbnkgZGF0YSwgc28gcHJvdGVjdCBhZ2FpbnN0IHRoYXRcbiAgICBpZiAoIXRoaXMuYmxvY2tMaXN0KSB7XG4gICAgICB0aGlzLm5ld0RhdGFTZXQoKTtcbiAgICB9XG4gICAgLy8gcm93cyB3aWxsIGFsbCBjaGFuZ2Ugb24gc2l6ZSBjaGFuZ2Ugc28gcmVzZXQgd2l0aCBhIG5ldyBjYWNoZVxuICAgIHRoaXMucmVzZXRSb3dDYWNoZSgpO1xuICAgIC8vIGNhbGN1bGF0ZSByb3cgbGVuZ3RoIC8gYm91bmRzIGJhc2VkIG9uIGN1cnJlbnQgY2xpZW50IHNpemVcbiAgICB0aGlzLmNhbGN1bGF0ZVNpemVNZXRyaWNzKCk7XG4gICAgaWYgKCF0aGlzLnRvb1NtYWxsKCkpIHtcbiAgICAgIC8vIG1hcCBibG9ja3MgYW5kIGFubm90YXRpb25zIHRvIHJvd1xuICAgICAgdGhpcy5tYXBEYXRhU2V0KCk7XG4gICAgICAvLyBlbnN1cmUgZmlyc3RSb3cgaXMgc3RpbGwgdmFsaWRcbiAgICAgIHRoaXMuZmlyc3RSb3cgPSBNYXRoLm1pbih0aGlzLnJvd0xpc3QubGVuZ3RoIC0gMSwgdGhpcy5maXJzdFJvdyk7XG4gICAgICB0aGlzLnVzZXJJbnRlcmZhY2UudXBkYXRlU2VsZWN0aW9uKCk7XG4gICAgICAvLyBkcmF3XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjYWxjdWxhdGUgYm91bmRzIGFuZCByb3cgbGVuZ3RoIGJhc2VkIG9uIGN1cnJlbnQgc2l6ZVxuICAgKi9cbiAgY2FsY3VsYXRlU2l6ZU1ldHJpY3MoKSB7XG4gICAgLy8gY2FsY3VsYXRlIHJvdyBsZW5ndGggZm9yIHRoZSBuZXcgd2luZG93IHNpemVcbiAgICAgIHRoaXMucm93c0NvbnRhaW5lckJvdW5kcyA9IHRoaXMucm93c0NvbnRhaW5lci5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMucm93TGVuZ3RoID0gTWF0aC5mbG9vcih0aGlzLnJvd3NDb250YWluZXJCb3VuZHMud2lkdGggLyB0aGlzLmdldENoYXJXaWR0aCgpKTtcbiAgfVxuICAvKipcbiAgICogbnVtYmVyIG9mIGNvbXBsZXRlIG9yIHBhcnRpYWwgcm93cyB0aGF0IGFyZSB2aXNpYmxlXG4gICAqL1xuICByb3dzVmlzaWJsZSgpIHtcbiAgICAvLyBpZiBkYXRhIHNldCBpcyBlbXB0eSwgdGhlbiBubyByb3dzXG4gICAgaWYgKHRoaXMucm93TGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBsZXQgaW5kZXggPSB0aGlzLmZpcnN0Um93O1xuICAgIGxldCBoZWlnaHQgPSAwO1xuICAgIHdoaWxlIChoZWlnaHQgPCAodGhpcy5yb3dzQ29udGFpbmVyQm91bmRzLmhlaWdodCkgJiYgaW5kZXggPCB0aGlzLnJvd0xpc3QubGVuZ3RoKSB7XG4gICAgICBoZWlnaHQgKz0gdGhpcy5nZXRSb3dIZWlnaHQoaW5kZXgpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4IC0gdGhpcy5maXJzdFJvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGJvdW5kcyBvZiByb3csIG9yIGFuIGVtcHR5IGJveCBpZiB0aGUgcm93IGlzIG5vdCBjdXJyZW50bHkgdmlzaWJsZVxuICAgKi9cbiAgZ2V0Um93Qm91bmRzKGluZGV4KSB7XG4gICAgbGV0IGJveCA9IG5ldyBCb3gyRCgpO1xuICAgIGxldCB2aXNpYmxlID0gdGhpcy5yb3dzVmlzaWJsZSgpO1xuICAgIGxldCB5ID0gMDtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5maXJzdFJvdzsgaSA8IHRoaXMuZmlyc3RSb3cgKyB2aXNpYmxlOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZ2V0Um93SGVpZ2h0KGkpO1xuICAgICAgaWYgKGkgPT09IGluZGV4KSB7XG4gICAgICAgIGJveC55ID0geTtcbiAgICAgICAgYm94LndpZHRoID0gdGhpcy5nZXRDaGFyV2lkdGgoKSAqIHRoaXMucm93TGVuZ3RoO1xuICAgICAgICBib3guaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHkgKz0gaGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gYm94O1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgaW5kZXggb2YgdGhlIHJvdyBjb250YWluaW5nIHRoZSBnaXZlbiBjbGllbnQgeSBwb3NpdGlvbiAoMCA9PT0gdG9wIG9mIGNsaWVudCBhcmVhIClcbiAgICogUmV0dXJucyAtMSBpZiB5IGlzIG5vdCB3aXRoaW4gYSByb3dcbiAgICogQHBhcmFtIHkgLSBwaXhlbCBjb29yZGluYXRlIHJlbGF0aXZlIHRvIHdpbmRvd1xuICAgKi9cbiAgZ2V0Um93SW5kZXhGcm9tWSh5KSB7XG4gICAgaWYgKHkgPCAwKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGxldCB2aXNpYmxlID0gdGhpcy5yb3dzVmlzaWJsZSgpO1xuICAgIGxldCByb3dJbmRleCA9IHRoaXMuZmlyc3RSb3c7XG4gICAgbGV0IGN1cnJlbnRZID0gMDtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5maXJzdFJvdzsgaSA8IHRoaXMuZmlyc3RSb3cgKyB2aXNpYmxlOyBpICs9IDEpIHtcbiAgICAgIGN1cnJlbnRZICs9IHRoaXMuZ2V0Um93SGVpZ2h0KHJvd0luZGV4KTtcbiAgICAgIGlmICh5IDwgY3VycmVudFkpIHtcbiAgICAgICAgcmV0dXJuIHJvd0luZGV4O1xuICAgICAgfVxuICAgICAgcm93SW5kZXggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiBjb2x1bW4gY2xhbXBlZCB0byBsZW5ndGggb2YgZ2l2ZW4gcm93XG4gICAqIEBwYXJhbSB4IC0gcGl4ZWwgY29vcmRpbmF0ZSByZWxhdGl2ZSB0byBjbGllbnQgYXJlYVxuICAgKi9cbiAgZ2V0Q29sdW1uSW5kZXhGcm9tWCh4LCByb3cpIHtcbiAgICBsZXQgY29sdW1uID0gTWF0aC5mbG9vcih4IC8gdGhpcy5nZXRDaGFyV2lkdGgoKSk7XG4gICAgY29uc3QgcmVjb3JkcyA9IHRoaXMucm93TGlzdFtyb3ddLmJsb2NrUmVjb3JkcztcbiAgICBjb25zdCByZWNvcmQgPSByZWNvcmRzW3JlY29yZHMubGVuZ3RoIC0gMV07XG4gICAgaWYgKGNvbHVtbiA8IDAgfHwgY29sdW1uID49IHJlY29yZC5zdGFydFJvd09mZnNldCArIHJlY29yZC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbHVtbjtcbiAgfVxuXG4gIC8qKlxuICAgKiB3aWR0aCBvZiBmaXhlZCBwaXRjaCBmb250XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBnZXRDaGFyV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9udE1ldHJpY3MudztcbiAgfVxuXG4gIC8qKlxuICAgKiBoZWlnaHQgb2YgZml4ZWQgcGl0Y2ggZm9udFxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0Q2hhckhlaWdodCgpIHtcbiAgICByZXR1cm4gKHRoaXMuZm9udE1ldHJpY3MuaCAqIDEuMykgPj4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBoZWlnaHQgb2YgYSByb3csIGluY2x1ZGluZyB0aGUgdmFyaWFibGUgbnVtYmVyIG9mIGFubm90YXRpb25zXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBnZXRSb3dIZWlnaHQoaW5kZXgpIHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHRoaXMucm93TGlzdFtpbmRleF0uYW5ub3RhdGlvbkRlcHRoO1xuICAgIHJldHVybiB0aGlzLmdldENoYXJIZWlnaHQoKSAqIChhbm5vdGF0aW9ucyArICh0aGlzLm9wdGlvbnMucmV2ZXJzZSA/IDggOiA3KSk7XG4gIH1cblxuICAvKipcbiAgICogc2hvdyBvciBoaWRlIHRoZSByZXZlcnNlIHN0cmFuZCAoIGFyZ3VtZW50IGlzIG9wdGlvbmFsIClcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSByZXZlcnNlIHN0cmFuZFxuICAgKiBAcGFyYW0gc2hvd1xuICAgKi9cbiAgc2hvd1JldmVyc2VTdHJhbmQoc2hvdykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLm9wdGlvbnMucmV2ZXJzZSA9IHNob3c7XG4gICAgICAvLyByZXNldCBjYWNoZSBzaW5jZSBhbGwgcm93cyB3aWxsIGNoYW5nZVxuICAgICAgdGhpcy5yZXNldFJvd0NhY2hlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmV2ZXJzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW5kZXIgdGhlIGVudGlyZSB2aWV3LCB1c2luZyBjYWNoZWQgcm93cyBpZiBwb3NzaWJsZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIC8vY29uc29sZS50aW1lKCdSZW5kZXInKTtcbiAgICBpbnZhcmlhbnQodGhpcy5mb250TWV0cmljcyAmJiB0aGlzLmJsb2NrUm93TWFwICYmIHRoaXMucm93TGlzdCwgJ2Nhbm5vdCByZW5kZXIgdW50aWwgbGF5b3V0IGhhcyBiZWVuIG1hcHBlZCcpO1xuICAgIC8vIGlnbm9yZSBpZiByZXNpemVkIHRvbyBzbWFsbFxuICAgIGlmICh0aGlzLnRvb1NtYWxsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaG93IG1hbnkgcm93c0NvbnRhaW5lciAoIGluY2x1ZGluZyBwYXJ0aWFsIHJvd3NDb250YWluZXIgKSB3aWxsIHdlIGFjY29tbW9kYXRlIClcbiAgICBjb25zdCByb3dzRml0ID0gdGhpcy5yb3dzVmlzaWJsZSgpO1xuICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5taW4odGhpcy5yb3dMaXN0Lmxlbmd0aCwgdGhpcy5maXJzdFJvdyArIHJvd3NGaXQpO1xuICAgIC8vIHJlbmRlciBhbGwgcm93c0NvbnRhaW5lciBhbmQgcmVjb3JkcyBpbiBlYWNoIHJvd1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gdGhpcy5maXJzdFJvdzsgcm93SW5kZXggPCBsaW1pdDsgcm93SW5kZXggKz0gMSkge1xuICAgICAgLy8gc2VlIGlmIHdlIGhhdmUgdGhpcyByb3cgaW4gb3VyIGNhY2hlIG90aGVyd2lzZSB3ZSB3aWxsIGhhdmUgdG8gY3JlYXRlIGFuZCByZW5kZXIgaXRcbiAgICAgIGxldCByb3dFbCA9IHRoaXMucm93Q2FjaGUuZ2V0RWxlbWVudChyb3dJbmRleCk7XG4gICAgICBpZiAoIXJvd0VsKSB7XG4gICAgICAgIC8vIHJvdyB3YXNuJ3QgaW4gdGhlIGNhY2hlIHNvIGNyZWF0ZSBhbmQgcmVuZGVyXG4gICAgICAgIHJvd0VsID0gdGhpcy5yZW5kZXJSb3cocm93SW5kZXgpO1xuICAgICAgICAvLyBhZGQgdG8gY2FjaGVcbiAgICAgICAgdGhpcy5yb3dDYWNoZS5hZGRFbGVtZW50KHJvd0luZGV4LCByb3dFbCk7XG4gICAgICB9XG4gICAgICAvLyBwb3NpdGlvbiByb3cgY29udGFpbmVyXG4gICAgICBjb25zdCByb3dCb3VuZHMgPSB0aGlzLmdldFJvd0JvdW5kcyhyb3dJbmRleCk7XG4gICAgICByb3dFbC5zZXRTdHlsZXMoe1xuICAgICAgICBsZWZ0ICA6IHJvd0JvdW5kcy54ICsgJ3B4JyxcbiAgICAgICAgdG9wICAgOiByb3dCb3VuZHMueSArICdweCcsXG4gICAgICAgIHdpZHRoIDogcm93Qm91bmRzLncgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IHJvd0JvdW5kcy5oICsgJ3B4JyxcbiAgICAgIH0pO1xuICAgICAgLy8gYWRkIHRvIHRoZSBET00gaWYgbm90IGN1cnJlbnRseSBwYXJlbnRlZFxuICAgICAgaWYgKCFyb3dFbC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHRoaXMucm93c0NvbnRhaW5lci5hcHBlbmRDaGlsZChyb3dFbCk7XG4gICAgICB9XG4gICAgICAvLyBtYXJrIHRoaXMgcm93IHdpdGggdGhlIGN1cnJlbnQgcmVuZGVyIGN5Y2xlXG4gICAgICByb3dFbC5lbC5zZXRBdHRyaWJ1dGUoJ3JlbmRlci1jeWNsZScsIHJlbmRlckN5Y2xlKTtcbiAgICB9XG4gICAgLy8gcmVtb3ZlIGFueSByb3dzIGZyb20gdGhlIHJvd3NDb250YWluZXIgdGhhdCB3ZXJlIG5vdCB1cGRhdGVkIGR1cmluZyB0aGUgY3VycmVudCByZW5kZXIgY3ljbGVcbiAgICB0aGlzLnJvd3NDb250YWluZXIuZm9yRWFjaENoaWxkKHJvd0VsZW1lbnQgPT4ge1xuICAgICAgaWYgKHBhcnNlRmxvYXQocm93RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbmRlci1jeWNsZScpKSAhPT0gcmVuZGVyQ3ljbGUpIHtcbiAgICAgICAgcm93RWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJvd0VsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHVzZXIgaW50ZXJmYWNlIG11c3QgYmUgcmUtcmVuZGVyZWQgYXMgd2VsbFxuICAgIHRoaXMudXNlckludGVyZmFjZS5yZW5kZXIoKTtcbiAgICAvLyBidW1wIHRvIHRoZSBuZXh0IHJlbmRlciBjeWNsZVxuICAgIHJlbmRlckN5Y2xlICs9IDE7XG4gICAgLy9jb25zb2xlLnRpbWVFbmQoJ1JlbmRlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbmRlciBhIHNpbmdsZSByb3cgb2YgdGhlIHZpZXdcbiAgICogQHBhcmFtIHJvd0luZGV4XG4gICAqL1xuICByZW5kZXJSb3cocm93SW5kZXgpIHtcbiAgICAvLyBnZXQgdGhlIGN1cnJlbnQgcm93XG4gICAgY29uc3Qgcm93ID0gdGhpcy5yb3dMaXN0W3Jvd0luZGV4XTtcbiAgICAvLyBjcmVhdGUgYW4gZWxlbWVudCB0byBjb250YWluIHRoZSBlbnRpcmUgcm93XG4gICAgY29uc3Qgcm93RWwgPSBEKCc8ZGl2IGNsYXNzPVwicm93LWVsZW1lbnRcIj48L2Rpdj4nKTtcbiAgICAvLyByZW5kZXIgYWxsIHRoZSBibG9jayByZWNvcmRzIGZvciB0aGlzIHJvd1xuICAgIHJvdy5ibG9ja1JlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgLy8gdGhlIHNlcXVlbmNlIHN0cmFuZCBpdHNlbGZcbiAgICAgIHJlbmRlclNlcXVlbmNlUm93KHRoaXMsIHJvd0VsLCByZWNvcmQsIDApO1xuICAgICAgLy8gc2VwYXJhdG9yIHJvd1xuICAgICAgcmVuZGVyU2VwYXJhdG9yU2VxdWVuY2VSb3codGhpcywgcm93RWwsIHJlY29yZCwgdGhpcy5nZXRDaGFySGVpZ2h0KCkpO1xuICAgICAgLy8gb3B0aW9uYWwgcmV2ZXJzZSBzdHJhbmRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmV2ZXJzZSkge1xuICAgICAgICByZW5kZXJSZXZlcnNlU2VxdWVuY2VSb3codGhpcywgcm93RWwsIHJlY29yZCwgdGhpcy5nZXRDaGFySGVpZ2h0KCkgKiAyKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlbmRlciB0aGUgYmxvY2tcbiAgICAgIHJlbmRlckJsb2NrU2VxdWVuY2VSb3codGhpcywgcm93RWwsIHJlY29yZCwgdGhpcy5nZXRDaGFySGVpZ2h0KCkgKiAodGhpcy5vcHRpb25zLnJldmVyc2UgPyAzIDogMikpO1xuICAgIH0pO1xuICAgIC8vIHJlbmRlciBhbnkgYW5ub3RhdGlvbnMgb24gdGhpcyByb3dcbiAgICBpZiAocm93LmFubm90YXRpb25SZWNvcmRzKSB7XG4gICAgICByb3cuYW5ub3RhdGlvblJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICByZW5kZXJBbm5vdGF0aW9uKHRoaXMsIHJvd0VsLCByZWNvcmQsIHRoaXMuZ2V0Q2hhckhlaWdodCgpICogKHRoaXMub3B0aW9ucy5yZXZlcnNlID8gNCA6IDMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyByZW5kZXIgdGhlIHNlcXVlbmNlIHJ1bGVyIHdpdGggbnVtYmVycyAoIDEwJ3MgKSBmcm9tIHN0YXJ0IG9mIHJvdyB0byBlbmQgb2Ygcm93XG4gICAgLy8gZ2V0IHRoZSBsZW5ndGggb2YgdGhpcyByb3csIHdoaWNoIHZhcmllcyBvbmx5IGZvciB0aGUgbGFzdCByb3cgb2YgdGhlIGRhdGEgc2V0XG4gICAgY29uc3Qgcm93Q2hhcnMgPSByb3dJbmRleCA9PT0gdGhpcy5yb3dMaXN0Lmxlbmd0aCAtIDEgPyB0aGlzLmxhc3RSb3dDaGFycygpIDogdGhpcy5yb3dMZW5ndGg7XG4gICAgY29uc3QgcnkgPSB0aGlzLmdldENoYXJIZWlnaHQoKSAqIChyb3cuYW5ub3RhdGlvbkRlcHRoICsgKHRoaXMub3B0aW9ucy5yZXZlcnNlID8gNCA6IDMpKSArIHRoaXMuZ2V0Q2hhckhlaWdodCgpICogMC41O1xuICAgIHJlbmRlclNlcXVlbmNlUnVsZXIodGhpcywgcm93RWwsIHJ5LCByb3dJbmRleCAqIHRoaXMucm93TGVuZ3RoLCByb3dDaGFycyk7XG5cbiAgICAvLyByZXR1cm4gdGhlIHJvdyBjb250YWluZXJcbiAgICByZXR1cm4gcm93RWw7XG4gIH1cblxuICAvKipcbiAgICogaWYgdGhlIHNlcXVlbmNlIGlzIG5vdCBhdmFpbGFibGVcbiAgICogQHBhcmFtIGJsb2NrXG4gICAqIEBwYXJhbSBvZmZzZXRcbiAgICogQHBhcmFtIGxlbmd0aFxuICAgKiBAcGFyYW0gcmV2ZXJzZSBbb3B0aW9uYWxdIHJldHVybnMgdGhlIHJldmVyc2Ugc3RyYW5kXG4gICAqL1xuICBnZXRTZXF1ZW5jZShibG9jaywgb2Zmc2V0LCBsZW5ndGgsIHJldmVyc2UgPSBmYWxzZSkge1xuICAgIC8vIGlmIHNlcXVlbmNlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRoZSBlbXB0eSBibG9jayBzdHJpbmdcbiAgICBpZiAoYmxvY2suc2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbXB0eUJsb2NrU3RyLnN1YnN0cihvZmZzZXQsIGxlbmd0aCk7XG4gICAgfVxuICAgIGxldCBjYWNoZUVudHJ5ID0gdGhpcy5zZXF1ZW5jZUNhY2hlW2Jsb2NrLmlkXTtcbiAgICBpZiAoIWNhY2hlRW50cnkpIHtcbiAgICAgIGNhY2hlRW50cnkgPSB0aGlzLnNlcXVlbmNlQ2FjaGVbYmxvY2suaWRdID0ge1xuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICBzZXF1ZW5jZTogbnVsbCxcbiAgICAgIH07XG4gICAgICBibG9jay5nZXRTZXF1ZW5jZSgpXG4gICAgICAgIC50aGVuKHNlcXVlbmNlID0+IHtcbiAgICAgICAgICAvLyBpZ25vcmUgaWYgd2UgYmVjYW1lIGRpc3Bvc2VkIGluIHRoZSBtZWFudGltZVxuICAgICAgICAgIGlmICghdGhpcy5kaXNwb3NlZCkge1xuICAgICAgICAgICAgY2FjaGVFbnRyeS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjYWNoZUVudHJ5LnNlcXVlbmNlID0gc2VxdWVuY2U7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVDYWNoZUZvckJsb2NrKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gcmV0dXJuIHRoZSBzZXF1ZW5jZSBpZiB3ZSBoYXZlIGl0XG4gICAgaWYgKGNhY2hlRW50cnkuc2VxdWVuY2UpIHtcbiAgICAgIC8vIHJldHVybiB0aGUgcmV2ZXJzZSBzdHJhbmQgYXMgcmVxdWVzdGVkXG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICBjYWNoZUVudHJ5LnJldmVyc2VTZXF1ZW5jZSA9IGNhY2hlRW50cnkucmV2ZXJzZVNlcXVlbmNlIHx8IHRoaXMucmV2ZXJzZVN0cmFuZChjYWNoZUVudHJ5LnNlcXVlbmNlKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlRW50cnkucmV2ZXJzZVNlcXVlbmNlLnN1YnN0cihvZmZzZXQsIGxlbmd0aCk7XG4gICAgICB9XG4gICAgICAvLyBhY3R1YWwgc2VxdWVuY2VcbiAgICAgIHJldHVybiBjYWNoZUVudHJ5LnNlcXVlbmNlLnN1YnN0cihvZmZzZXQsIGxlbmd0aCk7XG4gICAgfVxuICAgIC8vIG11c3QgYmUgbG9hZGluZywgc28gcmV0dXJuICctJ1xuICAgIHJldHVybiAnLScucmVwZWF0KGxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBnaXZlbiByZXZlcnNlIHN0cmFuZCBmb3IgYSBnaXZlbiBzZXF1ZW5jZVxuICAgKiBAcmV0dXJucyB7KnxzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgcmV2ZXJzZVN0cmFuZChzZXF1ZW5jZSkge1xuICAgIGxldCByZXZlcnNlID0gJyc7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNlcXVlbmNlLmxlbmd0aDsgaSArPTEpIHtcbiAgICAgIGNvbnN0IGNoYXIgPSBzZXF1ZW5jZVtpXTtcbiAgICAgIHJldmVyc2UgKz0gcmV2ZXJzZU1hcFtjaGFyXSB8fCAnPyc7XG4gICAgfVxuICAgIHJldHVybiByZXZlcnNlO1xuICB9XG5cbiAgZmFicmljKCkge1xuICAgIC8vIHdlIG11c3QgYmUgZ2l2ZW4gYSBwYXJlbnQgZWxlbWVudFxuICAgIGludmFyaWFudCh0aGlzLm9wdGlvbnMucGFyZW50LCAndmlld2VyIG11c3QgYmUgc3VwcGxpZWQgd2l0aCBhIHBhcmVudCBlbGVtZW50Jyk7XG5cbiAgICAvLyBjcmVhdGUgRE9NXG5cbiAgICB0aGlzLm91dGVyID0gRCgnPGRpdiBjbGFzcz1cInZpZXdlclwiPjwvZGl2PicpO1xuICAgIHRoaXMub3B0aW9ucy5wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5vdXRlci5lbCk7XG5cbiAgICB0aGlzLnJvd3NDb250YWluZXIgPSBEKCc8ZGl2IGNsYXNzPVwicm93c1wiPjwvZGl2PicpO1xuICAgIHRoaXMub3V0ZXIuZWwuYXBwZW5kQ2hpbGQodGhpcy5yb3dzQ29udGFpbmVyLmVsKTtcblxuICAgIHRoaXMudXNlckludGVyZmFjZSA9IG5ldyBVc2VySW50ZXJmYWNlKHtcbiAgICAgIHZpZXdlcjogdGhpcyxcbiAgICB9KTtcblxuICAgIC8vIGNoYXJhY3RlciBtZXRyaWNzIGZvciBzdHJpbmcgbWVhc3VyZW1lbnRcbiAgICB0aGlzLmZvbnRNZXRyaWNzID0gY2hhck1lYXN1cmUoKTtcblxuICAgIC8vIGVuc3VyZSB3ZSBoYXZlIGN1cnJlbnQgbWV0cmljc1xuICAgIHRoaXMuY2FsY3VsYXRlU2l6ZU1ldHJpY3MoKTtcblxuICAgIC8vIHNldHVwIGluaXRpYWwgZW1wdHkgZGF0YSBzZXRcbiAgICB0aGlzLm5ld0RhdGFTZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXNldCBvciBzZXQgdGhlIGN1cnJlbnQgYmxvY2tzIGFuZCBhbm5vdGF0aW9uc1xuICAgKiBAcGFyYW0gZGF0YVNldFxuICAgKi9cbiAgbmV3RGF0YVNldChibG9ja3MgPSBudWxsLCBhbm5vdGF0aW9ucyA9IG51bGwsIGFwcFN0YXRlID0gbnVsbCkge1xuICAgIC8vIHJvd3Mgd2lsbCBhbGwgY2hhbmdlIG9uIHNpemUgY2hhbmdlIHNvIHJlc2V0IHdpdGggYSBuZXcgY2FjaGVcbiAgICB0aGlzLnJlc2V0Um93Q2FjaGUoKTtcbiAgICAvLyBzdGF0ZSBpcyBhbGwgdGhlIGFwcGxpY2F0aW9uIHN0YXRlIGRhdGFcbiAgICB0aGlzLmFwcFN0YXRlID0gYXBwU3RhdGU7XG4gICAgLy8gY3JlYXRlIG4gZmFrZSBibG9ja3NcbiAgICB0aGlzLmJsb2NrTGlzdCA9IGJsb2NrcyB8fCBbXTtcblxuICAgIC8vIEZBS0UgYmxvY2tzIGZvciB0ZXN0aW5nXG4gICAgLy8gbGV0IHRvdGFsTGVuZ3RoID0gMDtcbiAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDUwMDsgaSArPSAxKSB7XG4gICAgLy8gICBjb25zdCBiID0gbmV3IEJsb2NrKHtcbiAgICAvLyAgICAgY2FsbGJhY2s6IHRoaXMuYmxvY2tMb2FkZWQuYmluZCh0aGlzKSxcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgdG90YWxMZW5ndGggKz0gdGhpcy5ibG9ja0Rpc3BsYXlMZW5ndGgoYik7XG4gICAgLy8gICB0aGlzLmJsb2NrTGlzdC5wdXNoKGIpO1xuICAgIC8vIH1cblxuICAgIC8vIGdlbmVyYXRlIHNvbWUgZmFrZSBhbm5vdGF0aW9ucyBmcm9tIDAuLnRvdGFsTGVuZ3RoXG4gICAgdGhpcy5hbm5vdGF0aW9uTGlzdCA9IGFubm90YXRpb25zIHx8IFtdO1xuXG4gICAgLy8gRkFLRSBhbm5vdGF0aW9ucyBmb3IgdGVzdGluZ1xuICAgIC8vIGZvciAobGV0IGogPSAwOyBqIDwgNTAwOyBqICs9IDEpIHtcbiAgICAvLyAgIGNvbnN0IHN0YXJ0ID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdG90YWxMZW5ndGggLSAxMDApKTtcbiAgICAvLyAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWF4KDQsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkpO1xuICAgIC8vICAgY29uc3QgYSA9IG5ldyBBbm5vdGF0aW9uKHN0YXJ0LCBsZW5ndGgpO1xuICAgIC8vICAgdGhpcy5hbm5vdGF0aW9uTGlzdC5wdXNoKGEpO1xuICAgIC8vIH1cblxuICAgIC8vIG1hcCBkYXRhIHRvIHJvd3NcbiAgICB0aGlzLm1hcERhdGFTZXQoKTtcbiAgICAvLyBiYWNrIHRvIGZpcnN0IHJvd1xuICAgIHRoaXMuZmlyc3RSb3cgPSAwO1xuICAgIC8vIGNsZWFyIHNlbGVjdGlvblxuICAgIHRoaXMudXNlckludGVyZmFjZS5zZXRTZWxlY3Rpb24oKTtcbiAgICAvLyBkaXNwbGF5IHRvdGFsIGxlbmd0aCBvZiBzZXF1ZW5jZVxuICAgIHRoaXMudXNlckludGVyZmFjZS5zdGF0dXNCYXIuc2V0QmFzZVBhaXJzKHRoaXMudG90YWxTZXF1ZW5jZUxlbmd0aCk7XG4gICAgLy8gcmVzZXQgc2VhcmNoIHRlcm0gc2luY2UgYmxvY2tzIC8gYW5ub3RhdGlvbnMgaGF2ZSBjaGFuZ2VkXG4gICAgdGhpcy51c2VySW50ZXJmYWNlLnN0YXR1c0Jhci5yZXNldFNlYXJjaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNjcm9sbCBkb3duXG4gICAqL1xuICBuZXh0Um93KCkge1xuICAgIHRoaXMuZmlyc3RSb3cgPSBNYXRoLm1pbih0aGlzLnJvd0xpc3QubGVuZ3RoIC0gMSwgdGhpcy5maXJzdFJvdyArIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNjcm9sbCB1cFxuICAgKi9cbiAgcHJldmlvdXNSb3coKSB7XG4gICAgdGhpcy5maXJzdFJvdyA9IE1hdGgubWF4KDAsIHRoaXMuZmlyc3RSb3cgLSAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZWxlY3QgYSBnaXZlbiBibG9jaydzIHJhbmdlXG4gICAqL1xuICBzZWxlY3RCbG9jayhibG9ja0lkKSB7XG4gICAgaW52YXJpYW50KGJsb2NrSWQsICdibG9jayBJRCBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrUm93TWFwW2Jsb2NrSWRdLmJsb2NrO1xuICAgIGludmFyaWFudChibG9jaywgJ2Jsb2NrIG11c3QgYmUgYXZhaWxhYmxlICcpO1xuICAgIHRoaXMudXNlckludGVyZmFjZS5zZXRTZWxlY3Rpb24oe1xuICAgICAgYmxvY2ssXG4gICAgICBibG9ja09mZnNldDogMCxcbiAgICB9LCB7XG4gICAgICBibG9jayxcbiAgICAgIGJsb2NrT2Zmc2V0OiB0aGlzLmJsb2NrRGlzcGxheUxlbmd0aChibG9jaykgLSAxLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbGVjdCB0aGUgZ2l2ZW4gYW5ub3RhdGlvbidzIHJhbmdlXG4gICAqIEBwYXJhbSBhbm5vdGF0aW9uSWRcbiAgICovXG4gIHNlbGVjdEFubm90YXRpb24oYW5ub3RhdGlvbklkKSB7XG4gICAgaW52YXJpYW50KGFubm90YXRpb25JZCwgJ2Fubm90YXRpb24gaWQgZXhwZWN0ZWQnKTtcbiAgICAvLyBnZXQgY29sdW1uIC8gcm93IGluZm9ybWF0aW9uIGZvciB0aGUgYW5ub3RhdGlvblxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmFubm90YXRpb25Sb3dNYXBbYW5ub3RhdGlvbklkXTtcbiAgICAvLyBjb252ZXJ0IGludG8gYmxvY2sgY29vcmRpbmF0ZXMgdmlhIHVzZXIgaW50ZXJmYWNlXG4gICAgY29uc3Qgc3RhcnRJbmZvID0gdGhpcy51c2VySW50ZXJmYWNlLmNvbHVtblJvd1RvQmxvY2tPZmZzZXQobmV3IFZlY3RvcjJEKGluZm8uc3RhcnRDb2x1bW4sIGluZm8uc3RhcnRSb3cpKTtcbiAgICBjb25zdCBlbmRJbmZvID0gdGhpcy51c2VySW50ZXJmYWNlLmNvbHVtblJvd1RvQmxvY2tPZmZzZXQobmV3IFZlY3RvcjJEKGluZm8uZW5kQ29sdW1uLCBpbmZvLmVuZFJvdykpO1xuICAgIC8vIHNlbGVjdCB0aGUgcmFuZ2VcbiAgICB0aGlzLnVzZXJJbnRlcmZhY2Uuc2V0U2VsZWN0aW9uKHN0YXJ0SW5mbywgZW5kSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogbWFrZSB0aGUgZmlyc3Qgcm93IGNvbnRhaW5pbmcgcm93IHRoZSB0b3Agcm93XG4gICAqIEBwYXJhbSBibG9ja1xuICAgKi9cbiAgc2hvd0Jsb2NrKGJsb2NrSWQpIHtcbiAgICBpbnZhcmlhbnQoYmxvY2tJZCwgJ2Jsb2NrIGlkIG11c3QgYmUgc3VwcGxpZWQnKTtcbiAgICBjb25zdCBpbmZvID0gdGhpcy5ibG9ja1Jvd01hcFtibG9ja0lkXTtcbiAgICBpbnZhcmlhbnQoaW5mbywgJ2V4cGVjdGVkIGEgYmxvY2sgaW5mbyBmb3IgdGhlIGJsb2NrJyk7XG4gICAgdGhpcy5maXJzdFJvdyA9IGluZm8uc3RhcnRSb3c7XG4gIH1cblxuICAvKipcbiAgICogYnJpbmcgdGhlIGdpdmVuIGFubm90YXRpb24gaW50byB0aGUgdmlld1xuICAgKiBAcGFyYW0gYW5ub3RhdGlvbklkXG4gICAqL1xuICBzaG93QW5ub3RhdGlvbihhbm5vdGF0aW9uSWQpIHtcbiAgICBpbnZhcmlhbnQoYW5ub3RhdGlvbklkLCAnYW5ub3RhdGlvbiBpZCBtdXN0IGJlIHN1cHBsaWVkJyk7XG4gICAgY29uc3QgaW5mbyA9IHRoaXMuYW5ub3RhdGlvblJvd01hcFthbm5vdGF0aW9uSWRdO1xuICAgIGludmFyaWFudChpbmZvLCAnZXhwZWN0ZWQgaW5mbyBmb3IgdGhlIGFubm90YXRpb24nKTtcbiAgICB0aGlzLmZpcnN0Um93ID0gaW5mby5zdGFydFJvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBhZnRlciBhIGJsb2NrcyBmdWxsIGRhdGEgaXMgbG9hZGVkXG4gICAqIEBwYXJhbSBibG9ja1xuICAgKi9cbiAgYmxvY2tMb2FkZWQoYmxvY2spIHtcbiAgICAvLyByZW1vdmUgcm93cyBjb250YWluaW5nIHRoaXMgYmxvY2sgZnJvbSB0aGUgY2FjaGVcbiAgICB0aGlzLmludmFsaWRhdGVDYWNoZUZvckJsb2NrKGJsb2NrKTtcbiAgICAvLyBibG9jayBsYXlvdXQgZG9lc24ndCBjaGFuZ2Ugb25seSB0aGUgY29udGVudCBvZiBhIGJsb2NrLCBzbyBhIHJlbmRlciBpcyBhbGwgdGhhdCBpcyByZXF1aXJlZC5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZSBpbnRlcm5hbCBtYXBzIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgZGF0YSBzZXQuIE1hcHMgYmxvY2tzIHRvIHJvd3MgYW5kIGNvbHVtbnNcbiAgICogYW5kIG1hcHMgYW5ub3RhdGlvbnMgdG8gcm93cyBhbmQgY29sdW1ucy5cbiAgICogTk9URTogbWFwQW5ub3RhdGlvbnMgTVVTVCBiZSBhZnRlciBtYXBCbG9ja3Mgc2luY2UgaXQgcmVxdWlyZXMgYmxvY2sgcG9zaXRpb24gaW5mb3JtYXRpb24uXG4gICAqL1xuICBtYXBEYXRhU2V0KCkge1xuICAgIC8vY29uc29sZS50aW1lKCdNYXAgRGF0YSBTZXQnKTtcbiAgICB0aGlzLm1hcEJsb2NrcygpO1xuICAgIHRoaXMubWFwQW5ub3RhdGlvbnMoKTtcbiAgICAvL2NvbnNvbGUudGltZUVuZCgnTWFwIERhdGEgU2V0Jyk7XG4gIH1cblxuICAvKipcbiAgICogaW52YWxpZGF0ZSB0aGUgY2FjaGVkIHJvd3MgY29udGFpbmluZyB0aGUgZ2l2ZW4gYmxvY2tcbiAgICogQHBhcmFtIGJsb2NrXG4gICAqL1xuICBpbnZhbGlkYXRlQ2FjaGVGb3JCbG9jayhibG9jaykge1xuICAgIGlmICh0aGlzLmJsb2NrUm93TWFwICYmIHRoaXMucm93Q2FjaGUpIHtcbiAgICAgIGNvbnN0IGJsb2NrSW5mbyA9IHRoaXMuYmxvY2tSb3dNYXBbYmxvY2suaWRdO1xuICAgICAgLy8gbmVlZCBkYXRhIHNldCBtYXkgaGF2ZSBhcnJpdmVkIGluIHRoZSBtZWFuIHRpbWUsIHNvIGJsb2NrSW5mbyBtYXkgbm90IGJlIHByZXNlbnRcbiAgICAgIGlmIChibG9ja0luZm8pIHtcbiAgICAgICAgLy8gaW52YWxpZCBldmVyeSByb3cgY29udGFpbmluZyBhbGwgb3IgcGFydCBvZiB0aGUgYmxvY2tcbiAgICAgICAgZm9yIChsZXQgaSA9IGJsb2NrSW5mby5zdGFydFJvdzsgaSA8PSBibG9ja0luZm8uZW5kUm93OyBpICs9IDEpIHtcbiAgICAgICAgICB0aGlzLnJvd0NhY2hlLnJlbW92ZUVsZW1lbnQoaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBkaXNwbGF5IGxlbmd0aCBmb3IgYSBibG9jaywgd2hpY2ggaXMgZWl0aGVyIHRoZSBsZW5ndGggb2YgaXRzIHNlcXVlbmNlXG4gICAqIG9yIHRoZSBsZW5ndGggb2YgdGhlIGVtcHR5IGJsb2NrIHN0cmluZ1xuICAgKiBAcGFyYW0gYmxvY2tcbiAgICovXG4gIGJsb2NrRGlzcGxheUxlbmd0aChibG9jaykge1xuICAgIHJldHVybiBibG9jay5zZXF1ZW5jZS5sZW5ndGggfHwgdGhpcy5lbXB0eUJsb2NrU3RyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBtYXAgcm93c0NvbnRhaW5lciBtdXN0IGJlIGNhbGxlZCB3aGVuIGEgYmxvY2sgaXMgY2hhbmdlZC4gSXQgY29uc3RydWN0cyB0d28gaW1wb3J0YW50IGRhdGEgc3RydWN0dXJlczpcbiAgICogMS4gYmxvY2tSb3dNYXAgQSBoYXNoIGtleWVkIG15IGJsb2NrLmlkIHdoaWNoIGdpdmVzIHRoZSBzdGFydGluZyByb3cgYW5kIGNoYXIgb2Zmc2V0IGludG8gdGhlXG4gICAqICAgICAgICAgICAgICAgIHRoZSByb3cgZm9yIHRoYXQgYmxvY2suIEFsc28sIHRoZSBlbmRpbmcgcm93IGFuZCBjaGFyIG9mZnNldCBpbnRvIHRoZSByb3cgZm9yIHRoZSBibG9jay5cbiAgICogICAgICAgICAgICAgICAgVGh1cyBmb3IgZWFjaCBibG9jayB5b3UgZ2V0OlxuICAgKiAgICAgICAgICAgICAgICAtIGJsb2NrXG4gICAqICAgICAgICAgICAgICAgIC0gc3RhcnRSb3dcbiAgICogICAgICAgICAgICAgICAgLSBzdGFydFJvd09mZnNldCxcbiAgICogICAgICAgICAgICAgICAgLSBlbmRSb3csXG4gICAqICAgICAgICAgICAgICAgIC0gZW5kUm93T2Zmc2V0XG4gICAqXG4gICAqIDIuIHJvd0xpc3QgICAgIEZvciBlYWNoIHJvdyByZXF1aXJlZCwgYSBsaXN0IG9mIHJlY29yZCBmb3IgdGhhdCByb3cuIEVhY2ggcmVjb3JkIGdpdmVzOlxuICAgKiAgICAgICAgICAgICAgICAtYmxvY2ssXG4gICAqICAgICAgICAgICAgICAgIC1zdGFydFJvd09mZnNldCxcbiAgICogICAgICAgICAgICAgICAgLXN0YXJ0QmxvY2tPZmZzZXQsXG4gICAqICAgICAgICAgICAgICAgIC1sZW5ndGguXG4gICAqICAgICAgICAgICAgICAgIEVhY2ggcm93IHJlcXVpcmVkIDEgb3IgbW9yZSByZWNvcmQgdG8gZGVmaW5lIGl0cyBjb250ZW50XG4gICAqL1xuICBtYXBCbG9ja3MoKSB7XG5cbiAgICAvL2NvbnNvbGUudGltZSgnTWFwIEJsb2NrcyBhbmQgUm93cycpO1xuICAgIGludmFyaWFudCh0aGlzLnJvd0xlbmd0aCA+IDAsICdSb3dzIG11c3QgYmUgYXQgbGVhc3Qgb25lIGNoYXJhY3RlciB3aWRlJyk7XG4gICAgLy8gcmVzZXQgdGhlIHR3byBzdHJ1Y3R1cmVzIHdlIGFyZSBnb2luZyB0byBidWlsZFxuICAgIHRoaXMuYmxvY2tSb3dNYXAgPSB7fTtcbiAgICB0aGlzLnJvd0xpc3QgPSBbXTtcbiAgICAvLyB0aGUgY3VycmVudCByb3cgd2UgYXJlIG9uXG4gICAgbGV0IGN1cnJlbnRSb3cgPSAwO1xuICAgIC8vIG9mZnNldCBpbnRvIHRoZSBjdXJyZW50IHJvdyB3ZSBhcmUgd29ya2luZyBvblxuICAgIGxldCBjdXJyZW50Um93T2Zmc2V0ID0gMDtcbiAgICAvLyBpbmRleCBvZiBjdXJyZW50IGJsb2NrIHdlIGFyZSBwbGFjaW5nXG4gICAgbGV0IGN1cnJlbnRCbG9ja0luZGV4ID0gMDtcbiAgICAvLyBjdXJyZW50IGJsb2NrIHdlIGFyZSBwbGFjaW5nXG4gICAgbGV0IGJsb2NrO1xuICAgIC8vIG9mZnNldCBpbnRvIHRoZSBjdXJyZW50IGJsb2NrIHdlIGFyZSBwbGFjaW5nXG4gICAgbGV0IGN1cnJlbnRCbG9ja09mZnNldDtcbiAgICAvLyBpbmZvIHN0cnVjdHVyZXMgZm9yIHRoZSBjdXJyZW50IHJvdyBhbmQgY3VycmVudCBibG9ja1xuICAgIGxldCBibG9ja0luZm87XG4gICAgbGV0IHJvd0luZm87XG4gICAgLy8gdHJhY2sgdGhlIHRvdGFsIGxlbmd0aCBvZiBzZXF1ZW5jZXNcbiAgICB0aGlzLnRvdGFsU2VxdWVuY2VMZW5ndGggPSAwO1xuICAgIC8vIGRldGVybWluZSBob3cgbXVjaCBvZiB0aGUgY3VycmVudCBzZXF1ZW5jZSB3ZSBjYW4gZml0IGludG8gdGhlIGN1cnJlbnQgcm93XG4gICAgd2hpbGUgKGN1cnJlbnRCbG9ja0luZGV4IDwgdGhpcy5ibG9ja0xpc3QubGVuZ3RoKSB7XG4gICAgICAvLyBnZXQgdGhlIG5leHQgYmxvY2sgYW5kIHNldHVwIGEgYmxvY2sgaW5mbyBpZiB3ZSBkb24ndCBoYXZlIG9uZVxuICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICBibG9jayA9IHRoaXMuYmxvY2tMaXN0W2N1cnJlbnRCbG9ja0luZGV4XTtcbiAgICAgICAgLy8gdHJhY2sgdGhlIHRvdGFsIGxlbmd0aCBvZiBhbGwgc2VxdWVuY2VzXG4gICAgICAgIHRoaXMudG90YWxTZXF1ZW5jZUxlbmd0aCArPSB0aGlzLmJsb2NrRGlzcGxheUxlbmd0aChibG9jayk7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgYmxvY2sgaW5mbyB0aGF0IHJlY29yZHMgdGhlIHN0YXJ0L2VuZCBwb3NpdGlvbiBvZiB0aGlzIGJsb2NrXG4gICAgICAgIGJsb2NrSW5mbyA9IHtcbiAgICAgICAgICBibG9jayxcbiAgICAgICAgICBzdGFydFJvdyAgICAgIDogY3VycmVudFJvdyxcbiAgICAgICAgICBzdGFydFJvd09mZnNldDogY3VycmVudFJvd09mZnNldCxcbiAgICAgICAgICBlbmRSb3cgICAgICAgIDogLTEsXG4gICAgICAgICAgZW5kUm93T2Zmc2V0ICA6IC0xLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmJsb2NrUm93TWFwW2Jsb2NrLmlkXSA9IGJsb2NrSW5mbztcbiAgICAgICAgLy8gcmVzZXQgb2Zmc2V0IGludG8gY3VycmVudCBibG9ja1xuICAgICAgICBjdXJyZW50QmxvY2tPZmZzZXQgPSAwO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KGJsb2NrICYmIGJsb2NrSW5mbywgJ2V4cGVjdGVkIGEgYmxvY2sgYW5kIGJsb2NrSW5mbyBoZXJlJyk7XG5cbiAgICAgIC8vIGlmIHdlIGRvbid0IGhhdmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJvdyB0aGVuIGNyZWF0ZSBpdCBub3dcbiAgICAgIGlmICghcm93SW5mbykge1xuICAgICAgICByb3dJbmZvID0ge1xuICAgICAgICAgIC8vIHRoZXJlIG11c3QgYmUgYXQgbGVhc3Qgb25lIGJsb2NrIG9uIGVhY2ggcm93LCBzbyB0aGlzIGlzbid0IHdhc3RlZnVsXG4gICAgICAgICAgYmxvY2tSZWNvcmRzICAgOiBbXSxcbiAgICAgICAgICAvLyBkZXB0aCBvZiBuZXN0aW5nIG9mIGFubm90YXRpb25zLCAwIG1lYW5zIG5vIGFubm90YXRpb25zIG9uIHRoaXMgcm93LlxuICAgICAgICAgIGFubm90YXRpb25EZXB0aDogMCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yb3dMaXN0LnB1c2gocm93SW5mbyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGxlbmd0aCBvZiBzZXF1ZW5jZSBzdGlsbCByZW1haW5pbmcgZm9yIGN1cnJlbnQgYmxvY2tcbiAgICAgIGxldCBibG9ja1JlbWFpbmluZyA9IHRoaXMuYmxvY2tEaXNwbGF5TGVuZ3RoKGJsb2NrKSAtIGN1cnJlbnRCbG9ja09mZnNldDtcbiAgICAgIC8vIHNwYWNlIGF2YWlsYWJsZSBpbiB0aGUgY3VycmVudCByb3dcbiAgICAgIGxldCByb3dSZW1haW5pbmcgPSB0aGlzLnJvd0xlbmd0aCAtIGN1cnJlbnRSb3dPZmZzZXQ7XG4gICAgICAvLyBtYXggYW1vdW50IHdlIGNhbiB0YWtlIGZyb20gdGhlIGN1cnJlbnQgYmxvY2tcbiAgICAgIGxldCBmaXQgPSBNYXRoLm1pbihibG9ja1JlbWFpbmluZywgcm93UmVtYWluaW5nKTtcbiAgICAgIGludmFyaWFudChmaXQgPj0gMCwgJ2V4cGVjdGVkIHRvIGZpdCB6ZXJvIG9yIG1vcmUgY2hhcmFjdGVycycpO1xuXG4gICAgICAvLyBpZiB3ZSBjYW4ndCBmaXQgYW55dGhpbmcgdGhlbiBlbmQgdGhlIGN1cnJlbnQgcm93XG4gICAgICBpZiAoZml0ID09PSAwKSB7XG4gICAgICAgIGN1cnJlbnRSb3cgKz0gMTtcbiAgICAgICAgY3VycmVudFJvd09mZnNldCA9IDA7XG4gICAgICAgIHJvd0luZm8gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGFrZSBmaXQgY2hhcmFjdGVycyBmcm9tIHRoZSBjdXJyZW50IGJsb2NrIGFuZCBhZGQgYSByZWNvcmQgdG8gdGhlIGN1cnJlbnQgcm93SW5mb1xuICAgICAgICByb3dJbmZvLmJsb2NrUmVjb3Jkcy5wdXNoKHtcbiAgICAgICAgICBibG9jayAgICAgICAgICAgOiBibG9jayxcbiAgICAgICAgICBzdGFydFJvd09mZnNldCAgOiBjdXJyZW50Um93T2Zmc2V0LFxuICAgICAgICAgIHN0YXJ0QmxvY2tPZmZzZXQ6IGN1cnJlbnRCbG9ja09mZnNldCxcbiAgICAgICAgICBsZW5ndGggICAgICAgICAgOiBmaXQsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyB1cGRhdGUgb2Zmc2V0cyBpbnRvIHJvdyBhbmQgYmxvY2tcbiAgICAgICAgY3VycmVudFJvd09mZnNldCArPSBmaXQ7XG4gICAgICAgIGN1cnJlbnRCbG9ja09mZnNldCArPSBmaXQ7XG4gICAgICAgIC8vIGlmIHdlIGhhdmUgY29uc3VtZWQgdGhlIGVudGlyZSBzZXF1ZW5jZSBmcm9tIHRoZSBjdXJyZW50IGJsb2NrIHRoZW4gbW92ZSB0byB0aGUgbmV4dCBibG9ja1xuICAgICAgICBpbnZhcmlhbnQoY3VycmVudEJsb2NrT2Zmc2V0IDw9IHRoaXMuYmxvY2tEaXNwbGF5TGVuZ3RoKGJsb2NrKSwgJ2N1cnJlbnRCbG9ja09mZnNldCBzaG91bGQgbmV2ZXIgZXhjZWVkIHNlcXVlbmNlIGluIGJsb2NrJyk7XG4gICAgICAgIC8vIHJlYWNoIGVuZCBvZiB0aGUgY3VycmVudCBibG9jaz9cbiAgICAgICAgaWYgKGN1cnJlbnRCbG9ja09mZnNldCA9PT0gdGhpcy5ibG9ja0Rpc3BsYXlMZW5ndGgoYmxvY2spKSB7XG4gICAgICAgICAgYmxvY2tJbmZvLmVuZFJvdyA9IGN1cnJlbnRSb3c7XG4gICAgICAgICAgYmxvY2tJbmZvLmVuZFJvd09mZnNldCA9IGN1cnJlbnRSb3dPZmZzZXQ7XG4gICAgICAgICAgYmxvY2sgPSBibG9ja0luZm8gPSBudWxsO1xuICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGV4ICs9IDE7XG4gICAgICAgICAgY3VycmVudEJsb2NrT2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBtYXAgYW5ub3RhdGlvbnMgdG8gcm93cyBhbmQgY29sdW1ucy4gbWFwQmxvY2tzIG11c3QgYmUgY2FsbGVkIGZpcnN0LlxuICAgKi9cbiAgbWFwQW5ub3RhdGlvbnMoKSB7XG4gICAgLy8gbWFwcyBhbm5vdGF0aW9uIHRvIHRoZWlyIHN0YXJ0aW5nIC8gZW5kaW5nIGNvbHVtbiByb3csIGtleWVkIGJ5IGFubm90YXRpb24gaWRcbiAgICB0aGlzLmFubm90YXRpb25Sb3dNYXAgPSB7fTtcbiAgICAvLyBpbnRlcnNlY3QgZWFjaCBhbm5vdGF0aW9uIHdpdGggdGhpcyByb3dcbiAgICBmb3IobGV0IGEgPSAwOyBhIDwgdGhpcy5hbm5vdGF0aW9uTGlzdC5sZW5ndGg7IGEgKz0gMSkge1xuICAgICAgY29uc3QgYW5ub3RhdGlvbiA9IHRoaXMuYW5ub3RhdGlvbkxpc3RbYV07XG4gICAgICAvLyBlbnN1cmUgd2UgaGF2ZSB0aGUgYmxvY2ssIHNvbWUgYW5ub3RhdGlvbnMgYXBwZWFycyB0byBub3QgcmVmZXJlbmNlIGNvcnJlY3RseT9cblxuICAgICAgLy8gbm93IHRoYXQgYmxvY2tzIGFyZSBtYXBwZWQgd2UgY2FuIGNvcnJlY3RseSBzZXQgdGhlIGdsb2JhbCBzdGFydC9lbmQgZm9yIHRoZSBhbm5vdGF0aW9uXG4gICAgICBhbm5vdGF0aW9uLnNldFN0YXJ0RW5kKHRoaXMpO1xuICAgICAgLy8gZ2V0IHRoZSBmaXJzdCBhbmQgbGFzdCByb3cgdGhpcyBhbm5vdGF0aW9uIHNwYW5zXG4gICAgICBjb25zdCBmaXJzdFJvdyA9IE1hdGguZmxvb3IoYW5ub3RhdGlvbi5zdGFydCAvIHRoaXMucm93TGVuZ3RoKTtcbiAgICAgIGNvbnN0IGxhc3RSb3cgPSBNYXRoLmZsb29yKGFubm90YXRpb24uZW5kIC8gdGhpcy5yb3dMZW5ndGgpO1xuXG4gICAgICAvLyByZWNvcmQgdGhlIHN0YXJ0aW5nIC8gZW5kIHJvdyAvIGNvbHVtbiBmb3IgZWFjaCBhbm5vdGF0aW9uIGluIHRoZSBhIG1hcFxuICAgICAgdGhpcy5hbm5vdGF0aW9uUm93TWFwW2Fubm90YXRpb24uaWRdID0ge1xuICAgICAgICBzdGFydFJvdyAgIDogZmlyc3RSb3csXG4gICAgICAgIGVuZFJvdyAgICAgOiBsYXN0Um93LFxuICAgICAgICBzdGFydENvbHVtbjogYW5ub3RhdGlvbi5zdGFydCAlIHRoaXMucm93TGVuZ3RoLFxuICAgICAgICBlbmRDb2x1bW4gIDogYW5ub3RhdGlvbi5lbmQgJSB0aGlzLnJvd0xlbmd0aCxcbiAgICAgIH07XG5cbiAgICAgIC8vIGRldGVybWluZSB0aGUgZXh0ZW50IG9mIHRoZSBpbnRlcnNlY3Rpb24gd2l0aCBlYWNoIHJvd1xuICAgICAgZm9yIChsZXQgaSA9IGZpcnN0Um93OyBpIDw9IGxhc3RSb3c7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBzdGFydE9mUm93ID0gaSAqIHRoaXMucm93TGVuZ3RoO1xuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoIHRoZSBjdXJyZW50IHJvd1xuICAgICAgICBjb25zdCByc3RhcnQgPSBNYXRoLm1heChzdGFydE9mUm93LCBhbm5vdGF0aW9uLnN0YXJ0KTtcbiAgICAgICAgY29uc3QgcmVuZCA9IE1hdGgubWluKHN0YXJ0T2ZSb3cgKyB0aGlzLnJvd0xlbmd0aCAtIDEsIGFubm90YXRpb24uZW5kKTtcbiAgICAgICAgLy8gd2UgZXhwZWN0IHNvbWUgc29ydCBvZiBpbnRlcnNlY3Rpb25cbiAgICAgICAgaW52YXJpYW50KHJlbmQgLSByc3RhcnQgPj0gMCwgJ2V4cGVjdGVkIGFuIGludGVyc2VjdGlvbicpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIHJlY29yZCBmb3IgdGhlIGFubm90YXRpb24gaW50ZXJzZWN0aW9uIHRvIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcm93XG4gICAgICAgIC8vICggYW5ub3RhdGlvbnMgbWF5YmUgb3V0c2lkZSB0aGUgY3VycmVudGx5IGRpc3BsYXllZCByb3dzIClcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBpIDwgdGhpcy5yb3dMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IHJvd0luZm8gPSB0aGlzLnJvd0xpc3RbaV07XG4gICAgICAgICAgcm93SW5mby5hbm5vdGF0aW9uUmVjb3JkcyA9IHJvd0luZm8uYW5ub3RhdGlvblJlY29yZHMgfHwgW107XG4gICAgICAgICAgLy8gZWFjaCByZWNvcmQgaXMgdGhlIHN0YXJ0aW5nIG9mZnNldCBhbmQgZW5kaW5nIG9mZnNldCBpbnRvIHRoZSByb3dcbiAgICAgICAgICAvLyAuZGVwdGggaXMgdGhlIGRlcHRoIG9mIHRoZSBhbm5vdGF0aW9uIHNpbmNlIHNldmVyYWwgY2FuIG92ZXJsYXAuXG4gICAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgYW5ub3RhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiByc3RhcnQgLSBzdGFydE9mUm93LFxuICAgICAgICAgICAgZW5kICA6IHJlbmQgLSBzdGFydE9mUm93LFxuICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgLy8gZmluZCB0aGUgc2hhbGxvd2VzdCBkZXB0aCB3aGVyZSB0aGlzIGFubm90YXRpb24gd2lsbCBub3QgaW50ZXJzZWN0IGFub3RoZXIgYW5ub3RhdGlvblxuICAgICAgICAgICAgbGV0IHN0YXJ0LCBlbmQsIGFSZWNvcmQsIGludGVyc2VjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJvd0luZm8uYW5ub3RhdGlvblJlY29yZHMubGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgYVJlY29yZCA9IHJvd0luZm8uYW5ub3RhdGlvblJlY29yZHNba107XG4gICAgICAgICAgICAgIC8vIHRlc3QgZm9yIGludGVyc2VjdGlvbiBpZiBhdCB0aGUgc2FtZSBkZXB0aFxuICAgICAgICAgICAgICBpZiAoYVJlY29yZC5kZXB0aCA9PSByZWNvcmQuZGVwdGgpIHtcbiAgICAgICAgICAgICAgICBzdGFydCA9IE1hdGgubWF4KGFSZWNvcmQuc3RhcnQsIHJlY29yZC5zdGFydCk7XG4gICAgICAgICAgICAgICAgZW5kID0gTWF0aC5taW4oYVJlY29yZC5lbmQsIHJlY29yZC5lbmQpO1xuICAgICAgICAgICAgICAgIGlmIChlbmQgLSBzdGFydCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAvLyB0aGVyZSB3YXMgYW4gaW50ZXJzZWN0aW9uXG4gICAgICAgICAgICAgICAgICBpbnRlcnNlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGhpdCBhdCB0aGlzIGRlcHRoLCB0cnkgdGhlIG5leHQgb25lXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0ZWQpIHtcbiAgICAgICAgICAgICAgcmVjb3JkLmRlcHRoICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gdXBkYXRlIHRoZSBhbm5vdGF0aW9uIGRlcHRoIG9uIHRoZSByb3dJbmZvXG4gICAgICAgICAgcm93SW5mby5hbm5vdGF0aW9uRGVwdGggPSBNYXRoLm1heChyZWNvcmQuZGVwdGggKyAxLCByb3dJbmZvLmFubm90YXRpb25EZXB0aCk7XG5cbiAgICAgICAgICAvLyBhZGQgdG8gdGhlIGFubm90YXRpb25zIHJlY29yZHMgZm9yIHRoaXMgcm93XG4gICAgICAgICAgcm93SW5mby5hbm5vdGF0aW9uUmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiB0aGUgbGFzdCByb3cgdGhlIGRhdGEgc2V0LiBUaGlzIGlzIHVzZWZ1bCBudW1iZXIgZm9yIHZhcmlvdXNcbiAgICogVUkgdGFza3Mgc2luY2UgdGhlIGxhc3Qgcm93IG1heSBiZSBzaG9ydGVyIHRoYW4gdGhlIG90aGVyIHJvd3NcbiAgICovXG4gIGxhc3RSb3dDaGFycygpIHtcbiAgICBjb25zdCBsYXN0Um93ID0gdGhpcy5yb3dMaXN0W3RoaXMucm93TGlzdC5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBsYXN0UmVjb3JkID0gbGFzdFJvdy5ibG9ja1JlY29yZHNbbGFzdFJvdy5ibG9ja1JlY29yZHMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIGxhc3RSZWNvcmQuc3RhcnRSb3dPZmZzZXQgKyBsYXN0UmVjb3JkLmxlbmd0aDtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy92aWV3ZXIvdmlld2VyLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2ludmFyaWFudC9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNhY2hlZFNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbiAgdHJ5IHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxufSAoKSlcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgdGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4vKipcbiAqIHNpbXBsZXN0IHJlZ2V4IGZvciBpZGVudGlmeWluZyBhIHRhZyBzdHJpbmcgdmVyc3VzIGEgc2VsZWN0b3Igc3RyaW5nXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG5jb25zdCB0YWdSZWdleCA9IG5ldyBSZWdFeHAoJzwuW14oPjwuKV0rPicpO1xuXG4vKipcbiAqIHN0YXRpYyBXZWFrTWFwIHVzZWQgdG8gYmluZCBhcmJpdHJhcnkgZGF0YSB0byBET00gbm9kZXMuXG4gKiBTZWUgbWV0aG9kcyBzZXREYXRhLCBnZXREYXRhXG4gKi9cbmNvbnN0IG5vZGVNYXAgPSBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIHRoZSBhY3R1YWwgZWxlbWVudHMgY2xhc3Mgd2hpY2ggaW5oZXJpdHMgZnJvbSBuYXRpdmUgQXJyYXlcbiAqL1xuY2xhc3MgRWxlbWVudExpc3QgZXh0ZW5kcyBBcnJheSB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIC8vIHRoaXMgd2lsbCBiZSB0aGUgZWxlbWVudHMgd2Ugd3JhcFxuICAgIGxldCBlbGVtZW50cyA9IFtdO1xuICAgIC8vIGZpcnN0IG9wdGlvbiBpcyBmaXJzdCBhcmd1bWVudCBpcyBhIENTUyBzZWxlY3RvciBzdHJpbmcgYW5kIHNlY29uZCBvcHRpb25hbCBlbGVtZW50IGlzIHRoZSByb290IGVsZW1lbnQgdG8gYXBwbHkgdGhlIHNlbGVjdG9yIHRvLlxuICAgIGlmICgoYXJncy5sZW5ndGggPT09IDEgfHwgYXJncy5sZW5ndGggPT0gMikgJiYgKHR5cGVvZihhcmdzWzBdKSA9PT0gJ3N0cmluZycgJiYgIXRhZ1JlZ2V4LmV4ZWMoYXJnc1swXSkpKSB7XG4gICAgICBjb25zdCByb290ID0gYXJncy5sZW5ndGggPT09IDEgPyBkb2N1bWVudCA6IHRoaXMuZ2V0Tm9kZShhcmdzWzFdKTtcbiAgICAgIC8vIHJldHVybiBhIHByb3h5IHVzaW5nIHRoZSByZXN1bHRzIG9mIHRoZSBzZWxlY3RvciBhcyB0aGUgaW5pdGlhbCBhcnJheVxuICAgICAgZWxlbWVudHMgPSBBcnJheS5mcm9tKHJvb3QucXVlcnlTZWxlY3RvckFsbChhcmdzWzBdKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNlY29uZCBvcHRpb24gaXMgdGhhdCBhcmdzIGlmIGp1c3QgYSBzdHJpbmcgZS5nLiAnPGRpdiBjbGFzcz1cInh5elwiPjxwPlRpdGxlPC9wPjwvZGl2PidcbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YoYXJnc1swXSkgPT09ICdzdHJpbmcnICYmIHRhZ1JlZ2V4LmV4ZWMoYXJnc1swXSkpIHtcbiAgICAgICAgLy8gdXNlIGEgdGVtcG9yYXJ5IERJViBhbmQgaW5zZXJ0QWRqYWNlbnRIVE1MIHRvIGNvbnN0cnVjdCB0aGUgRE9NXG4gICAgICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICAgICAgZC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBhcmdzWzBdKTtcbiAgICAgICAgLy8gc2V0dXAgZWxlbWVudHMgdG8gd3JhcFxuICAgICAgICBlbGVtZW50cyA9IEFycmF5LmZyb20oZC5jaGlsZE5vZGVzKTtcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCB0aGUgY2hpbGRyZW4gb2YgdGhlIHRlbXBvcmFyeSBkaXYsIHNvIHRoYXQgdGhlIG5ld2x5IGNyZWF0ZWQgdG9wIGxldmVsIG5vZGVzIHdpbGwgYmUgdW5wYXJlbnRlZFxuICAgICAgICB3aGlsZSAoZC5jaGlsZEVsZW1lbnRDb3VudCkgZC5yZW1vdmVDaGlsZChkLmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb25seSByZW1haW5pbmcgb3B0aW9uIGlzIHRoYXQgZWFjaCBhcmd1bWVudCBpcyBhIERPTSBub2RlIG9yIHBvc3NpYmxlIGFub3RoZXIgZWxlbWVudHMgbGlzdFxuICAgICAgICBhcmdzLmZvckVhY2goYXJnID0+IHtcbiAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRWxlbWVudExpc3QpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KGFyZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goYXJnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50cyA9IGFyZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB0aGlzLnB1c2goaXRlbSkpO1xuICB9XG4gIC8qKlxuICAgKiBhcHBseSB0aGUga2V5L3ZhbHVlIHBhaXJzIGluIGhhc2ggdG8gYWxsIG91ciBlbGVtZW50c1xuICAgKi9cbiAgc2V0U3R5bGVzKGhhc2gpIHtcbiAgICB0aGlzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoaGFzaCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGVba2V5XSA9IGhhc2hba2V5XTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIGlmIHRoZSBvYmogaXMgYSBFbGVtZW50TGlzdCB0aGVuIHJldHVybiB0aGUgZmlyc3QgbWVtYmVyIG90aGVyd2lzZSBhc3N1bWVcbiAgICogdGhlIG9iamVjdCBpcyBhIG5vZGUgYW5kIHJldHVybiBpdC5cbiAgICovXG4gIGdldE5vZGUob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEVsZW1lbnRMaXN0KSByZXR1cm4gb2JqWzBdO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgLyoqXG4gICAqIGlmIHRoZSBvYmogaXMgYSBFbGVtZW50TGlzdCByZXR1cm4gaXQsIG90aGVyd2lzZSB3cmFwIHRoZSBub2RlIGluIGEgRWxlbWVudExpc3RcbiAgICovXG4gIGdldE5vZGVzKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBFbGVtZW50TGlzdCkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gbmV3IEVsZW1lbnRMaXN0KG9iaik7XG4gIH1cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgbmF0aXZlIGVsIG9mIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBsaXN0XG4gICAqL1xuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID8gdGhpc1swXSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBlbGVtZW50cyBpbiBvdXJsaXN0XG4gICAqL1xuICBlbXB0eSgpIHtcbiAgICB0aGlzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBhcHBlbmQgb3VyIGxpc3QgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50IG9mIGZpcnN0IG1lbWJlciBvZiBhbiBFbGVtZW50TGlzdFxuICAgKi9cbiAgYXBwZW5kVG8oZCkge1xuICAgIHRoaXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIHRoaXMuZ2V0Tm9kZShkKS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogYXBwZW5kIHRoZSBnaXZlbiBub2RlICggb3IgYWxsIHRoZSBub2RlcyBpZiBkIGlzIGFuIEVsZW1lbnRMaXN0IG9iamVjdCApXG4gICAqIHRvIG91ciBmaXJzdCBlbGVtZW50LlxuICAgKi9cbiAgYXBwZW5kQ2hpbGQoZCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5nZXROb2RlcyhkKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICB0aGlzWzBdLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiByZW1vdmUgYWxsIHRoZSBub2RlcyBvciBub2RlIGZyb20gdGhlIGZpcnN0IG5vZGUgaW4gb3VyIGNvbGxlY3Rpb25cbiAgICovXG4gIHJlbW92ZUNoaWxkKGQpIHtcbiAgICB0aGlzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIHRoaXMuZ2V0Tm9kZXMoZCkuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgYWxsIG91ciBub2RlcyBmcm9tIHRoZWlyIHBhcmVudHNcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBpdGVyYXRlIGV2ZXJ5IG5vZGUgYW5kIGFsbCB0aGVpciBjaGlsZHJlbiBsb29raW5nIGZvciBkYXRhLXJlZj1cIm5hbWVcIiBhdHRyaWJ1dGVzLlxuICAgKiBBc3NpZ24gdGFyZ2V0T2JqZWN0W25hbWVdIHRvIHRoZSBtYXRjaGluZyBET00gZWxlbWVudC5cbiAgICogQ29tbW9ubHkgeW91IGltcG9ydCBzb21lIHRlbXBsYXRlIG9yIEhUTUwgZnJhZ21lbnQgaW50byBhIGNsYXNzIHNvIHRoYXQgdGhlIG1lbWJlciBvZlxuICAgKiB0aGF0IGNsYXNzIGNhbiBzaW1wbGUgcmVmIHRvIHRoaXMubmFtZS5cbiAgICovXG4gIGltcG9ydFJlZnModGFyZ2V0T2JqZWN0KSB7XG4gICAgdGhpcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBbbm9kZV07XG4gICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlZicpO1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgIHRhcmdldE9iamVjdFtuYW1lXSA9IG5ldyBFbGVtZW50TGlzdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgICBzdGFjay5wdXNoKGVsZW1lbnQuY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogaW52b2tlIHRoZSBjYWxsYmFjayBmb3IgYWxsIGltbWVkaWF0ZSBjaGlsZHJlbiBvZiBhbGwgbm9kZXMgaW4gdGhlIGxpc3RcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqL1xuICBmb3JFYWNoQ2hpbGQoY2FsbGJhY2spIHtcbiAgICB0aGlzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAvLyBjb252ZXJ0IEVsZW1lbnRMaXN0IHRvIGEgc2ltcGxlIGFycmF5IHNpbmNlIHRoZSBjYWxsYmFjayBtYXkgbW9kaWZ5IHRoZSBsaXN0IGR1cmluZyB0aGUgY2FsbGJhY2tcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGNoaWxkcmVuW2ldLCBpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQgd2hpdGUgc3BhY2Ugc2VwYXJhdGVkIGNsYXNzZXMgdG8gb3VyIGVsZW1lbnRzIGNsYXNzTGlzdFxuICAgKi9cbiAgYWRkQ2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgY2xhc3Nlcy5zcGxpdCgnICcpXG4gICAgLmZpbHRlcihjbGFzc05hbWUgPT4gY2xhc3NOYW1lLnRyaW0oKS5sZW5ndGgpXG4gICAgLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIHRoaXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgd2hpdGUgc3BhY2Ugc2VwYXJhdGVkIGNsYXNzIG5hbWVzIGZyb20gdGhlIGNsYXNzTGlzdCBvZiBlYWNoIG5vZGVcbiAgICogQHBhcmFtIGNsYXNzZXNcbiAgICogQHJldHVybnMge0VsZW1lbnRMaXN0fVxuICAgKi9cbiAgcmVtb3ZlQ2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgY2xhc3Nlcy5zcGxpdCgnICcpXG4gICAgLmZpbHRlcihjbGFzc05hbWUgPT4gY2xhc3NOYW1lLnRyaW0oKS5sZW5ndGgpXG4gICAgLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIHRoaXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gYSBuZXcgRWxlbWVudExpc3QgY29udGFpbiBhIGRlZXAgY2xvbmVkIGNvcHlcbiAgICogZWFjaCBub2RlXG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEVsZW1lbnRMaXN0KFsuLi50aGlzLm1hcChuID0+IG4uY2xvbmVOb2RlKHRydWUpKV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgZ2l2ZW4gYXR0cmlidXRlIG9uIGFsbCBub2Rlc1xuICAgKi9cbiAgc2V0QXR0cihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaChuID0+IG4uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqL1xuICBnZXRBdHRyKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAobiA9PiBuLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIG1haW50YWlucyBhIHN0YXRpYyBXZWFrTWFwIGhhc2ggdGhhdCBjYW4gYmUgdXNlZCB0byBhc3NvY2lhdGVkXG4gICAqIHJhbmRvbSB3aXRoIGEgRE9NIGVsZW1lbnQuXG4gICAqL1xuICBzZXREYXRhKHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKG4gPT4gbm9kZU1hcFtuXSA9IHZhbHVlKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggb3VyIERPTSBub2Rlcy4gRGF0YSBpcyByZXR1cm5lZFxuICAgKiBhcyBhbiBhcnJheSB3aGVyZSBudWxsIGlzIHVzZWQgZm9yIERPTSBub2RlcyB3aXRoIG5vIGFzc29jaWF0ZWQgZGF0YS5cbiAgICovXG4gIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKG4gPT4gbm9kZU1hcFtuXSk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbGVkIGFkZEV2ZW50TGlzdGVuZXIgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgbGlzdCxcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEBwYXJhbSBoYW5kbGVyXG4gICAqL1xuICBvbihldmVudCwgaGFuZGxlcikge1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZXJlIGFyZSB0aHJlZSB3YXlzIHRvIGNhbGwgb2ZmLlxuICAgKiAxLiBXaXRoIGEgc3BlY2lmaWMgZXZlbnQgYW5kIGhhbmRsZXIgKGlkZW50aWNhbCB0byBhIHByZXZpb3VzIGNhbGwgdG8gLm9uKVxuICAgKiAyLiBXaXRoIGp1c3QgYW4gZXZlbnQgbmFtZSwgYWxsIGhhbmRsZXJzIGZvciB0aGF0IGV2ZW50IHdpbGwgYmUgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgKiAzLiBXaXRoIG5vIHBhcmFtZXRlcnMsIGFsbCBldmVudCBoYW5kbGVycyB3aWxsIGJlIHJlbW92ZWRcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEBwYXJhbSBoYW5kbGVyXG4gICAqL1xuICBvZmYoZXZlbnQsIGhhbmRsZXIpIHtcbiAgfVxufTtcblxuLyoqXG4gKiBXZSBleHBvcnQgYSBmYWN0b3J5IGZ1bmN0aW9uIGZvciBFbGVtZW50TGlzdCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHRoZSBuZXcgb3BlcmF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgRWxlbWVudExpc3QoLi4uYXJndW1lbnRzKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL2RvbS9kb20uanNcbiAqKi8iLCJpbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbi8qKlxuICogY2FjaGUgZm9yIGVsZW1lbnRzIGJhc2VkIG9uIHVzZXIgc3VwcGxpZWQga2V5cy4gQ2FjaGUgY2FuIGJlIGNvbmZpZ3VyZWQgd2l0aFxuICogYSB0aW1lIGludGVydmFsIHVwb24gd2hpY2ggdG8gZGVsZXRlIGVsZW1lbnRzIGZyb20gdGhlIGNhY2hlICggb25seSBpZiBub3QgcHJlc2VudCBpbiB0aGUgRE9NICkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRDYWNoZSB7XG5cbiAgLyoqXG4gICAqIGluaXRpYWxpemUgd2l0aCB0aW1lIHRvIGxpdmUuIE5PVEU6IEFuIGVsZW1lbnQgbXVzdCBiZSBleHBpcmVkIEFORCBub3QgcGFyZW50ZWQgaW50byB0aGUgRE9NXG4gICAqIHRvIGJlIHB1cmdlZCBmcm9tIHRoZSBjYWNoZS5cbiAgICogQHBhcmFtIHR0bFxuICAgKi9cbiAgY29uc3RydWN0b3IodHRsID0gMTAwMDApIHtcbiAgICB0aGlzLmVtcHR5KCk7XG4gICAgdGhpcy50dGwgPSB0dGw7XG4gICAgc2V0SW50ZXJ2YWwodGhpcy5wdXJnZS5iaW5kKHRoaXMpLCB0aGlzLnR0bCk7XG4gIH1cblxuICAvKipcbiAgICogcHVyZ2UgZWxlbWVudHMgdGhhdCBhcmUgbm90IHBhcmVudGVkIGFuZCBoYXZlIGV4Y2VlZGVkIHRoZSB0dGwgc2luY2UgdGhleSB3ZXJlIGxhc3QgdXNlZFxuICAgKi9cbiAgcHVyZ2UoKSB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAvLyBmaW5kIGFsbCB0aGUgZXhwaXJlZCBrZXlzXG4gICAgT2JqZWN0LmtleXModGhpcy5jYWNoZSkuZmlsdGVyKGtleSA9PiB7XG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuY2FjaGVba2V5XTtcbiAgICAgIHJldHVybiAhZW50cnkuZWxlbWVudC5lbC5wYXJlbnROb2RlICYmIChub3cgLSBlbnRyeS5sYXN0UmVmZXJlbmNlZCA+PSB0aGlzLnR0bCk7XG4gICAgfSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMuY2FjaGVba2V5XTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGVsZW1lbnQgdXNpbmcgdGhlIGdpdmVuIGtleSBvciBudWxsIGlmIG5vdCBwcmVzZW50LlxuICAgKiBJZiBwcmVzZW50IHRoZSBsYXN0UmVmZXJlbmNlZCB0aW1lIG9mIHRoZSByZXNvdXJjZSBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRFbGVtZW50KGtleSkge1xuICAgIGNvbnN0IGVudHJ5ID0gIHRoaXMuY2FjaGVba2V5XTtcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFJlZmVyZW5jZWQgdGltZSBvZiB0aGUgZW50cnlcbiAgICAgIGVudHJ5Lmxhc3RSZWZlcmVuY2VkID0gRGF0ZS5ub3coKTtcbiAgICAgIHJldHVybiBlbnRyeS5lbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQgYW4gZWxlbWVudCB0byB0aGUgY2FjaGUgYW5kIGluaXRpYWxpemUgaXRzIGxhc3RSZWZlcmVjZWQgcHJvcGVydHkgdG8gbm93LlxuICAgKiBPdmVyd3JpdGVzIGFueSBleGlzdGluZyBlbGVtZW50IHdpdGggdGhlIHNhbWUgY2FjaGUga2V5XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGFkZEVsZW1lbnQoa2V5LCBlbGVtZW50KSB7XG4gICAgdGhpcy5jYWNoZVtrZXldID0gbmV3IENhY2hlRW50cnkoa2V5LCBlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgdGhlIGdpdmVuIGVsZW1lbnQgZnJvbSB0aGUgY2FjaGVcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgcmVtb3ZlRWxlbWVudChrZXkpIHtcbiAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xuICB9XG5cbiAgLyoqXG4gICAqIGVtcHR5IHRoZSBlbnRpcmUgY2FjaGVcbiAgICovXG4gIGVtcHR5KCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxufVxuXG4vKipcbiAqIGluZGl2aWR1YWwgZW50cnkgaW4gdGhlIGNhY2hlXG4gKi9cbmNsYXNzIENhY2hlRW50cnkge1xuICBjb25zdHJ1Y3RvcihrZXksIGVsZW1lbnQpIHtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBEYXRlLm5vdygpO1xuICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy9kb20vZWxlbWVudGNhY2hlLmpzXG4gKiovIiwiLyoqXG4gKiBtZWFzdXJlIHRoZSB3aWR0aCAvIGhlaWdodCBvZiBjaGFyYWN0ZXJzIHVzaW5nIHRoZSBleGFjdCBmb250IGFuZCBzdHlsZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVuZGVyXG4gKiB0aGUgc2VxdWVuY2UuIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uY2UgdG8gb2J0YWluIHRoZSBzaXplIHNpbmNlIGl0IGlzIGNvc3RseS5cbiAqIEByZXR1cm5zIHt7dzogbnVtYmVyLCBoOiBudW1iZXJ9fVxuICovXG5leHBvcnQgY29uc3QgY2hhck1lYXN1cmUgPSAoKSA9PiB7XG4gIC8vIGNyZWF0ZSBhIHRlbXBvcmFyeSBkaXYgZm9yIG1lYXN1cmluZyBpdHMgY29udGVudHNcbiAgY29uc3QgdGV4dERJViA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICB0ZXh0RElWLmNsYXNzTmFtZSA9IFwicm9ib3RvIGZpeGVkIGZvbnQtc2l6ZSBpbmxpbmUtYmxvY2tcIjtcbiAgdGV4dERJVi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dERJVik7XG4gIC8vIHVzZSBhIHJlcHJlc2VudGF0aXZlIHN0cmluZyBob3BpbmcgZm9yIHRoZSBiZXN0IGF2ZXJhZ2VcbiAgY29uc3QgcHJvYmUgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5MC06Kyc7XG4gIHRleHRESVYuaW5uZXJIVE1MID0gcHJvYmU7XG4gIC8vIG1lYXN1cmUgdGhlIGFjdHVhbCBkaW1lbnNpb25zXG4gIGNvbnN0IHJlc3VsdHMgPSB7XG4gICAgdzp0ZXh0RElWLmNsaWVudFdpZHRoIC8gcHJvYmUubGVuZ3RoLFxuICAgIGg6dGV4dERJVi5jbGllbnRIZWlnaHQsXG4gIH07XG4gIC8vIGRpc3Bvc2UgRElWIG9uY2Ugd2UgaGF2ZSBtZWFzdXJlZFxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHRESVYpO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG4gIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdHMvdmlld2VyL2NoYXJtZWFzdXJlLmpzXG4gKiovIiwiaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IEQgZnJvbSAnLi4vZG9tL2RvbSc7XG5pbXBvcnQgTW91c2VUcmFwIGZyb20gJy4uL2lucHV0L21vdXNldHJhcCc7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSAnLi4vZ2VvbWV0cnkvdmVjdG9yMmQnO1xuaW1wb3J0IEJveDJEIGZyb20gJy4uL2dlb21ldHJ5L2JveDJkJztcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi9zdGF0dXMtYmFyJztcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogUGl4ZWxzIGZyb20gdG9wIG9yIGJvdHRvbSBvZiBjbGllbnQgd2hlcmUgYXV0b3Njcm9sbGluZyBpcyB0cmlnZ2VyZWRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmNvbnN0IGtBVVRPU0NST0xMID0gMzA7XG5cbi8qKlxuICogdmlld3BvcnQgcmVzaXplcyBhcmUgdGhyb3R0bGVkIHRvIHRoaXMgbnVtYmVyIG9mIE1TXG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5jb25zdCBrUkVTSVpFID0gMTAwO1xuXG4vKipcbiAqIG1vdXNlIHdoZWVsIGV2ZW50cyBhcmUgdGhyb3R0bGVzIHRvIHRoaXMgaW50ZXJ2YWxcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmNvbnN0IGtXSEVFTCA9IDc1O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VySW50ZXJmYWNlIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHZpZXdlcjogbnVsbCxcbiAgICB9LCBvcHRpb25zKTtcbiAgICB0aGlzLnZpZXdlciA9IHRoaXMub3B0aW9ucy52aWV3ZXI7XG4gICAgaW52YXJpYW50KHRoaXMudmlld2VyLCAndmlld2VyIG11c3QgYmUgc3VwcGxpZWQgdG8gdXNlciBpbnRlcmZhY2UnKTtcblxuICAgIHRoaXMubGF5ZXIgPSBEKCc8ZGl2IGNsYXNzPVwidXNlcmludGVyZmFjZVwiPjwvZGl2PicpO1xuICAgIHRoaXMudmlld2VyLm91dGVyLmVsLmFwcGVuZENoaWxkKHRoaXMubGF5ZXIuZWwpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIgPSBuZXcgU3RhdHVzQmFyKHRoaXMudmlld2VyKTtcblxuICAgIC8vIHNldHVwIG1vdXNlIGludGVyZmFjZVxuICAgIHRoaXMubW91c2VUcmFwID0gbmV3IE1vdXNlVHJhcCh7XG4gICAgICBlbGVtZW50ICAgIDogdGhpcy5sYXllci5lbCxcbiAgICAgIG1vdXNlRG93biAgOiB0aGlzLm1vdXNlRG93bi5iaW5kKHRoaXMpLFxuICAgICAgbW91c2VVcCAgICA6IHRoaXMubW91c2VVcC5iaW5kKHRoaXMpLFxuICAgICAgbW91c2VNb3ZlICA6IHRoaXMubW91c2VNb3ZlLmJpbmQodGhpcyksXG4gICAgICBtb3VzZURyYWcgIDogdGhpcy5tb3VzZURyYWcuYmluZCh0aGlzKSxcbiAgICAgIG1vdXNlTGVhdmUgOiB0aGlzLm1vdXNlTGVhdmUuYmluZCh0aGlzKSxcbiAgICAgIG1vdXNlV2hlZWwgOiBfLnRocm90dGxlKHRoaXMubW91c2VXaGVlbC5iaW5kKHRoaXMpLCBrV0hFRUwsIHt0cmFpbGluZzogZmFsc2V9KSxcbiAgICAgIGRvdWJsZUNsaWNrOiB0aGlzLmRvdWJsZUNsaWNrLmJpbmQodGhpcyksXG4gICAgfSk7XG5cbiAgICAvLyByZXNpemUgcmVxdWlyZXMgYW4gdXBkYXRlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplSGFuZGxlciA9IF8udGhyb3R0bGUodGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpLCBrUkVTSVpFKSk7XG5cbiAgICAvLyAvLyB0b2dnbGUgcmV2ZXJzZSBzdHJhbmRcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlUmV2ZXJzZVN0cmFuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIC8vICAgdGhpcy52aWV3ZXIuc2hvd1JldmVyc2VTdHJhbmQoIXRoaXMudmlld2VyLnNob3dSZXZlcnNlU3RyYW5kKCkpO1xuICAgIC8vICAgdGhpcy52aWV3ZXIubWFwRGF0YVNldCgpO1xuICAgIC8vICAgdGhpcy52aWV3ZXIucmVuZGVyKCk7XG4gICAgLy8gfSk7XG4gICAgLy9cbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlyc3RSb3cnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAvLyAgIHRoaXMudmlld2VyLmZpcnN0Um93ID0gMDtcbiAgICAvLyAgIHRoaXMudmlld2VyLnJlbmRlcigpO1xuICAgIC8vIH0pO1xuICAgIC8vXG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhc3RSb3cnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAvLyAgIHRoaXMudmlld2VyLmZpcnN0Um93ID0gdGhpcy52aWV3ZXIucm93TGlzdC5sZW5ndGggLSAxO1xuICAgIC8vICAgdGhpcy52aWV3ZXIucmVuZGVyKCk7XG4gICAgLy8gfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhbnVwXG4gICAqL1xuICBkaXNwb3NlKCkge1xuICAgIGludmFyaWFudCghdGhpcy5kaXNwb3NlZCwgJ0FscmVhZHkgZGlzcG9zZWQnKTtcbiAgICB0aGlzLmRpc3Bvc2VkID0gdHJ1ZTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVIYW5kbGVyKTtcbiAgICB0aGlzLm1vdXNlVHJhcC5kaXNwb3NlKCk7XG4gIH1cbiAgLyoqXG4gICAqIHRocm90dGxlZCB3aW5kb3cgcmVzaXplXG4gICAqL1xuICBvblJlc2l6ZSgpIHtcbiAgICBpbnZhcmlhbnQoIXRoaXMudmlld2VyLmRpc3Bvc2VkLCAndmlld2VyIGhhcyBiZWVuIGRpc3Bvc2VkJyk7XG4gICAgdGhpcy52aWV3ZXIucmVzaXplZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdCBhbm5vdGF0aW9uIGlmIGRpcmVjdGx5IGNsaWNrZWQgb3IgcmFuZ2Ugb2YgY2xpY2tlZCBhbm5vdGF0aW9uXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcGFyYW0gbG9jYWxQb3NpdGlvblxuICAgKi9cbiAgZG91YmxlQ2xpY2soZXZlbnQsIGxvY2FsKSB7XG5cbiAgICBjb25zdCBpbmZvID0gdGhpcy5sb2NhbFRvUm93RGV0YWlscyhsb2NhbCk7XG4gICAgaWYgKGluZm8pIHtcbiAgICAgIHN3aXRjaCAoaW5mby5sb2NhdGlvbikge1xuXG4gICAgICBjYXNlICdhbm5vdGF0aW9uJzpcbiAgICAgICAgdGhpcy52aWV3ZXIuc2VsZWN0QW5ub3RhdGlvbihpbmZvLmFubm90YXRpb24uaWQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYmxvY2snOlxuICAgICAgICB0aGlzLnZpZXdlci5zZWxlY3RCbG9jayhpbmZvLmJsb2NrSW5mby5ibG9jay5pZCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbigpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMudmlld2VyLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIG1vdXNlIHdoZWVsIGhhbmRsZXJcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBtb3VzZVdoZWVsKGV2ZW50LCBsb2NhbFBvc2l0aW9uLCBub3JtYWxpemVkKSB7XG4gICAgLy8gaWdub3JlIGlmIG5vIHkgY29tcG9uZW50XG4gICAgaWYgKG5vcm1hbGl6ZWQuc3BpblkgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc2F2ZSBjdXJyZW50IGZpcnN0Um93IHNvIHdlIGNhbiBkZXRlcm1pbmUgaWYgYW55dGhpbmcgY2hhbmdlZFxuICAgIGNvbnN0IGZpcnN0Um93ID0gdGhpcy52aWV3ZXIuZmlyc3RSb3c7XG4gICAgLy8gc3BpblkgaXMgYSBmbG9hdCAwLi5uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gTWF0aC5hYnMobm9ybWFsaXplZC5zcGluWSk7IGkgKz0gMSkge1xuICAgICAgaWYgKG5vcm1hbGl6ZWQuc3BpblkgPCAwKSB7XG4gICAgICAgIHRoaXMudmlld2VyLnByZXZpb3VzUm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdlci5uZXh0Um93KCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIGFueXRoaW5nIGNoYW5nZWQgdXBkYXRlXG4gICAgaWYgKHRoaXMudmlld2VyLmZpcnN0Um93ICE9PSBmaXJzdFJvdykge1xuICAgICAgLy8gcGFzcyB3aGVlbCBldmVudCB0aHJvdWdoIHRvIG1vdXNlIG1vdmVcbiAgICAgIHRoaXMubW91c2VNb3ZlKGV2ZW50LCBsb2NhbFBvc2l0aW9uKTtcbiAgICAgIC8vIHJlZHJhd1xuICAgICAgdGhpcy52aWV3ZXIucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNhbmNlbCBhdXRvc2Nyb2xsIGlmIHJ1bm5pbmdcbiAgICovXG4gIHN0b3BBdXRvU2Nyb2xsKCkge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5hdXRvU2Nyb2xsSWQpO1xuICAgIHRoaXMuYXV0b1Njcm9sbElkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBtb3VzZSBkb3duIGhhbmRsZXIgZnJvbSBtb3VzZSB0cmFwLlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICogQHBhcmFtIGxvY2FsXG4gICAqL1xuICBtb3VzZURvd24oZXZlbnQsIGxvY2FsKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBudWxsO1xuICAgIGNvbnN0IGJvID0gdGhpcy5sb2NhbFRvQmxvY2tPZmZzZXQobG9jYWwpO1xuICAgIGlmIChibykge1xuICAgICAgdGhpcy5hbmNob3IgPSBibztcbiAgICAgIHRoaXMubG9jYWxNb3VzZVByZXZpb3VzRHJhZyA9IGxvY2FsO1xuICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oYm8pO1xuICAgICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGlvbigpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbmNhbCBhdXRvIHNjcm9sbCB3aGVuIG1vdXNlIHJlbGVhc2VkXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcGFyYW0gbG9jYWxcbiAgICovXG4gIG1vdXNlVXAoZXZlbnQsIGxvY2FsKSB7XG4gICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGF1dG9zY3JvbGwgdXAgb3IgZG93biBhY2NvcmRpbmcgdG8gbG9jYXRpb24gb2YgbW91c2UuXG4gICAqL1xuICBhdXRvU2Nyb2xsKCkge1xuICAgIGNvbnN0IGIgPSB0aGlzLmxheWVyLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICh0aGlzLmxvY2FsTW91c2VQcmV2aW91c0RyYWcueSA8IGtBVVRPU0NST0xMKSB7XG4gICAgICB0aGlzLnZpZXdlci5wcmV2aW91c1JvdygpO1xuICAgICAgdGhpcy5tb3VzZURyYWcobnVsbCwgdGhpcy5sb2NhbE1vdXNlUHJldmlvdXNEcmFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubG9jYWxNb3VzZVByZXZpb3VzRHJhZy55ID49IChiLmJvdHRvbSAtIGIudG9wKSAtIGtBVVRPU0NST0xMKSB7XG4gICAgICAgIHRoaXMudmlld2VyLm5leHRSb3coKTtcbiAgICAgICAgdGhpcy5tb3VzZURyYWcobnVsbCwgdGhpcy5sb2NhbE1vdXNlUHJldmlvdXNEcmFnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlIHNlbGVjdGlvbiBhcyB1c2VyIGRyYWdzXG4gICAqL1xuICBtb3VzZURyYWcoZXZlbnQsIGxvY2FsKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLmxvY2FsTW91c2VQcmV2aW91c0RyYWcgPSBsb2NhbDtcbiAgICAgIGNvbnN0IGJvID0gdGhpcy5sb2NhbFRvQmxvY2tPZmZzZXQobG9jYWwpO1xuICAgICAgaWYgKGJvKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKHRoaXMuYW5jaG9yLCBibyk7XG4gICAgICB9XG4gICAgICAvLyBzdGFydCBhdXRvIHNjcm9sbCBpZiBub3QgYWxyZWFkeVxuICAgICAgaWYgKCF0aGlzLmF1dG9TY3JvbGxJZCkge1xuICAgICAgICB0aGlzLmF1dG9TY3JvbGxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmF1dG9TY3JvbGwuYmluZCh0aGlzKSwgMTAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aWV3ZXIucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogbW91c2UgbW92ZSwgd2hpY2ggc2hvdWxkIG9ubHkgb2NjdXIgaWYgbm90IGRyYWdnaW5nICggc2VsZWN0aW5nIClcbiAgICovXG4gIG1vdXNlTW92ZShldmVudCwgbG9jYWwpIHtcbiAgICAvLyB0aGUgY3Vyc29yIGlzIHN0b3JlZCBpbiBjbGllbnQgYXJlYSBjb2x1bW4vcm93XG4gICAgbGV0IHYgPSB0aGlzLmxvY2FsVG9Db2x1bW5Sb3cobG9jYWwpO1xuICAgIGlmICghdikge1xuICAgICAgdGhpcy5jdXJzb3IgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnNvciA9IHYuc3ViKG5ldyBWZWN0b3IyRCgwLCB0aGlzLnZpZXdlci5maXJzdFJvdykpO1xuICAgIH1cbiAgICB0aGlzLmNsYW1wQ3Vyc29yKCk7XG4gICAgdGhpcy5yZW5kZXJDdXJzb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBoaWRlIGN1cnNvciBvbiBtb3VzZSBsZWF2ZVxuICAgKi9cbiAgbW91c2VMZWF2ZSgpIHtcbiAgICB0aGlzLmhpZGVDdXJzb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBoaWRlIHRoZSBjdXJzb3JcbiAgICovXG4gIGhpZGVDdXJzb3IoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyQ3Vyc29yKCk7XG4gIH1cblxuICAvKipcbiAgICogZW5zdXJlIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiBpcyBzdGlsbCB3aXRoaW4gdGhlIGRhdGEgcmFuZ2VcbiAgICovXG4gIGNsYW1wQ3Vyc29yKCkge1xuICAgIGlmICh0aGlzLmN1cnNvcikge1xuICAgICAgY29uc3QgY2xpZW50VG9wID0gbmV3IFZlY3RvcjJEKDAsIHRoaXMudmlld2VyLmZpcnN0Um93KTtcbiAgICAgIGxldCBibG9ja09mZnNldCA9IHRoaXMuY29sdW1uUm93VG9CbG9ja09mZnNldCh0aGlzLmN1cnNvci5hZGQoY2xpZW50VG9wKSk7XG4gICAgICBpZiAoIWJsb2NrT2Zmc2V0KSB7XG4gICAgICAgIC8vIGNsYW1wIHRvIGxhc3QgY2hhcmFjdGVyIG9mIGxhc3QgYmxvY2tcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLnZpZXdlci5ibG9ja0xpc3RbdGhpcy52aWV3ZXIuYmxvY2tMaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgICBibG9ja09mZnNldCA9IHtcbiAgICAgICAgICBibG9jayxcbiAgICAgICAgICBibG9ja09mZnNldDogdGhpcy52aWV3ZXIuYmxvY2tEaXNwbGF5TGVuZ3RoKGJsb2NrKSAtIDEsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5ibG9ja09mZnNldFRvQ29sdW1uUm93KGJsb2NrT2Zmc2V0KS5zdWIoY2xpZW50VG9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSBsb2NhbCBjb29yZGluYXRlcyBhbmQgcmV0dXJucyBhcyBhIGNvbHVtbi9yb3cgdmVjdG9yXG4gICAqIEBwYXJhbSB2ZWN0b3JcbiAgICovXG4gIGxvY2FsVG9Db2x1bW5Sb3codmVjdG9yKSB7XG5cbiAgICAvLyBnZXQgYW5kIHRlc3Qgcm93IGZpcnN0XG4gICAgY29uc3Qgcm93ID0gdGhpcy52aWV3ZXIuZ2V0Um93SW5kZXhGcm9tWSh2ZWN0b3IueSk7XG4gICAgaWYgKHJvdyA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBnZXQgYW5kIHRlc3QgY29sdW1uXG4gICAgY29uc3QgY29sdW1uID0gdGhpcy52aWV3ZXIuZ2V0Q29sdW1uSW5kZXhGcm9tWCh2ZWN0b3IueCwgcm93KTtcbiAgICBpZiAoY29sdW1uIDwgMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIGJvdGggYXJlIHdpdGhpbiB0aGUgZGF0YSBzZXRcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKGNvbHVtbiwgcm93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgZGV0YWlsZWQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGNvbHVtbiAvIHJvdyBjbGlja2VkIGFuZCB3aGF0IGV4YWN0bHkgaXNcbiAgICogYXQgdGhlIGxvY2F0aW9uLiBVc2VkIGZvciBvcGVyYXRpb24gbGlrZSBkb3VibGUgY2xpY2sgd2hlcmUgd2UgbmVlZCB0byBrbm93XG4gICAqIGlmIHRoZSB1c2VyIGNsaWNrZWQgYW4gYW5ub3RhdGlvbiBvciB0aGUgYmxvY2suXG4gICAqIFJldHVybnM6XG4gICAqIElmIHRoZSBwb2ludCBpcyB3aXRoaW4gYSBjb2x1bW4gYW5kIHJvdyB3ZSByZXR1cm5cbiAgICoge1xuICAgKiAgcm93OiBudW1iZXIsXG4gICAqICBjb2x1bW46IG51bWJlcixcbiAgICogIGxvY2F0aW9uOiBvbmUgb2YgWydzZXF1ZW5jZScsICdzZXBhcmF0b3InLCAncmV2ZXJzZScsICdibG9jaycsICdhbm5vdGF0aW9uJywgJ3J1bGVyJ11cbiAgICogIGJsb2NrOiBpZiBsb2NhdGlvbiA9PT0gJ2Jsb2NrJyB0aGlzIGlzIHRoZSBibG9ja0luZm9cbiAgICogIGFubm90YXRpb246IGlmIGxvY2F0aW9uID09PSAnYW5ub3RhdGlvbicgdGhpcyBpcyB0aGUgYW5ub3RhdGlvbkluZm9cbiAgICogfVxuICAgKlxuICAgKiBAcGFyYW0gdmVjdG9yXG4gICAqL1xuICBsb2NhbFRvUm93RGV0YWlscyh2ZWN0b3IpIHtcbiAgICBjb25zdCBjb2x1bW5Sb3cgPSB0aGlzLmxvY2FsVG9Db2x1bW5Sb3codmVjdG9yKTtcbiAgICBsZXQgaW5mbyA9IG51bGw7XG4gICAgaWYgKGNvbHVtblJvdykge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBpbmZvIHdpdGggY29sdW1uIGFuZCByb3dcbiAgICAgIGluZm8gPSB7Y29sdW1uOiBjb2x1bW5Sb3cueCwgcm93OiBjb2x1bW5Sb3cueX07XG4gICAgICAvLyBsb2NhdGlvbiBpcyB2YWxpZCwgZmlndXJlIG91dCB3aGVyZSB0aGUgdXNlciBjbGlja2VkLlxuICAgICAgY29uc3QgYm94ID0gdGhpcy52aWV3ZXIuZ2V0Um93Qm91bmRzKGNvbHVtblJvdy55KTtcbiAgICAgIC8vIGNsaWNrIHdhcyB3aXRoaW4gdGhlIHNlcXVlbmNlIHJvdz9cbiAgICAgIGlmICh2ZWN0b3IueSA8IGJveC55ICsgdGhpcy52aWV3ZXIuZ2V0Q2hhckhlaWdodCgpKSB7XG4gICAgICAgIGluZm8ubG9jYXRpb24gPSAnc2VxdWVuY2UnO1xuICAgICAgfVxuICAgICAgLy8gY2xpY2sgd2FzIHdpdGhpbiBzZXBhcmF0b3Igcm93P1xuICAgICAgaWYgKCFpbmZvLmxvY2F0aW9uICYmIHZlY3Rvci55IDwgYm94LnkgKyB0aGlzLnZpZXdlci5nZXRDaGFySGVpZ2h0KCkgKiAyKSB7XG4gICAgICAgIGluZm8ubG9jYXRpb24gPSAnc2VwYXJhdG9yJztcbiAgICAgIH1cbiAgICAgIC8vIHJldmVyc2Ugc3RyYW5kIGlmIHByZXNlbnRcbiAgICAgIGlmICghaW5mby5sb2NhdGlvbiAmJiB0aGlzLnZpZXdlci5vcHRpb25zLnJldmVyc2UgJiYgdmVjdG9yLnkgPCBib3gueSArIHRoaXMudmlld2VyLmdldENoYXJIZWlnaHQoKSAqIDMpIHtcbiAgICAgICAgaW5mby5sb2NhdGlvbiA9ICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIC8vIGJsb2NrP1xuICAgICAgbGV0IHlPZmZzZXQgPSB0aGlzLnZpZXdlci5vcHRpb25zLnJldmVyc2UgPyB0aGlzLnZpZXdlci5nZXRDaGFySGVpZ2h0KCkgKiA0IDogdGhpcy52aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICogMztcbiAgICAgIGlmICghaW5mby5sb2NhdGlvbiAmJiB2ZWN0b3IueSA8IGJveC55ICsgeU9mZnNldCkge1xuICAgICAgICBpbmZvLmxvY2F0aW9uID0gJ2Jsb2NrJztcbiAgICAgICAgaW5mby5ibG9ja0luZm8gPSB0aGlzLmNvbHVtblJvd1RvQmxvY2tPZmZzZXQoY29sdW1uUm93KTtcbiAgICAgIH1cbiAgICAgIC8vIG9uZSBvZiB0aGUgYW5ub3RhdGlvbnM/XG4gICAgICBpZiAoIWluZm8ubG9jYXRpb24pIHtcbiAgICAgICAgLy8gZ2V0IGZpcnN0IHJvdyBmb3IgYW5ub3RhdGlvbnNcbiAgICAgICAgY29uc3Qgc3RhcnRSb3cgPSB0aGlzLnZpZXdlci5vcHRpb25zLnJldmVyc2UgPyA0IDogMztcbiAgICAgICAgLy8gc2VhcmNoIGZvciBhbiBhbm5vdGF0aW9uIGNvbnRhaW5pbmcgdGhlIHgveSBwb3NpdGlvblxuICAgICAgICBjb25zdCByb3dJbmZvID0gdGhpcy52aWV3ZXIucm93TGlzdFtjb2x1bW5Sb3cueV07XG4gICAgICAgIGlmIChyb3dJbmZvLmFubm90YXRpb25SZWNvcmRzKSB7XG4gICAgICAgICAgY29uc3QgYVJlY29yZCA9IHJvd0luZm8uYW5ub3RhdGlvblJlY29yZHMuZmluZChhUmVjb3JkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFCb3ggPSBuZXcgQm94MkQoXG4gICAgICAgICAgICAgIGFSZWNvcmQuc3RhcnQgKiB0aGlzLnZpZXdlci5nZXRDaGFyV2lkdGgoKSxcbiAgICAgICAgICAgICAgKHN0YXJ0Um93ICsgYVJlY29yZC5kZXB0aCkgKiB0aGlzLnZpZXdlci5nZXRDaGFySGVpZ2h0KCksXG4gICAgICAgICAgICAgIChhUmVjb3JkLmVuZCAtIGFSZWNvcmQuc3RhcnQpICogdGhpcy52aWV3ZXIuZ2V0Q2hhcldpZHRoKCksXG4gICAgICAgICAgICAgIHRoaXMudmlld2VyLmdldENoYXJIZWlnaHQoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBhQm94LnBvaW50SW5Cb3gobmV3IFZlY3RvcjJEKHZlY3Rvci54LCB2ZWN0b3IueSAtIGJveC55KSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBkaWQgd2UgaGl0IGFuIGFubm90YXRpb24gP1xuICAgICAgICAgIGlmIChhUmVjb3JkKSB7XG4gICAgICAgICAgICBpbmZvLmxvY2F0aW9uID0gJ2Fubm90YXRpb24nO1xuICAgICAgICAgICAgaW5mby5hbm5vdGF0aW9uID0gYVJlY29yZC5hbm5vdGF0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gdGVzdCBmb3IgcnVsZXIsIHdoaWNoIGlzIGJlbG93IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgaWYgKCFpbmZvLmxvY2F0aW9uKSB7XG4gICAgICAgIC8vIHRha2UgaW50byBhY2NvdW50IGRlcHRoIG9mIGFubm90YXRpb24gbmVzdGVkIGFuIDEvMiBjaGFyIHZlcnRpY2FsIHBhZGRpbmcgYmVmb3JlIHJ1bGVyXG4gICAgICAgIGNvbnN0IGFEZXB0aCA9IHRoaXMudmlld2VyLnJvd0xpc3RbY29sdW1uUm93LnldLmFubm90YXRpb25EZXB0aCArIDAuNTtcbiAgICAgICAgbGV0IHlPZmZzZXQgPSAoYURlcHRoICsgKHRoaXMudmlld2VyLm9wdGlvbnMucmV2ZXJzZSA/IDQgOiAzKSkgKiB0aGlzLnZpZXdlci5nZXRDaGFySGVpZ2h0KCk7XG4gICAgICAgIGlmICghaW5mby5sb2NhdGlvbiAmJiB2ZWN0b3IueSA+PSBib3gueSArIHlPZmZzZXQpIHtcbiAgICAgICAgICBpbmZvLmxvY2F0aW9uID0gJ3J1bGVyJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIGJsb2NrIGFuZCBvZmZzZXQgaW50byB0aGUgYmxvY2sgZGVub3RlZCBieSB0aGUgZ2l2ZW5cbiAgICogY29sdW1uL3JvdyB2ZWN0b3JcbiAgICogQHBhcmFtIHZlY3RvclxuICAgKi9cbiAgY29sdW1uUm93VG9CbG9ja09mZnNldCh2ZWN0b3IpIHtcbiAgICAvLyBnZXQgYWxsIHRoZSByZWNvcmRzIGZvciB0aGUgcm93XG4gICAgY29uc3Qgcm93SW5mbyA9IHRoaXMudmlld2VyLnJvd0xpc3RbdmVjdG9yLnldO1xuICAgIC8vIG91dCBvZiBib3VuZHNcbiAgICBpZiAoIXJvd0luZm8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBpdGVyYXRlIHRocm91Z2ggcm93IHJlY29yZHMgdG8gZmluZCB0aGUgYW5zd2VyXG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJbmZvLmJsb2NrUmVjb3Jkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5mbyA9IHJvd0luZm8uYmxvY2tSZWNvcmRzW2ldO1xuICAgICAgaWYgKHZlY3Rvci54IDwgb2Zmc2V0ICsgaW5mby5sZW5ndGgpIHtcbiAgICAgICAgLy8gZmFsbHMgd2l0aGluIHRoaXMgYmxvY2tcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBibG9jayAgICAgIDogaW5mby5ibG9jayxcbiAgICAgICAgICBibG9ja09mZnNldDogdmVjdG9yLnggLSBvZmZzZXQgKyBpbmZvLnN0YXJ0QmxvY2tPZmZzZXQsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvZmZzZXQgKz0gaW5mby5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIGhlcmUgdGhlIHVzZXIgY2xpY2tlZCBiZXlvbmQgdGhlIGVuZCBvZiB0aGUgbGFzdCBibG9ja1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnZlcnQgYSBibG9jayBhbmQgYmxvY2sgb2Zmc2V0IGludG8gYSBjb2x1bW4gYW5kIHJvdyBpLmUuIHRha2VzIHRoZSBvdXRwdXQgb2YgY29sdW1uVG9CbG9ja09mZnNldFxuICAgKiBhbmQgY29udmVydHMgaXQgYmFjayB0byBhIGNvbHVtbi9yb3cgdmVjdG9yXG4gICAqIEBwYXJhbSBpbmZvXG4gICAqL1xuICBibG9ja09mZnNldFRvQ29sdW1uUm93KGluZm8pIHtcbiAgICAvLyBnZXQgdGhlIHN0YXJ0aW5nIC8gZW5kIHJvdyBhbmQgY29sdW1uIGZvciB0aGUgYmxvY2tcbiAgICBjb25zdCBibG9ja0luZm8gPSB0aGlzLnZpZXdlci5ibG9ja1Jvd01hcFtpbmZvLmJsb2NrLmlkXTtcbiAgICBjb25zdCByb3cgPSBibG9ja0luZm8uc3RhcnRSb3cgKyAoKGJsb2NrSW5mby5zdGFydFJvd09mZnNldCArIGluZm8uYmxvY2tPZmZzZXQpIC8gdGhpcy52aWV3ZXIucm93TGVuZ3RoID4+IDApO1xuICAgIGNvbnN0IGNvbCA9IChibG9ja0luZm8uc3RhcnRSb3dPZmZzZXQgKyBpbmZvLmJsb2NrT2Zmc2V0KSAlIHRoaXMudmlld2VyLnJvd0xlbmd0aDtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKGNvbCwgcm93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb252ZXJ0IGxvY2FsIG1vdXNlIGNvb3JkaW5hdGVzIGRpcmVjdGx5IGludG8gYmxvY2svYmxvY2tPZmZzZXQgd2l0aCBjbGFtcGluZyBhcyByZXF1ZXN0ZWQgYnkgdXNlclxuICAgKiBAcGFyYW0gbG9jYWxcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBsb2NhbFRvQmxvY2tPZmZzZXQobG9jYWwpIHtcbiAgICBjb25zdCB2ID0gdGhpcy5sb2NhbFRvQ29sdW1uUm93KGxvY2FsKTtcbiAgICByZXR1cm4gdiA/IHRoaXMuY29sdW1uUm93VG9CbG9ja09mZnNldCh2KSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogcmVuZGVyIGFsbCB1c2VyIGludGVyZmFjZSBjb21wb25lbnRzXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgLy9jb25zb2xlLnRpbWUoJ1JlbmRlciBVSScpO1xuICAgIHRoaXMucmVuZGVyQ3Vyc29yKCk7XG4gICAgdGhpcy5yZW5kZXJTZWxlY3Rpb24oKTtcbiAgICAvL2NvbnNvbGUudGltZUVuZCgnUmVuZGVyIFVJJylcbiAgfVxuXG4gIC8qKlxuICAgKiByZW5kZXIgdGhlIGN1cnNvclxuICAgKi9cbiAgcmVuZGVyQ3Vyc29yKCkge1xuICAgIC8vIGN1cnNvciBpcyBkZWZpbmVkIGJ5IGJsb2NrIGFuZCBvZmZzZXRcbiAgICBpZiAodGhpcy5jdXJzb3IpIHtcbiAgICAgIC8vIGNyZWF0ZSBET00gYXMgbmVjZXNzYXJ5IGFuZCB1cGRhdGVcbiAgICAgIGlmICghdGhpcy5jdXJzb3JFbCkge1xuICAgICAgICB0aGlzLmN1cnNvckVsID0gRCgnPGRpdiBjbGFzcz1cImN1cnNvclwiPjwvZGl2PicpO1xuICAgICAgICB0aGlzLmxheWVyLmFwcGVuZENoaWxkKHRoaXMuY3Vyc29yRWwpO1xuICAgICAgfVxuICAgICAgY29uc3QgYm94ID0gdGhpcy52aWV3ZXIuZ2V0Um93Qm91bmRzKHRoaXMuY3Vyc29yLnkgKyB0aGlzLnZpZXdlci5maXJzdFJvdyk7XG4gICAgICB0aGlzLmN1cnNvckVsLnNldFN0eWxlcyh7XG4gICAgICAgIGxlZnQgIDogdGhpcy52aWV3ZXIuZ2V0Q2hhcldpZHRoKCkgKiB0aGlzLmN1cnNvci54ICsgJ3B4JyxcbiAgICAgICAgdG9wICAgOiBib3gueSArICdweCcsXG4gICAgICAgIHdpZHRoIDogdGhpcy52aWV3ZXIuZ2V0Q2hhcldpZHRoKCkgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IGJveC5oZWlnaHQgLSB0aGlzLnZpZXdlci5nZXRDaGFySGVpZ2h0KCkgKiAzLjUgKyAncHgnLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRQb3NpdGlvbigodGhpcy5jdXJzb3IueSArIHRoaXMudmlld2VyLmZpcnN0Um93KSAqIHRoaXMudmlld2VyLnJvd0xlbmd0aCArIHRoaXMuY3Vyc29yLngpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBjdXJzb3IgZGVmaW5lZCByZW1vdmUgRE9NIGlmIHByZXNlbnRcbiAgICAgIGlmICh0aGlzLmN1cnNvckVsKSB7XG4gICAgICAgIHRoaXMuY3Vyc29yRWwucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuY3Vyc29yRWwgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXR1c0Jhci5zZXRQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZW5kZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGludG8gdGhlIHZpZXdlcnMgRE9NXG4gICAqL1xuICByZW5kZXJTZWxlY3Rpb24oKSB7XG4gICAgLy8gcmVtb3ZlIGV4aXN0aW5nIHNlbGVjdGlvbiBlbGVtZW50c1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWxlY3Rpb25FbGVtZW50cyA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGlvbikge1xuICAgICAgLy8gb25seSBkaXNwbGF5IHNlbGVjdGlvbiBib2R5IGlmIHRoZXJlIGlzIGEgcmFuZ2VcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dFbmQpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSByYW5nZSBvZiB0aGUgc2VsZWN0aW9uIGFuZCBjbGFtcCB0byB0aGUgY3VycmVudCBib3VuZHMgb2YgdGhlIGNsaWVudCBhcmVhXG4gICAgICAgIGNvbnN0IHZpZXdlckZpcnN0Um93ID0gdGhpcy52aWV3ZXIuZmlyc3RSb3c7XG4gICAgICAgIGNvbnN0IHZpZXdlckxhc3RSb3cgPSB0aGlzLnZpZXdlci5maXJzdFJvdyArIHRoaXMudmlld2VyLnJvd3NWaXNpYmxlKCk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gTWF0aC5tYXgodGhpcy5zZWxlY3Rpb24uY29sdW1uUm93U3RhcnQueSwgdmlld2VyRmlyc3RSb3cpO1xuICAgICAgICBjb25zdCBlbmQgPSBNYXRoLm1pbih0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dFbmQueSwgdmlld2VyTGFzdFJvdyk7XG4gICAgICAgIC8vIGlmIGFueSBvZiB0aGUgcmFuZ2UgaXMgdmlzaWJsZSB0aGVuIGRpc3BsYXkgaXRcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3QgZWwgPSBEKCc8ZGl2IGNsYXNzPVwic2VsZWN0aW9uLWJveFwiPjwvZGl2PicpO1xuICAgICAgICAgIGNvbnN0IGJveCA9IHRoaXMudmlld2VyLmdldFJvd0JvdW5kcyhpKTtcbiAgICAgICAgICAvLyBpZ25vcmUgaWYgcm93IG5vdCB2aXNpYmxlXG4gICAgICAgICAgaWYgKCFib3guaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAvLyBhZGp1c3QgYm94IGlmIHRoaXMgaXMgdGhlIGZpcnN0IHJvdyBhbmQgYWRkIGxlZnQgYm9yZGVyIGNsYXNzXG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5zZWxlY3Rpb24uY29sdW1uUm93U3RhcnQueSkge1xuICAgICAgICAgICAgICBib3gueCA9IHRoaXMuc2VsZWN0aW9uLmNvbHVtblJvd1N0YXJ0LnggKiB0aGlzLnZpZXdlci5nZXRDaGFyV2lkdGgoKTtcbiAgICAgICAgICAgICAgYm94LncgPSAodGhpcy52aWV3ZXIucm93TGVuZ3RoIC0gdGhpcy5zZWxlY3Rpb24uY29sdW1uUm93U3RhcnQueCkgKiB0aGlzLnZpZXdlci5nZXRDaGFyV2lkdGgoKTtcbiAgICAgICAgICAgICAgZWwuYWRkQ2xhc3NlcygnbGVmdC1lZGdlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhZGp1c3QgYm94IGFnYWluIGlmIHRoaXMgaXMgdGhlIGxhc3Qgcm93IGFuZCBhZGQgcmlnaHQgZWRnZSBjc3MgY2xhc3NcbiAgICAgICAgICAgIGlmIChpID09PSB0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dFbmQueSkge1xuICAgICAgICAgICAgICBib3gudyAtPSAodGhpcy52aWV3ZXIucm93TGVuZ3RoIC0gdGhpcy5zZWxlY3Rpb24uY29sdW1uUm93RW5kLnggLSAxKSAqIHRoaXMudmlld2VyLmdldENoYXJXaWR0aCgpO1xuICAgICAgICAgICAgICBlbC5hZGRDbGFzc2VzKCdyaWdodC1lZGdlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5zZXRTdHlsZXMoe1xuICAgICAgICAgICAgICBsZWZ0ICA6IGJveC54ICsgJ3B4JyxcbiAgICAgICAgICAgICAgdG9wICAgOiBib3gueSArICdweCcsXG4gICAgICAgICAgICAgIHdpZHRoIDogYm94LncgKyAncHgnLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGJveC5oIC0gdGhpcy52aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICogMy41ICsgJ3B4JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gYWRkIHRvIGxpc3Qgb2Ygc2VsZWN0aW9uIGVsZW1lbnRzIGFuZCBhZGQgdG8gdGhlIERPTVxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25FbGVtZW50cyA9IHRoaXMuc2VsZWN0aW9uRWxlbWVudHMgfHwgW107XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkVsZW1lbnRzLnB1c2goZWwpO1xuICAgICAgICAgICAgdGhpcy5sYXllci5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNvbXBhcmUgdHdvIGJsb2NrIG9mZnNldCBmb3IgZXF1YWxpdHlcbiAgICogQHBhcmFtIGJvMVxuICAgKiBAcGFyYW0gYm8yXG4gICAqL1xuICBibG9ja09mZnNldEVxdWFsKGJvMSwgYm8yKSB7XG4gICAgLy8gYm90aCBmYWxzZSwgZXF1YWxcbiAgICBpZiAoIWJvMSAmJiAhYm8yKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gb25lIGlzIGZhbHNlLCBvdGhlciBpcyB0cnVlXG4gICAgaWYgKCEhYm8xICE9PSAhIWJvMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gYm8xLmJsb2NrLmlkID09PSBibzIuYmxvY2suaWQgJiYgYm8xLmJsb2NrT2Zmc2V0ID09PSBibzIuYmxvY2tPZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSByYW5nZSBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEFsbCBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cbiAgICogSWYgbm8gcGFyYW1ldGVycyBhcmUgcHJvdmlkZWQgdGhlIHNlbGVjdGlvbiBpcyByZXNldC5cbiAgICogSWYgb25seSB0aGUgc3RhcnQgaXMgZ2l2ZW4gdGhlIHNlbGVjdGlvbiBpcyBqdXN0IGEgbG9jYXRpb24sIGlmIGJvdGggYXJlIHByb3ZpZGVkXG4gICAqIGl0IGRlZmluZXMgYSByYW5nZS5cbiAgICogQHBhcmFtIGJsb2NrT2Zmc2V0U3RhcnRcbiAgICogQHBhcmFtIGJsb2NrT2Zmc2V0RW5kXG4gICAqL1xuICBzZXRTZWxlY3Rpb24oYmxvY2tPZmZzZXRTdGFydCwgYmxvY2tPZmZzZXRFbmQpIHtcblxuICAgIC8vIHJlc2V0IGlmIG5vIHNlbGVjdGlvbiBnaXZlblxuICAgIGlmICghYmxvY2tPZmZzZXRTdGFydCAmJiAhYmxvY2tPZmZzZXRFbmQpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW52YXJpYW50KGJsb2NrT2Zmc2V0U3RhcnQsICdzdGFydCBtdXN0IGJlIGRlZmluZWQgdW5sZXNzIHJlc2V0dGluZyB0aGUgc2VsZWN0aW9uJyk7XG4gICAgICAvLyBzdGFydCB0byBjb2x1bW4vcm93XG4gICAgICBsZXQgY29sdW1uUm93U3RhcnQgPSB0aGlzLmJsb2NrT2Zmc2V0VG9Db2x1bW5Sb3coYmxvY2tPZmZzZXRTdGFydCk7XG4gICAgICAvLyBkZWZpbmUgc3RhcnQgcG9pbnQgaWYgb25seSBzdGFydCBnaXZlblxuICAgICAgaWYgKCFibG9ja09mZnNldEVuZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IHtcbiAgICAgICAgICBibG9ja09mZnNldFN0YXJ0LFxuICAgICAgICAgIGNvbHVtblJvd1N0YXJ0LFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBjb2x1bW4vcm93IHZlY3RvciBmb3IgdGhlIHNlbGVjdGlvbiBhbmQgbm9ybWFsaXplIHRvIGVuc3VyZSBzdGFydCA8PSBlbmRcbiAgICAgICAgbGV0IGNvbHVtblJvd0VuZCA9IHRoaXMuYmxvY2tPZmZzZXRUb0NvbHVtblJvdyhibG9ja09mZnNldEVuZCk7XG4gICAgICAgIGlmIChjb2x1bW5Sb3dTdGFydC55IDwgY29sdW1uUm93RW5kLnkgfHwgKGNvbHVtblJvd1N0YXJ0LnkgPT09IGNvbHVtblJvd0VuZC55ICYmIGNvbHVtblJvd1N0YXJ0LnggPD0gY29sdW1uUm93RW5kLngpKSB7XG4gICAgICAgICAgLy8gc3RhcnQgaXMgYWxyZWFkeSA8PSBlbmRcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IHtcbiAgICAgICAgICAgIGJsb2NrT2Zmc2V0U3RhcnQsXG4gICAgICAgICAgICBibG9ja09mZnNldEVuZCxcbiAgICAgICAgICAgIGNvbHVtblJvd1N0YXJ0LFxuICAgICAgICAgICAgY29sdW1uUm93RW5kLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3dhcCBzdGFydCBhbmQgZW5kXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSB7XG4gICAgICAgICAgICBibG9ja09mZnNldFN0YXJ0OiBibG9ja09mZnNldEVuZCxcbiAgICAgICAgICAgIGJsb2NrT2Zmc2V0RW5kICA6IGJsb2NrT2Zmc2V0U3RhcnQsXG4gICAgICAgICAgICBjb2x1bW5Sb3dTdGFydCAgOiBjb2x1bW5Sb3dFbmQsXG4gICAgICAgICAgICBjb2x1bW5Sb3dFbmQgICAgOiBjb2x1bW5Sb3dTdGFydCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHVwZGF0ZSBzdGF0dXMgYmFyIHdpdGggc2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uICYmIHRoaXMuc2VsZWN0aW9uLmNvbHVtblJvd1N0YXJ0KSB7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRTdGFydCh0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dTdGFydC55ICogdGhpcy52aWV3ZXIucm93TGVuZ3RoICsgdGhpcy5zZWxlY3Rpb24uY29sdW1uUm93U3RhcnQueCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFN0YXJ0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGlvbiAmJiB0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dFbmQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEVuZCh0aGlzLnNlbGVjdGlvbi5jb2x1bW5Sb3dFbmQueSAqIHRoaXMudmlld2VyLnJvd0xlbmd0aCArIHRoaXMuc2VsZWN0aW9uLmNvbHVtblJvd0VuZC54KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0RW5kKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCBzZWxlY3Rpb24gZnJvbSBjb2x1bW5Sb3cgdmVjdG9ycyB2ZXJzdXMgYmxvY2tzXG4gICAqL1xuICBzZXRTZWxlY3Rpb25Gcm9tQ29sdW1uUm93KHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnNldFNlbGVjdGlvbih0aGlzLmNvbHVtblJvd1RvQmxvY2tPZmZzZXQoc3RhcnQpLCB0aGlzLmNvbHVtblJvd1RvQmxvY2tPZmZzZXQoZW5kKSk7XG4gIH1cblxuICAvKipcbiAgICogY2FsbGVkIHdoZW4gdGhlIHNpemUgaXMgY2hhbmdlZCB0byByZXNldCBvdXIgc2VsZWN0aW9uXG4gICAqL1xuICB1cGRhdGVTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTZWxlY3Rpb24odGhpcy5zZWxlY3Rpb24gPyB0aGlzLnNlbGVjdGlvbi5ibG9ja09mZnNldFN0YXJ0IDogbnVsbCwgdGhpcy5zZWxlY3Rpb24gPyB0aGlzLnNlbGVjdGlvbi5ibG9ja09mZnNldEVuZCA6IG51bGwpO1xuICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy92aWV3ZXIvdXNlcmludGVyZmFjZS5qc1xuICoqLyIsImltcG9ydCBWZWN0b3IyRCBmcm9tICcuLi9nZW9tZXRyeS92ZWN0b3IyZCc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgRCBmcm9tICcuLi9kb20vZG9tJztcblxuLyoqXG4gKiBtb3VzZSB3aGVlbCBjb25zdGFudHNcbiAqL1xuY29uc3QgUElYRUxfU1RFUCAgPSAxMDtcbmNvbnN0IExJTkVfSEVJR0hUID0gNDA7XG5jb25zdCBQQUdFX0hFSUdIVCA9IDgwMDtcblxuLyoqXG4gKiBNUyBhbmQgcGl4ZWwgdGhyZXNob2xkcyB0byByZWdpc3RlciBhIGRvdWJsZSBjbGlja1xuICovXG5jb25zdCBkb3VibGVDbGlja1RpbWVUaHJlc2hvbGQgPSA1MDA7XG5jb25zdCBkb3VibGVDbGlja1NwYXRpYWxUaHJlc2hvbGQgPSA0O1xuLyoqXG4gKiBoYW5kbGUgbW91c2Vkb3duLG1vdXNlbW92ZSxtb3VzZXVwIGV2ZW50cyBmb3IgdGhlIGdpdmVuIGVsZW1lbnQgaW5jbHVkaW5nXG4gKiBjb252ZXJ0aW5nIHRvIGxvY2FsIGNvb3JkaW5hdGVzIGFuZCBjYXB0dXJpbmcgdGhlIG1vdXNlIG9uIHRoZSBkb2N1bWVudC5ib2R5XG4gKiBkdXJpbmcgYSBkcmFnLlxuICogQ2FsbGJhY2tzIHdoaWNoIHNob3VsZCBleGlzdCBhcmU6XG4gKiBtb3VzZVRyYXBEb3duKGNsaWVudCBwb2ludCwgZXZlbnQpXG4gKiBtb3VzZVRyYXBNb3ZlKGNsaWVudCBwb2ludCwgZXZlbnQpXG4gKiBtb3VzZVRyYXBVcChjbGllbnQgcG9pbnQsIGV2ZW50KVxuICogbW91c2VUcmFwRHJhZyhjbGllbnQgcG9pbnQsIGV2ZW50KSAtIHdoaWNoIGlzIGEgbW91c2Vtb3ZlIHdpdGggdGhlIGJ1dHRvbiBoZWxkIGRvd25cbiAqXG4gKiBBIGRyYWcgY2FuIGJlIGNhbmNlbGxlZCBhdCBhbnl0aW1lIGJ5IGNhbGxpbmcgY2FuY2VsRHJhZyBvbiB0aGlzIGluc3RhbmNlLlxuICogQ2FsbCBkaXNwb3NlIHRvIGVuZCBhbGwgbW91c2UgY2FwdHVyZXMuIERvIG5vdCB1c2UgdGhlIGluc3RhbmNlIGFmdGVyIHRoaXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlVHJhcCB7XG5cbiAgLyoqXG4gICAqIG93bmVyIGlzIGFueSBvYmplY3QgdGhhdCB3aWxsIGdldCB0aGUgY2FsbGJhY2tzLiBFbGVtZW50IGlzXG4gICAqIHRoZSB0YXJnZXQgZWxlbWVudCB5b3Ugd2FudCB0aGUgZXZlbnRzIG9uLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIC8vIHNhdmUgb3VyIG9wdGlvbnMsIHdoaWNoIGF0IHRoZSB2ZXJ5IGxlYXN0IG11c3QgY29udGFpbiB0aGUgdGFyZ2V0ZWQgZWxlbWVudC5cbiAgICAvLyBPcHRpb25zIGFyZTpcbiAgICAvL1xuICAgIC8vIGVsZW1lbnQ6IEhUTUxFbGVtZW50IC0gdGhlIGVsZW1lbnQgd2hpY2ggd2UgbGlzdGVuIHRvXG4gICAgLy8gbW91c2VFbnRlcjogRnVuY3Rpb24gLSBjYWxsYmFjayBmb3IgbW91c2VlbnRlciBldmVudCAoZXZlbnQpXG4gICAgLy8gbW91c2VMZWF2ZTogRnVuY3Rpb24gLSBjYWxsYmFjayBmb3IgbW91c2VsZWF2ZSBldmVudCAoZXZlbnQpXG4gICAgLy8gbW91c2VEb3duOiBGdW5jdGlvbiAtIGNhbGxiYWNrIGZvciBtb3VzZWRvd24gZXZlbnQgKHBvaW50LCBldmVudClcbiAgICAvLyBtb3VzZU1vdmU6IEZ1bmN0aW9uIC0gY2FsbGJhY2sgZm9yIG1vdXNlbW92ZSBldmVudCAocG9pbnQsIGV2ZW50KVxuICAgIC8vIG1vdXNlRHJhZzogRnVuY3Rpb24gLSBjYWxsYmFjayBmb3IgbW91c2Vtb3ZlIHdpdGggYnV0dG9uIGhlbGQgZG93biBldmVudCAocG9pbnQsIGV2ZW50KVxuICAgIC8vIG1vdXNlVXA6IEZ1bmN0aW9uIC0gY2FsbGJhY2sgZm9yIG1vdXNldXAgZXZlbnQgKHBvaW50LCBldmVudCkgb25seSB3aGVuIG1vdXNlZG93biBwcmVjZWVkZWQuXG4gICAgLy8gbW91c2VXaGVlbDogRnVuY3Rpb24gLSBjYWxsYmFjayBmb3Igbm9ybWFsaXplZCBtb3VzZSB3aGVlbCBldmVudHMuIChldmVudCwgbm9ybWFsaXplZCBkYXRhKVxuICAgIC8vIGRvdWJsZUNsaWNrOiBGdW5jdGlvbiAtIGNhbGxiYWNrIGZvciBkb3VibGUgY2xpY2sgd2l0aCBsZWZ0IGJ1dHRvblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgIGludmFyaWFudCh0aGlzLm9wdGlvbnMuZWxlbWVudCwgJ29wdGlvbnMgbXVzdCBjb250YWluIGFuIGVsZW1lbnQnKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG5cbiAgICAvLyBjcmVhdGUgYm91bmQgdmVyc2lvbnMgb2YgdGhlIGxpc3RlbmVyIHdoaWNoIHdlIGNhbiByZW1vdmUgYXMgd2VsbCBhcyBhZGRcbiAgICB0aGlzLm1vdXNlRW50ZXIgPSB0aGlzLm9uTW91c2VFbnRlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMubW91c2VMZWF2ZSA9IHRoaXMub25Nb3VzZUxlYXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tb3VzZU1vdmUgPSB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tb3VzZURyYWcgPSB0aGlzLm9uTW91c2VEcmFnLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tb3VzZVVwID0gdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLm1vdXNlV2hlZWwgPSB0aGlzLm9uTW91c2VXaGVlbC5iaW5kKHRoaXMpO1xuXG4gICAgLy8gbW91c2UgZW50ZXIvbGVhdmUgYXJlIGFsd2F5cyBydW5uaW5nXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLm1vdXNlRW50ZXIpO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5tb3VzZUxlYXZlKTtcbiAgICAvLyBzaW5rIHRoZSBtb3VzZWRvd24sIGxhdGVyIGR5bmFtaWNhbGx5IGFkZCB0aGUgbW92ZS91cCBoYW5kbGVyc1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bik7XG4gICAgLy8gZm9yIG5vcm1hbCBtb3VzZSBtb3ZlIHdpdGggbm8gYnV0dG9uIHdlIHRyYWNrIHZpYSB0aGUgdGFyZ2V0IGVsZW1lbnQgaXRzZWxmXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlKTtcbiAgICAvLyBtb3VzZSB3aGVlbCBldmVudHNcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLm1vdXNlV2hlZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIG1vdXNlIGVudGVyL2xlYXZlIGhhbmRsZXJzXG4gICAqL1xuICBvbk1vdXNlRW50ZXIoZXZlbnQpIHtcbiAgICB0aGlzLmNhbGxiYWNrKCdtb3VzZUVudGVyJywgZXZlbnQpO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlKGV2ZW50KSB7XG4gICAgdGhpcy5jYWxsYmFjaygnbW91c2VMZWF2ZScsIGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtb3VzZSBkb3duIGhhbmRsZXIsIGludm9rZWQgb24gb3VyIHRhcmdldCBlbGVtZW50XG4gICAqL1xuICBvbk1vdXNlRG93bihldmVudCkge1xuICAgIC8vIHdoZW5ldmVyIG91ciBlbGVtZW50IGdldHMgYSBtb3VzZSBkb3duICggYW55IGJ1dHRvbiApIGVuc3VyZSBhbnkgaW5wdXRzIGFyZSB1bmZvY3VzZWRcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lXG4gICAgICAmJiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lID09PSAnSU5QVVQnIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyApKSB7XG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICAgIC8vIGxlZnQgYnV0dG9uIG9ubHlcbiAgICBpZiAoZXZlbnQud2hpY2ggIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KCF0aGlzLmRyYWdnaW5nLCAnbW91c2V0cmFwIGlzIGFscmVhZHkgaW4gZHJhZyBtb2RlJyk7XG5cbiAgICAvLyBnZXQgbG9jYWwgcG9zaXRpb24gYW5kIHJlY29yZCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gYW5kIHNldHVwIG1vdmUvdXAgaGFuZGxlcnMgb24gdGhlIG1vdXNlTGF5ZXJcbiAgICBjb25zdCBsb2NhbFBvc2l0aW9uID0gdGhpcy5ldmVudFRvTG9jYWwoZXZlbnQpO1xuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgLy8gY2hlY2sgZm9yIGEgZG91YmxlIGNsaWNrIGJlZm9yZSBzdGFydGluZyBhIGRyYWdcbiAgICBpZiAodGhpcy5sYXN0TGVmdENsaWNrICYmIHRoaXMubGFzdExlZnRDbGljay5zdWIobG9jYWxQb3NpdGlvbikubGVuKCkgPD0gZG91YmxlQ2xpY2tTcGF0aWFsVGhyZXNob2xkXG4gICAgICAmJiB0aW1lIC0gdGhpcy5sYXN0TGVmdENsaWNrVGltZSA8PSBkb3VibGVDbGlja1RpbWVUaHJlc2hvbGQpIHtcbiAgICAgIHRoaXMubGFzdExlZnRDbGljayA9IG51bGw7XG4gICAgICB0aGlzLmNhbGxiYWNrKCdkb3VibGVDbGljaycsIGV2ZW50LCBsb2NhbFBvc2l0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gcmVtZW1iZXIgdGhpcyBjbGljaywgaXQgbWF5IGJlIHRoZSBmaXJzdCBjbGljayBvZiBhIGRvdWJsZSBjbGlja1xuICAgIHRoaXMubGFzdExlZnRDbGljayA9IGxvY2FsUG9zaXRpb247XG4gICAgdGhpcy5sYXN0TGVmdENsaWNrVGltZSA9IHRpbWU7XG5cbiAgICB0aGlzLm1vdXNlTGF5ZXIgPSBEKCc8ZGl2IGNsYXNzPVwic3YtbW91c2VMYXllclwiPjwvZGl2PicpO1xuICAgIHRoaXMubW91c2VMYXllci5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgIC8vIHN0YXJ0IGEgZHJhZ1xuICAgIHRoaXMuZHJhZ2dpbmcgPSB7XG4gICAgICBtb3VzZUxheWVyOiB0aGlzLm1vdXNlTGF5ZXIuZWwsXG4gICAgICBzdGFydFBvc2l0aW9uOiBsb2NhbFBvc2l0aW9uLFxuICAgIH07XG4gICAgdGhpcy5tb3VzZUxheWVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VEcmFnKTtcbiAgICB0aGlzLm1vdXNlTGF5ZXIuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcCk7XG5cbiAgICAvLyBpbnZva2Ugb3B0aW9uYWwgY2FsbGJhY2tcbiAgICB0aGlzLmNhbGxiYWNrKCdtb3VzZURvd24nLCBldmVudCwgbG9jYWxQb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogbW91c2Vtb3ZlIGV2ZW50XG4gICAqL1xuICBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIGNvbnN0IGxvY2FsUG9zaXRpb24gPSB0aGlzLmV2ZW50VG9Mb2NhbChldmVudCk7XG4gICAgdGhpcy5jYWxsYmFjaygnbW91c2VNb3ZlJywgZXZlbnQsIGxvY2FsUG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIG1vdXNlbW92ZSBldmVudCBiaW5kaW5nIGR1cmluZyBhIGRyYWcgb3BlcmF0aW9uXG4gICAqL1xuICBvbk1vdXNlRHJhZyhldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMubW91c2VMYXllci5lbCkge1xuICAgICAgaW52YXJpYW50KHRoaXMuZHJhZ2dpbmcsICdvbmx5IGV4cGVjdCBtb3VzZSBtb3ZlcyBkdXJpbmcgYSBkcmFnJyk7XG4gICAgICAvLyBzZW5kIHRoZSBtb3VzZSBtb3ZlLCB0aGVuIGNoZWNrIGZvciB0aGUgYmVnaW4gb2YgYSBkcmFnXG4gICAgICBjb25zdCBsb2NhbFBvc2l0aW9uID0gdGhpcy5ldmVudFRvTG9jYWwoZXZlbnQpO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBsb2NhbFBvc2l0aW9uLnN1Yih0aGlzLmRyYWdnaW5nLnN0YXJ0UG9zaXRpb24pLmxlbigpO1xuICAgICAgLy8gaW52b2tlIG9wdGlvbmFsIGNhbGxiYWNrXG4gICAgICB0aGlzLmNhbGxiYWNrKCdtb3VzZURyYWcnLCBldmVudCwgbG9jYWxQb3NpdGlvbiwgdGhpcy5kcmFnZ2luZy5zdGFydFBvc2l0aW9uLCBkaXN0YW5jZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIG1vdXNldXAgaGFuZGxlclxuICAgKi9cbiAgb25Nb3VzZVVwKGV2ZW50KSB7XG4gICAgLy8gbGVmdCBkcmFnIG9ubHlcbiAgICBpZiAoZXZlbnQud2hpY2ggIT09IDEgfHwgZXZlbnQudGFyZ2V0ICE9PSB0aGlzLm1vdXNlTGF5ZXIuZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW52YXJpYW50KHRoaXMuZHJhZ2dpbmcsICdvbmx5IGV4cGVjdCBtb3VzZSB1cCBkdXJpbmcgYSBkcmFnJyk7XG4gICAgY29uc3QgbG9jYWxQb3NpdGlvbiA9IHRoaXMuZXZlbnRUb0xvY2FsKGV2ZW50KTtcbiAgICB0aGlzLmNhbmNlbERyYWcoKTtcbiAgICB0aGlzLmNhbGxiYWNrKCdtb3VzZVVwJywgZXZlbnQsIGxvY2FsUG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbmNlbCBhIGRyYWcgdHJhY2sgaW4gcHJvZ3Jlc3NcbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjYW5jZWxEcmFnKCkge1xuICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICBjb25zdCBlID0gdGhpcy5tb3VzZUxheWVyLmVsO1xuICAgICAgZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlRHJhZyk7XG4gICAgICBlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXApO1xuICAgICAgZS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgdGhpcy5tb3VzZUxheWVyID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBtb3VzZSB3aGVlbCBoYW5kbGVyXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgb25Nb3VzZVdoZWVsKGV2ZW50KSB7XG4gICAgY29uc3QgbG9jYWxQb3NpdGlvbiA9IHRoaXMuZXZlbnRUb0xvY2FsKGV2ZW50KTtcbiAgICB0aGlzLmNhbGxiYWNrKCdtb3VzZVdoZWVsJywgZXZlbnQsIGxvY2FsUG9zaXRpb24sIHRoaXMubm9ybWFsaXplV2hlZWwoZXZlbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhIG5pY2UgdHJ5IGF0IG5vcm1hbGl6aW5nIHdoZWVsIGV2ZW50cy4gUHJvdmlkZWQgYnkgb3VyIGZyaWVuZHMgYXQgRmFjZWJvb2s6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9maXhlZC1kYXRhLXRhYmxlL2Jsb2IvbWFzdGVyL3NyYy92ZW5kb3JfdXBzdHJlYW0vZG9tL25vcm1hbGl6ZVdoZWVsLmpzXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcmV0dXJucyB7e3NwaW5YOiBudW1iZXIsIHNwaW5ZOiBudW1iZXIsIHBpeGVsWDogbnVtYmVyLCBwaXhlbFk6IG51bWJlcn19XG4gICAqL1xuICBub3JtYWxpemVXaGVlbChldmVudCkge1xuICAgIHZhciBzWCA9IDAsIHNZID0gMCwgICAgICAgLy8gc3BpblgsIHNwaW5ZXG4gICAgICBwWCA9IDAsIHBZID0gMDsgICAgICAgLy8gcGl4ZWxYLCBwaXhlbFlcblxuICAgIC8vIExlZ2FjeVxuICAgIGlmICgnZGV0YWlsJyAgICAgIGluIGV2ZW50KSB7IHNZID0gZXZlbnQuZGV0YWlsOyB9XG4gICAgaWYgKCd3aGVlbERlbHRhJyAgaW4gZXZlbnQpIHsgc1kgPSAtZXZlbnQud2hlZWxEZWx0YSAvIDEyMDsgfVxuICAgIGlmICgnd2hlZWxEZWx0YVknIGluIGV2ZW50KSB7IHNZID0gLWV2ZW50LndoZWVsRGVsdGFZIC8gMTIwOyB9XG4gICAgaWYgKCd3aGVlbERlbHRhWCcgaW4gZXZlbnQpIHsgc1ggPSAtZXZlbnQud2hlZWxEZWx0YVggLyAxMjA7IH1cblxuICAgIC8vIHNpZGUgc2Nyb2xsaW5nIG9uIEZGIHdpdGggRE9NTW91c2VTY3JvbGxcbiAgICBpZiAoICdheGlzJyBpbiBldmVudCAmJiBldmVudC5heGlzID09PSBldmVudC5IT1JJWk9OVEFMX0FYSVMgKSB7XG4gICAgICBzWCA9IHNZO1xuICAgICAgc1kgPSAwO1xuICAgIH1cblxuICAgIHBYID0gc1ggKiBQSVhFTF9TVEVQO1xuICAgIHBZID0gc1kgKiBQSVhFTF9TVEVQO1xuXG4gICAgaWYgKCdkZWx0YVknIGluIGV2ZW50KSB7IHBZID0gZXZlbnQuZGVsdGFZOyB9XG4gICAgaWYgKCdkZWx0YVgnIGluIGV2ZW50KSB7IHBYID0gZXZlbnQuZGVsdGFYOyB9XG5cbiAgICBpZiAoKHBYIHx8IHBZKSAmJiBldmVudC5kZWx0YU1vZGUpIHtcbiAgICAgIGlmIChldmVudC5kZWx0YU1vZGUgPT0gMSkgeyAgICAgICAgICAvLyBkZWx0YSBpbiBMSU5FIHVuaXRzXG4gICAgICAgIHBYICo9IExJTkVfSEVJR0hUO1xuICAgICAgICBwWSAqPSBMSU5FX0hFSUdIVDtcbiAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWx0YSBpbiBQQUdFIHVuaXRzXG4gICAgICAgIHBYICo9IFBBR0VfSEVJR0hUO1xuICAgICAgICBwWSAqPSBQQUdFX0hFSUdIVDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGYWxsLWJhY2sgaWYgc3BpbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZFxuICAgIGlmIChwWCAmJiAhc1gpIHsgc1ggPSAocFggPCAxKSA/IC0xIDogMTsgfVxuICAgIGlmIChwWSAmJiAhc1kpIHsgc1kgPSAocFkgPCAxKSA/IC0xIDogMTsgfVxuXG4gICAgcmV0dXJuIHsgc3BpblggIDogc1gsXG4gICAgICBzcGluWSAgOiBzWSxcbiAgICAgIHBpeGVsWCA6IHBYLFxuICAgICAgcGl4ZWxZIDogcFkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpZiBnaXZlbiwgaW52b2tlIG9uZSBvZiB0aGUgbmFtZWQgb3B0aW9uYWwgY2FsbGJhY2tzIHdpdGggYSBjbG9uZSBvZiB0aGUgbG9jYWwgcG9pbnRcbiAgICovXG4gIGNhbGxiYWNrKGV2ZW50TmFtZSwgZXZlbnQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zW2V2ZW50TmFtZV0pIHtcbiAgICAgIC8vIGlmIHRoZSBjbGllbnQgd2FudHMgYSBjYWxsYmFjayBwcmV2ZW50RGVmYXVsdFxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIHNsaWNlIHRoZSBldmVudCBuYW1lIG9mZiB0aGUgYXJndW1lbnRzIGJ1dCBmb3J3YXJkIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICB0aGlzLm9wdGlvbnNbZXZlbnROYW1lXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY2xlYW51cCBhbGwgZXZlbnQgbGlzdGVuZXJzLiBJbnN0YW5jZSBjYW5ub3QgYmUgdXNlZCBhZnRlciB0aGlzLlxuICAgKi9cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMubW91c2VFbnRlcik7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm1vdXNlTGVhdmUpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bik7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLm1vdXNlV2hlZWwpO1xuICAgIHRoaXMuY2FuY2VsRHJhZygpO1xuICAgIHRoaXMuZHJhZ2dpbmcgPSB0aGlzLmVsZW1lbnQgPSB0aGlzLm93bmVyID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgdGFyZ2V0IG9mIHRoZSBldmVudCBpcyBleHBlY3RlZCB0byBiZSBvdXIgZWxlbWVudCBvciBvbmUgb2YgaXRzIGNoaWxkcmVuXG4gICAqIEBwYXJhbSBub2RlXG4gICAqIEBwYXJhbSBwb2ludFxuICAgKi9cbiAgZXZlbnRUb0RvY3VtZW50KGV2ZW50KSB7XG4gICAgLy8gb25seSB3b3JrZHMgb24gbmV3ZXIgYnJvd3NlcnMgd2l0aCBwYWdlWC9wYWdlWVxuICAgIGludmFyaWFudChldmVudC5wYWdlWCAhPT0gdW5kZWZpbmVkLCAnZXZlbnQgbXVzdCBzdXBwb3J0IHBhZ2VYL1knKTtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKFxuICAgICAgZXZlbnQucGFnZVggKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgIGV2ZW50LnBhZ2VZKyB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIGV2ZW50IHJlbGF0aXZlIHRvIG91ciBlbGVtZW50XG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgZXZlbnRUb0xvY2FsKGV2ZW50KSB7XG4gICAgY29uc3QgYiA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwID0gdGhpcy5ldmVudFRvRG9jdW1lbnQoZXZlbnQpO1xuICAgIHJldHVybiBuZXcgVmVjdG9yMkQocC54IC0gYi5sZWZ0LCBwLnkgLSBiLnRvcCk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy9pbnB1dC9tb3VzZXRyYXAuanNcbiAqKi8iLCJpbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgeyBpc1JlYWxOdW1iZXIsIGRlZzJyYWQsIHJhZDJkZWcgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBMaW5lMkQgZnJvbSAnLi9saW5lMmQnO1xuLyoqXG4gKiBhIDJEIFZlY3Rvci9Qb2ludFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3IyRCB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICovXG4gIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCkge1xuICAgIGludmFyaWFudChpc1JlYWxOdW1iZXIoeCkgJiYgaXNSZWFsTnVtYmVyKHkpLCAnQmFkIHBhcmFtZXRlcnMnKTtcbiAgICB0aGlzLl92ID0gW3gsIHldO1xuICB9XG5cbiAgZ2V0IHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZbMF07XG4gIH1cblxuICBzZXQgeChuZXdWYWx1ZSkge1xuICAgIGludmFyaWFudChpc1JlYWxOdW1iZXIobmV3VmFsdWUpLCAnQmFkIHBhcmFtZXRlcicpO1xuICAgIHRoaXMuX3ZbMF0gPSBuZXdWYWx1ZTtcbiAgfVxuXG4gIGdldCB5KCkge1xuICAgIHJldHVybiB0aGlzLl92WzFdO1xuICB9XG5cbiAgc2V0IHkobmV3VmFsdWUpIHtcbiAgICBpbnZhcmlhbnQoaXNSZWFsTnVtYmVyKG5ld1ZhbHVlKSwgJ0JhZCBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuX3ZbMV0gPSBuZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb21tYSBzZXBhcmF0ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICB0b09iamVjdCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy54fSwke3RoaXMueX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldmVyc2Ugb2YgdG9PYmplY3QsIGJ1dCBhIHN0YXRpYyBtZW1iZXIgdGhhdCBjb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlXG4gICAqL1xuICBzdGF0aWMgZnJvbU9iamVjdChzdHIpIHtcbiAgICBpbnZhcmlhbnQoc3RyLCAnQmFkIHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IGFyeSA9IHN0ci5zcGxpdCgnLCcpO1xuICAgIGludmFyaWFudChhcnkubGVuZ3RoID09PSAyLCAnQmFkIHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IHZlY3RvciA9IG5ldyBWZWN0b3IyRCgpO1xuICAgIHZlY3Rvci54ID0gcGFyc2VGbG9hdChhcnlbMF0pO1xuICAgIHZlY3Rvci55ID0gcGFyc2VGbG9hdChhcnlbMV0pO1xuICAgIGludmFyaWFudChpc1JlYWxOdW1iZXIodmVjdG9yLngpLCAnQmFkIHBhcmFtZXRlcicpO1xuICAgIGludmFyaWFudChpc1JlYWxOdW1iZXIodmVjdG9yLnkpLCAnQmFkIHBhcmFtZXRlcicpO1xuICAgIHJldHVybiB2ZWN0b3I7XG4gIH1cblxuICAvKipcbiAgICogc3RyaW5nIG91dFxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGB2MmQoJHt0aGlzLnh9LCAke3RoaXMueX0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gYSBjb3B5IG9mIG91cnNlbHZlc1xuICAgKiBAcmV0dXJucyB7VmVjdG9yMkR9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHRoaXMueCwgdGhpcy55KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gYSBuZXcgdmVjdG9yIHJvdW5kZWQgdG8gdGhlIG5lYXJlc3QgayBpbnRlZ2VyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBncmlkIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7VmVjdG9yMkR9ICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc25hcChncmlkKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyRChNYXRoLmZsb29yKHRoaXMueCAvIGdyaWQpICogZ3JpZCwgTWF0aC5mbG9vcih0aGlzLnkgLyBncmlkKSAqIGdyaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50IG9uIGNpcmN1bWZlcmVuY2Ugb2YgY2lyY2xlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4Y1xuICAgKiBAcGFyYW0ge051bWJlcn0geWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlc1xuICAgKi9cbiAgc3RhdGljIHBvaW50T25DaXJjdW1mZXJlbmNlKHhjLCB5YywgcmFkaXVzLCBkZWdyZWVzKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyRChcbiAgICAgIHhjICsgcmFkaXVzICogTWF0aC5jb3MoZGVnMnJhZChkZWdyZWVzKSksXG4gICAgICB5YyArIHJhZGl1cyAqIE1hdGguc2luKGRlZzJyYWQoZGVncmVlcykpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhbmdsZSBpbiBkZWdyZWVzIGJldHdlZW4gdHdvIHZlY3RvcnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG90aGVyXG4gICAqL1xuICBhbmdsZUJldHdlZW4ob3RoZXIpIHtcbiAgICBsZXQgcmFkcyA9IE1hdGguYXRhbjIob3RoZXIueSAtIHRoaXMueSwgb3RoZXIueCAtIHRoaXMueCk7XG5cbiAgICAvLyBhdGFuMiByZXR1cm4gbmVnYXRpdmUgUEkgcmFkaWFucyBmb3IgdGhlIDE4MC0zNjAgZGVncmVlcyAoIDkgbydjbG9jayB0byAzIG8nY2xvY2sgKVxuICAgIGlmIChyYWRzIDwgMCkge1xuICAgICAgcmFkcyA9IDIgKiBNYXRoLlBJICsgcmFkcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmFkMmRlZyhyYWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQgYW5vdGhlciB2ZWN0b3JcbiAgICogQHBhcmFtIHtWZWN0b3IyRH0gdmVjdG9yXG4gICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICovXG4gIGFkZCh2ZWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHRoaXMueCArIHZlY3Rvci54LCB0aGlzLnkgKyB2ZWN0b3IueSk7XG4gIH1cblxuICAvKipcbiAgICogc3VidHJhY3QgYW5vdGhlciB2ZWN0b3JcbiAgICogQHBhcmFtIHtWZWN0b3IyRH0gdmVjdG9yXG4gICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICovXG4gIHN1Yih2ZWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHRoaXMueCAtIHZlY3Rvci54LCB0aGlzLnkgLSB2ZWN0b3IueSk7XG4gIH1cblxuICAvKipcbiAgICogbXVsdGlwbHkgdmVjdG9yIGJ5IGNvZWZmZWNpZW50IG9yIGFub3RoZXIgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfFZlY3RvcjJEfSBtdWx0aXBsaWVyXG4gICAqIEByZXR1cm5zIHtWZWN0b3IyRCB8IE51bWJlcn1cbiAgICovXG4gIG11bHRpcGx5KG11bHRpcGxpZXIpIHtcbiAgICByZXR1cm4gaXNSZWFsTnVtYmVyKG11bHRpcGxpZXIpID9cbiAgICAgIG5ldyBWZWN0b3IyRCh0aGlzLnggKiBtdWx0aXBsaWVyLCB0aGlzLnkgKiBtdWx0aXBsaWVyKSA6XG4gICAgICBuZXcgVmVjdG9yMkQodGhpcy54ICogbXVsdGlwbGllci54LCB0aGlzLnkgKiBtdWx0aXBsaWVyLnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNjYWxlIGlzIGFuIGFsaWFzIGZvciBtdWx0aXBseVxuICAgKi9cbiAgc2NhbGUobXVsdGlwbGllcikge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KG11bHRpcGxpZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIGRpdmlkZSB2ZWN0b3IgYnkgYSBjb25zdGFudFxuICAgKiBAcGFyYW0ge051bWJlcn0gZGl2aXNvclxuICAgKiBAcmV0dXJucyB7VmVjdG9yMkR9XG4gICAqL1xuICBkaXZpZGUoZGl2aXNvcikge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMkQodGhpcy54IC8gZGl2aXNvciwgdGhpcy55IC8gZGl2aXNvcik7XG4gIH1cblxuICAvKipcbiAgICogbGVuZ3RoIG9mIHZlY3RvclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgbGVuKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAgICogQHBhcmFtIHt2ZWN0b3J9IG90aGVyIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBkaXN0YW5jZShvdGhlcikge1xuICAgIHJldHVybiBuZXcgTGluZTJEKHRoaXMsIG90aGVyKS5sZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBkb3QgcHJvZHVjdFxuICAgKiBAcGFyYW0ge3ZlY3Rvcn0gb3RoZXJcbiAgICogQHJldHVybnMgVmVjdG9yMkRcbiAgICovXG4gIGRvdChvdGhlcikge1xuICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gaWYgd2l0aGluIGEgY2VydGFpbiB0aHJlc2hvbGQgb2YgcHJveGltaXR5XG4gICAqIEBwYXJhbSB7dmVjdG9yfSBvdGhlciAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGhyZXNob2xkIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNpbWlsYXIob3RoZXIsIHRocmVzaG9sZCA9IDFlLTYpIHtcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKHRoaXMueCAtIG90aGVyLngpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnModGhpcy55IC0gb3RoZXIueSk7XG4gICAgcmV0dXJuIChkeCA8IHRocmVzaG9sZCkgJiYgKGR5IDwgdGhyZXNob2xkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBlcXVhbGl0eSB0ZXN0XG4gICAqIEBwYXJhbSBvdGhlclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGVxdWFscyhvdGhlcikge1xuICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55O1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgc291cmNlIHdpZHRoL2hlaWdodCBvZiBhIGJveCwgcmV0dXJuIHRoZSBhc3BlY3QgcmF0aW8gY29ycmVjdCBzaXplIG9mIHRoZSBib3ggd2hlbiBzY2FsZWQgZG93biAoIG9yIG9wdGlvbmFsbHlcbiAgICogdXAgKSB0byBmaXQgd2l0aGluIHRoZSBnaXZlbiB3aW5kb3dcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNvdXJjZVdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzb3VyY2VIZWlnaHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heFdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhIZWlnaHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHVwc2NhbGVcbiAgICogQHJldHVybnMge1ZlY3RvcjJEfVxuICAgKi9cbiAgc3RhdGljIHNjYWxlVG9XaW5kb3coc291cmNlV2lkdGgsIHNvdXJjZUhlaWdodCwgbWF4V2lkdGgsIG1heEhlaWdodCwgdXBzY2FsZSkge1xuICAgIC8vIHdpbGwgaG9sZCB0aHVtYiBzaXplIG9uIGV4aXQgZnJvbSB0aGlzIHNlY3Rpb25cbiAgICBsZXQgdHg7XG4gICAgbGV0IHR5O1xuXG4gICAgLy8gaWYgaW1hZ2UgZml0cyBlbnRpcmVseSBpbiB3aW5kb3cgdGhlbiBqdXN0IGdvIHdpdGggaW1hZ2Ugc2l6ZSB1bmxlc3MgdXBzY2FsaW5nIHJlcXVpcmVkXG4gICAgaWYgKHNvdXJjZVdpZHRoIDw9IG1heFdpZHRoICYmIHNvdXJjZUhlaWdodCA8PSBtYXhIZWlnaHQgJiYgIXVwc2NhbGUpIHtcbiAgICAgIHR4ID0gc291cmNlV2lkdGg7XG4gICAgICB0eSA9IHNvdXJjZUhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gMS4gRmlndXJlIG91dCB3aGljaCBkaW1lbnNpb24gaXMgdGhlIHdvcnN0IGZpdCwgdGhpcyBpcyB0aGUgYXhpcy9zaWRlXG4gICAgICAvLyAgICB0aGF0IHdlIGhhdmUgdG8gYWNjb21tb2RhdGUuXG5cbiAgICAgIGlmICgobWF4V2lkdGggLyBzb3VyY2VXaWR0aCkgPCAobWF4SGVpZ2h0IC8gc291cmNlSGVpZ2h0KSkge1xuICAgICAgICAvLyB3aWR0aCBpcyB0aGUgd29yc3QgZml0XG4gICAgICAgIC8vIG1ha2Ugd2lkdGggPT0gd2luZG93IHdpZHRoXG4gICAgICAgIHR4ID0gbWF4V2lkdGg7XG5cbiAgICAgICAgLy8gbWFrZSBoZWlnaHQgaW4gY29ycmVjdCByYXRpbyB0byBvcmlnaW5hbFxuICAgICAgICB0eSA9IChzb3VyY2VIZWlnaHQgKiAobWF4V2lkdGggLyBzb3VyY2VXaWR0aCkpID4+IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBoZWlnaHQgaXMgdGhlIHdvcnN0IGZpdFxuICAgICAgICAvLyBtYWtlIGhlaWdodCA9PSB3aW5kb3cgaGVpZ2h0XG4gICAgICAgIHR5ID0gbWF4SGVpZ2h0O1xuXG4gICAgICAgIC8vIG1ha2UgaGVpZ2h0IGluIGNvcnJlY3QgcmF0aW8gdG8gb3JpZ2luYWxcbiAgICAgICAgdHggPSAoc291cmNlV2lkdGggKiAobWF4SGVpZ2h0IC8gc291cmNlSGVpZ2h0KSkgPj4gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHR4LCB0eSk7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdHMvZ2VvbWV0cnkvdmVjdG9yMmQuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuZXhwb3J0IGNvbnN0IGRlZzJyYWQgPSAoZGVnKSA9PiB7XG4gIHJldHVybiBkZWcgKiAoTWF0aC5QSSAvIDE4MCk7XG59O1xuXG5leHBvcnQgY29uc3QgcmFkMmRlZyA9IChyYWQpID0+IHtcbiAgcmV0dXJuIHJhZCAqICgxODAgLyBNYXRoLlBJKTtcbn07XG5cbi8qKlxuICogdHJ1ZSBpcyBhIG51bWJlciAoaW5jbHVkaW5nIE5hTiEpXG4gKi9cbmV4cG9ydCBjb25zdCBpc1JlYWxOdW1iZXIgPSAodmFsKSA9PiB7XG4gIHJldHVybiBfLmlzTnVtYmVyKHZhbCk7XG59O1xuXG4vKipcbiAqIHRydWUgaWYgfjFcbiAqIEBwYXJhbSAge251bWJlcn0gdmFsXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNPbmUgPSAodmFsKSA9PiB7XG4gIHJldHVybiBNYXRoLmFicygxIC0gdmFsKSA8PSAxZS02O1xufTtcblxuLyoqXG4gKiB0cnVlIGlmIH4wXG4gKiBAcGFyYW0gIHtudW1iZXJ9IHZhbFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzWmVybyA9ICh2YWwpID0+IHtcbiAgcmV0dXJuIE1hdGguYWJzKHZhbCkgPD0gMWUtNjtcbn07XG5cbi8qKlxuICogdHJ1ZSBpZiB0aGUgbnVtYmVyIHYgaXMgdmVyeSBjbG9zZSB0byBLXG4gKiBAcGFyYW0gIHtudW1iZXJ9IHYxXG4gKiBAcGFyYW0gIHtudW1iZXJ9IHYyXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgbmVhcmx5ID0gKHYxLCB2MikgPT4ge1xuICByZXR1cm4gTWF0aC5hYnModjEgLSB2MikgPCAxZS02O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL2dlb21ldHJ5L3V0aWxzLmpzXG4gKiovIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS44LjNcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZCxcbiAgICBuYXRpdmVDcmVhdGUgICAgICAgPSBPYmplY3QuY3JlYXRlO1xuXG4gIC8vIE5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjguMyc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBvcHRpbWl6ZUNiID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gb3B0aW1pemVDYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuICBfLml0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY2IodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICB2YXIgY3JlYXRlQXNzaWduZXIgPSBmdW5jdGlvbihrZXlzRnVuYywgdW5kZWZpbmVkT25seSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCF1bmRlZmluZWRPbmx5IHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhbm90aGVyLlxuICB2YXIgYmFzZUNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgIGlmICghXy5pc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgcHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gcHJvcGVydHkoJ2xlbmd0aCcpO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVzYCBhbmQgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBnZXRMZW5ndGgoaW5wdXQpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bnppcChhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENvbXBsZW1lbnQgb2YgXy56aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzXG4gIF8udW56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBfLm1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgaW5kZXhPZiBhbmQgbGFzdEluZGV4T2YgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBfLmlzTmFOKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgXy5jcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIF8uZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gJy4vdmVjdG9yMmQnO1xuaW1wb3J0IEludGVyc2VjdGlvbjJEIGZyb20gJy4vaW50ZXJzZWN0aW9uMmQnO1xuXG4vL3NoYWxsb3cgaGFzT3duUHJvcGVydHkgY2hlY2tcbmNvbnN0IGhhc1Byb3AgPSAob2JqLCBwcm9wKSA9PiB7XG4gIHJldHVybiBvYmouaGFzT3duUHJvcGVydHkocHJvcCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lMkQge1xuXG4gIC8qKlxuICAgKiBhIGxpbmUgY29tcG9zZWQgb2YgYSBzdGFydCBhbmQgZW5kIHBvaW50XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1ZlY3RvcjJEfSBzdGFydFxuICAgKiBAcGFyYW0ge1ZlY3RvcjJEfSBlbmRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICB0aGlzLl9zdGFydCA9IG5ldyBWZWN0b3IyRCgpO1xuICAgICAgdGhpcy5fZW5kID0gbmV3IFZlY3RvcjJEKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTpcbiAgICAgIGludmFyaWFudChoYXNQcm9wKHN0YXJ0LCAneDEnKSAmJiBoYXNQcm9wKHN0YXJ0LCAneTEnKSAmJiBoYXNQcm9wKHN0YXJ0LCAneDInKSAmJiBoYXNQcm9wKHN0YXJ0LCAneTInKSwgJ0JhZCBwYXJhbWV0ZXInKTtcbiAgICAgIHRoaXMuX3N0YXJ0ID0gbmV3IFZlY3RvcjJEKHN0YXJ0LngxLCBzdGFydC55MSk7XG4gICAgICB0aGlzLl9lbmQgPSBuZXcgVmVjdG9yMkQoc3RhcnQueDIsIHN0YXJ0LnkyKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAyOlxuICAgICAgdGhpcy5fc3RhcnQgPSBzdGFydC5jbG9uZSgpO1xuICAgICAgdGhpcy5fZW5kID0gZW5kLmNsb25lKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgNDpcbiAgICAgIHRoaXMuX3N0YXJ0ID0gbmV3IFZlY3RvcjJEKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuX2VuZCA9IG5ldyBWZWN0b3IyRChhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbWV0ZXJzJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGdldHRlciBmb3Igc3RhcnQgb2YgbGluZVxuICAgKiBAcmV0dXJuIHtWZWN0b3IyRH0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydC5jbG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldHRlciBmb3Igc3RhcnRcbiAgICogQHBhcmFtICB7VmVjdG9yMkR9IHZlY3RvclxuICAgKi9cbiAgc2V0IHN0YXJ0KHZlY3Rvcikge1xuICAgIHRoaXMuX3N0YXJ0ID0gdmVjdG9yLmNsb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0dGVyIGZvciBlbmQgb2YgbGluZVxuICAgKiBAcmV0dXJuIHtWZWN0b3IyRH0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0IGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5kLmNsb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogc2V0dGVyIGZvciBlbmRcbiAgICogQHBhcmFtICB7VmVjdG9yMkR9IHZlY3RvclxuICAgKi9cbiAgc2V0IHN0YXJ0KHZlY3Rvcikge1xuICAgIHRoaXMuX2VuZCA9IHZlY3Rvci5jbG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldHRlciBmb3IgeCBzdGFydFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgeDEoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQueDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXR0ZXIgZm9yIHkgc3RhcnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IHkxKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0Lnk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0dGVyIGZvciB4IGVuZFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgeDIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kLng7XG4gIH1cblxuICAvKipcbiAgICogZ2V0dGVyIGZvciB5IGVuZFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgeTIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kLnk7XG4gIH1cblxuICAvKipcbiAgICogY2xvbmUgdGhlIGxpbmVcbiAgICogQHJldHVybiB7TGluZTJEfVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBMaW5lMkQodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEpTT05hYmxlIHZlcnNpb24gb2Ygb2JqZWN0XG4gICAqIEByZXR1cm4gb2JqZWN0XG4gICAqL1xuICB0b09iamVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHRoaXMuc3RhcnQudG9PYmplY3QoKSxcbiAgICAgIGVuZCAgOiB0aGlzLmVuZC50b09iamVjdCgpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogc3RhdGljIGNvbnN0cnVjdG9yLCBwcm9kdWNlcyBhIExpbmUgZnJvbSB0aGUgcHJvZHVjdCBvZiB0b09iamVjdFxuICAgKiBAcGFyYW0gIHtvYmplY3R9IG9ialxuICAgKiBAcmV0dXJuIExpbmUyRFxuICAgKi9cbiAgc3RhdGljIGZyb21PYmplY3Qob2JqKSB7XG4gICAgaW52YXJpYW50KG9iaiAmJiBvYmouc3RhcnQgJiYgb2JqLmVuZCwgJ0JhZCBwYXJhbWV0ZXInKTtcbiAgICByZXR1cm4gbmV3IExpbmUyRChWZWN0b3IyRC5mcm9tT2JqZWN0KG9iai5zdGFydCksIFZlY3RvcjJELmZyb21PYmplY3Qob2JqLmVuZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiBsZW5ndGggb2YgbGluZVxuICAgKiByZXR1cm4gbnVtYmVyXG4gICAqL1xuICBsZW4oKSB7XG4gICAgY29uc3QgeGwgPSB0aGlzLngyIC0gdGhpcy54MTtcbiAgICBjb25zdCB5bCA9IHRoaXMueTIgLSB0aGlzLnkxO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeGwgKiB4bCArIHlsICogeWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgc2xvcGUgb2YgdGhlIGxpbmUuIFJldHVybnMgaW5maW5pdHkgaWYgdGhlIGxpbmUgaXMgdmVydGljYWxcbiAgICogQHJldHVybiB7bnVtYmVyfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzbG9wZSgpIHtcbiAgICBjb25zdCB4ZCA9ICh0aGlzLnN0YXJ0LnggLSB0aGlzLmVuZC54KTtcbiAgICBpZiAoeGQgPT09IDApIHtcbiAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnN0YXJ0LnkgLSB0aGlzLmVuZC55KSAvIHhkO1xuICB9XG5cbiAgLyoqXG4gICAqIGRpc3RhbmNlIG9mIHBvaW50IHRvIGxpbmUgc2VnbWVudCBmb3JtZWQgYnkgdGhpcy5zdGFydCwgdGhpcy5lbmQgc3F1YXJlZC5cbiAgICogQHBhcmFtIHtWZWN0b3IyRH0gcG9pbnRcbiAgICogQHJldHVybiB7bnVtYmVyfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBkaXN0YW5jZVRvU2VnbWVudChwb2ludCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU2VnbWVudFNxdWFyZWQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIHNxdWFyZWQgZGlzdGFuY2Ugb2YgdGhlIHBvaW50IHRvIHRoaXMgbGluZVxuICAgKiBAcGFyYW0gIHtWZWN0b3IyRH0gcG9pbnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZGlzdGFuY2VUb1NlZ21lbnRTcXVhcmVkKHBvaW50KSB7XG4gICAgZnVuY3Rpb24gc3FyKHhwKSB7XG4gICAgICByZXR1cm4geHAgKiB4cDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXN0MihwMSwgcDIpIHtcbiAgICAgIHJldHVybiBzcXIocDEueCAtIHAyLngpICsgc3FyKHAxLnkgLSBwMi55KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydHYgPSB0aGlzLnN0YXJ0O1xuICAgIGNvbnN0IGVuZHYgPSB0aGlzLmVuZDtcbiAgICBjb25zdCBsMiA9IGRpc3QyKHN0YXJ0diwgZW5kdik7XG4gICAgaWYgKGwyID09PSAwKSB7XG4gICAgICByZXR1cm4gZGlzdDIocG9pbnQsIHN0YXJ0dik7XG4gICAgfVxuICAgIGNvbnN0IGRzdCA9ICgocG9pbnQueCAtIHN0YXJ0di54KSAqIChlbmR2LnggLSBzdGFydHYueCkgKyAocG9pbnQueSAtIHN0YXJ0di55KSAqIChlbmR2LnkgLSBzdGFydHYueSkpIC8gbDI7XG4gICAgaWYgKGRzdCA8IDApIHtcbiAgICAgIHJldHVybiBkaXN0Mihwb2ludCwgc3RhcnR2KTtcbiAgICB9XG4gICAgaWYgKGRzdCA+IDEpIHtcbiAgICAgIHJldHVybiBkaXN0Mihwb2ludCwgZW5kdik7XG4gICAgfVxuICAgIHJldHVybiBkaXN0Mihwb2ludCwge1xuICAgICAgeDogc3RhcnR2LnggKyBkc3QgKiAoZW5kdi54IC0gc3RhcnR2LngpLFxuICAgICAgeTogc3RhcnR2LnkgKyBkc3QgKiAoZW5kdi55IC0gc3RhcnR2LnkpLFxuICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogcGFyYW1ldHJpYyBwb2ludCBvbiBsaW5lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludFxuICAgKi9cbiAgcG9pbnRPbkxpbmUocG9pbnQpIHtcbiAgICBjb25zdCB4ID0gdGhpcy54MSArICh0aGlzLngyIC0gdGhpcy54MSkgKiBwb2ludDtcbiAgICBjb25zdCB5ID0gdGhpcy55MSArICh0aGlzLnkyIC0gdGhpcy55MSkgKiBwb2ludDtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHgsIHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGludGVyc2VjdGlvbiBvZiB0aGlzIGxpbmUgd2l0aCBhbm90aGVyIGxpbmUuIFRoaXMgaXMgcmVhbGx5IGxpbmUgc2VnbWVudCBpbnRlcnNlY3Rpb24gc2luY2VcbiAgICogaXQgY29uc2lkZXJzIHRoZSBsaW5lcyBmaW5pdGUgYXMgZGVmaW5lZCBieSB0aGVpciBlbmQgcG9pbnRzXG5cbiAgICogQHBhcmFtIHtMaW5lMkR9IG90aGVyIC0gb3RoZXIgbGluZSBzZWdtZW50IHRvIGludGVyc2VjdCB3aXRoXG4gICAqIEByZXR1cm5zIHtJbnRlcnNlY3Rpb24yRH1cbiAgICovXG4gIGludGVyc2VjdFdpdGhMaW5lKG90aGVyKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBjb25zdCB1YVQgPSAob3RoZXIueDIgLSBvdGhlci54MSkgKiAodGhpcy55MSAtIG90aGVyLnkxKSAtIChvdGhlci55MiAtIG90aGVyLnkxKSAqICh0aGlzLngxIC0gb3RoZXIueDEpO1xuICAgIGNvbnN0IHViVCA9ICh0aGlzLngyIC0gdGhpcy54MSkgKiAodGhpcy55MSAtIG90aGVyLnkxKSAtICh0aGlzLnkyIC0gdGhpcy55MSkgKiAodGhpcy54MSAtIG90aGVyLngxKTtcbiAgICBjb25zdCB1QiA9IChvdGhlci55MiAtIG90aGVyLnkxKSAqICh0aGlzLngyIC0gdGhpcy54MSkgLSAob3RoZXIueDIgLSBvdGhlci54MSkgKiAodGhpcy55MiAtIHRoaXMueTEpO1xuXG4gICAgaWYgKHVCICE9PSAwKSB7XG4gICAgICBjb25zdCB1YSA9IHVhVCAvIHVCO1xuICAgICAgY29uc3QgdWIgPSB1YlQgLyB1QjtcblxuICAgICAgaWYgKHVhID49IDAgJiYgdWEgPD0gMSAmJiB1YiA+PSAwICYmIHViIDw9IDEpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbjJEKG5ldyBWZWN0b3IyRChcbiAgICAgICAgICB0aGlzLngxICsgdWEgKiAodGhpcy54MiAtIHRoaXMueDEpLFxuICAgICAgICAgIHRoaXMueTEgKyB1YSAqICh0aGlzLnkyIC0gdGhpcy55MSlcbiAgICAgICAgKSk7XG5cbiAgICAgICAgcmVzdWx0LnN0YXR1cyA9ICdJbnRlcnNlY3Rpb24nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbjJEKCdObyBJbnRlcnNlY3Rpb24nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHVhVCA9PT0gMCB8fCB1YlQgPT09IDApIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbjJEKCdDb2luY2lkZW50Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uMkQoJ1BhcmFsbGVsJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogbXVsdGlwbGUgLyBzY2FsZSB0aGUgbGluZSBieSB0aGUgZ2l2ZW4gY29lZmZlY2llbnRcbiAgICogQHBhcmFtIChudW1uZXIpIHZcbiAgICovXG4gIG11bHRpcGx5KG11bHRpcGxpZXIpIHtcbiAgICByZXR1cm4gbmV3IExpbmUyRCh0aGlzLnN0YXJ0Lm11bHRpcGx5KG11bHRpcGxpZXIpLCB0aGlzLmVuZC5tdWx0aXBseShtdWx0aXBsaWVyKSk7XG4gIH1cblxuICAvKipcbiAgICogc3RyaW5naWZ5IHRoZSBsaW5lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgbGluZTJkOiAke3RoaXMuc3RhcnQudG9TdHJpbmcoKX0gOiAke3RoaXMuZW5kLnRvU3RyaW5nKCl9YDtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy9nZW9tZXRyeS9saW5lMmQuanNcbiAqKi8iLCJpbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVyc2VjdGlvbjJEIHtcbiAgLyoqXG4gICAqIHRoZSBnZW5lcmljIHJlc3VsdHMgb2YgdmFyaW91cyB0eXBlcyBvZiBpbnRlcnNlY3Rpb24gdGVzdC5cbiAgICogRm9yIHZhbGlkIGludGVyc2VjdGlvbnMgdGhlIHBvaW50cyBwcm9wZXJ0eSBpcyBhbiBhcnJheSBvZlxuICAgKiBWZWN0b3IyRCBvYmplY3RzLiBUaGVyZSBpcyBhbHNvIGEgcG9pbnQgcHJvcGVydHkgdGhhdCByZXR1cm5zXG4gICAqIHRoZSBmaXJzdCBwb2ludCBpbiB0aGUgcG9pbnRzIGFycmF5LiBUaGUgc3RhdHVzIHByb3BlcnR5IGlzIGEgc3RyaW5nIHRoYXQgaW5kaWNhdGVzIHdoeSB0aGUgaW50ZXJzZWN0aW9uIHRlc3RcbiAgICogZmFpbGVkIGlmIGFueVxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtHLlZlY3RvcjJEfFN0cmluZ3x1bmRlZmluZWR9IGFyZyAtIGNhbiBiZSBhIHZlY3RvciBvciBhIHN0YXR1cyBzdHJpbmcgb3Igbm90aGluZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoYXJnKSB7XG4gICAgaWYgKGFyZyAmJiBhcmcuY29uc3RydWN0b3IubmFtZSA9PT0gJ1ZlY3RvcjJEJykge1xuICAgICAgdGhpcy5wb2ludHMgPSBbYXJnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IGFyZztcbiAgICAgIH1cbiAgICAgIHRoaXMucG9pbnRzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgZmlyc3QgcG9pbnQgaW4gb3VyIGludGVyc2VjdGlvbiBzZXQgb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm8gaW50ZXJzZWN0aW9uc1xuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldCBwb2ludCgpIHtcbiAgICBpZiAodGhpcy5wb2ludHMgJiYgdGhpcy5wb2ludHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludHNbMF07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiBvdXIgc3RhdHVzIHN0cmluZ1xuICAgKiBAcmV0dXJuIFN0cmluZ1xuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldHRlciBmb3Igb3VyIHN0YXR1c1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICAgKi9cbiAgc2V0IHN0YXR1cyhzdHIpIHtcbiAgICBpbnZhcmlhbnQodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycsICdleHBlY3RlZCBhIHN0cmluZycpO1xuICAgIHRoaXMuX3N0YXR1cyA9IHN0cjtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQgYSBwb2ludCB0byBvdXIgaW50ZXJzZWN0aW9uIHNldFxuICAgKiBAcGFyYW0ge1ZlY3RvcjJEfSBwb2ludFxuICAgKi9cbiAgYWRkKHBvaW50KSB7XG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLnBvaW50cyB8fCBbXTtcbiAgICB0aGlzLnBvaW50cy5wdXNoKHBvaW50KTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy9nZW9tZXRyeS9pbnRlcnNlY3Rpb24yZC5qc1xuICoqLyIsImltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCBWZWN0b3IyRCBmcm9tICcuL3ZlY3RvcjJkJztcbmltcG9ydCBMaW5lMkQgZnJvbSAnLi9saW5lMmQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3gyRCB7XG4gIC8qKlxuICAgKiBmbGV4aWJsZSBheGlzIGFsaWduZWQgYm94IGNsYXNzLiBDYW4gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbG1vc3QgYW55XG4gICAqIHJlYXNvbmFibGUgdmFsdWVzIG9yIG9iamVjdCBpLmUuIDQgbnVtYmVycywgYW4gb2JqZWN0IHdpdGggYSBjb21iaW5hdGlvblxuICAgKiBvciB4LHksdyxoLGwsdCxyLGIsbGVmdCx0b3AscmlnaHQsYm90dG9tLHdpZHRoLGhlaWdodFxuICAgKiBAcGFyYW0gW3hdXG4gICAqIEBwYXJhbSBbeV1cbiAgICogQHBhcmFtIFt3XVxuICAgKiBAcGFyYW0gW2hdXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoeCwgeSwgdywgaCkge1xuICAgIC8vIHBhcnNlIGFyZ3VtZW50c1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0KSB7XG4gICAgICB0aGlzLnggPSB4O1xuICAgICAgdGhpcy55ID0geTtcbiAgICAgIHRoaXMudyA9IHc7XG4gICAgICB0aGlzLmggPSBoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAvLyBtYXAgdGhlIHByb3BlcnRpZXMgKCBrZXlzICksIGlmIHByZXNlbnQsIHRvIG91clxuICAgICAgICAvLyBuYW1lZCBwcm9wZXJ0eSAoIHRoZSB2YWx1ZXMgKVxuICAgICAgICB0aGlzLmV4dGVuZChhcmd1bWVudHNbMF0sIHtcbiAgICAgICAgICB4ICAgICA6ICd4JyxcbiAgICAgICAgICBsZWZ0ICA6ICd4JyxcbiAgICAgICAgICB5ICAgICA6ICd5JyxcbiAgICAgICAgICB0b3AgICA6ICd5JyxcbiAgICAgICAgICB3ICAgICA6ICd3JyxcbiAgICAgICAgICBoICAgICA6ICdoJyxcbiAgICAgICAgICB3aWR0aCA6ICd3JyxcbiAgICAgICAgICBoZWlnaHQ6ICdoJyxcbiAgICAgICAgICByaWdodCA6ICdyJyxcbiAgICAgICAgICBib3R0b206ICdiJyxcbiAgICAgICAgICByICAgICA6ICdyJyxcbiAgICAgICAgICBiICAgICA6ICdiJyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMudyA9IHRoaXMuaCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW1ldGVycycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGV4dGVuZCBvdXJzZWx2ZXMgd2l0aCBhbnkgb2YgdGhlIHByb3BlcnR5IG5hbWVzIGluIHByb3BzLFxuICAgKiByZW5hbWluZyB0aGVtIHRvIHRoZSBnaXZlbiB0YXJnZXQgcHJvcGVydHkgbmFtZVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGZyb20gIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwcm9wcyBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZXh0ZW5kKGZyb20sIHByb3BzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdGhpc1twcm9wc1trZXldXSA9IGZyb21ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc2ltcGxlIHRvU3RyaW5nIDQgQ1NWIHZhbHVlc1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnh9LCAke3RoaXMueX0sICR7dGhpcy53fSwgJHt0aGlzLmh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3QgYSBib3ggZnJvbSBhIHN0cmluZywgb3Bwb3NpdGUgb2YgdG9TdHJpbmdcbiAgICovXG4gIHN0YXRpYyBmcm9tU3RyaW5nKHN0cikge1xuICAgIGludmFyaWFudChzdHIsICdCYWQgcGFyYW1ldGVyJyk7XG4gICAgY29uc3QgdmFsdWVzID0gc3RyLnNwbGl0KCcsJyk7XG4gICAgaW52YXJpYW50KHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoID09PSA0LCAnVW5leHBlY3RlZCBmb3JtYXQnKTtcbiAgICByZXR1cm4gbmV3IEJveDJEKHBhcnNlRmxvYXQodmFsdWVzWzBdKSwgcGFyc2VGbG9hdCh2YWx1ZXNbMV0pLCBwYXJzZUZsb2F0KHZhbHVlc1syXSksIHBhcnNlRmxvYXQodmFsdWVzWzNdKSk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIGFuIEFBQkIgZGVmaW5lZCBieSB0aGUgbGltaXRzIG9mIHRoaXMgcG9pbnRcbiAgICogYW5kIGFub3RoZXIgcG9pbnRcbiAgICogQHBhcmFtICB7W1ZlY3RvcjJEfSBhcnlcbiAgICogQHJldHVybiB7Qm94MkR9XG4gICAqL1xuICBzdGF0aWMgYm94RnJvbVBvaW50cyhhcnkpIHtcbiAgICBsZXQgeG1pbiA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgbGV0IHltaW4gPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGxldCB4bWF4ID0gLU51bWJlci5NQVhfVkFMVUU7XG4gICAgbGV0IHltYXggPSAtTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB4bWluID0gTWF0aC5taW4oeG1pbiwgYXJ5W2ldLngpO1xuICAgICAgeW1pbiA9IE1hdGgubWluKHltaW4sIGFyeVtpXS55KTtcbiAgICAgIHhtYXggPSBNYXRoLm1heCh4bWF4LCBhcnlbaV0ueCk7XG4gICAgICB5bWF4ID0gTWF0aC5tYXgoeW1heCwgYXJ5W2ldLnkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQm94MkQoeG1pbiwgeW1pbiwgeG1heCAtIHhtaW4sIHltYXggLSB5bWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhY2Nlc3NvcnMgZm9yIGFsbCBjb3JuZXJzLCBlZGdlcyBvZiB0aGUgYm94XG4gICAqL1xuICBnZXQgbGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy54O1xuICB9XG5cbiAgc2V0IGxlZnQoX3gpIHtcbiAgICB0aGlzLnggPSBfeDtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53O1xuICB9XG5cbiAgc2V0IHdpZHRoKF93KSB7XG4gICAgdGhpcy53ID0gX3c7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmg7XG4gIH1cblxuICBzZXQgaGVpZ2h0KF9oKSB7XG4gICAgdGhpcy5oID0gX2g7XG4gIH1cblxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnk7XG4gIH1cblxuICBzZXQgdG9wKF95KSB7XG4gICAgdGhpcy55ID0gX3k7XG4gIH1cblxuICBnZXQgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMudztcbiAgfVxuXG4gIHNldCByaWdodChfcikge1xuICAgIHRoaXMudyA9IF9yIC0gdGhpcy54O1xuICB9XG5cbiAgZ2V0IGJvdHRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oO1xuICB9XG5cbiAgc2V0IGJvdHRvbShfYikge1xuICAgIHRoaXMuaCA9IF9iIC0gdGhpcy55O1xuICB9XG5cbiAgZ2V0IGN4KCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLncgLyAyO1xuICB9XG5cbiAgc2V0IGN4KF9jeCkge1xuICAgIHRoaXMueCA9IF9jeCAtIHRoaXMudyAvIDI7XG4gIH1cblxuICBnZXQgY3koKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaCAvIDI7XG4gIH1cblxuICBzZXQgY3koX2N5KSB7XG4gICAgdGhpcy55ID0gX2N5IC0gdGhpcy5oIC8gMjtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyRCh0aGlzLmN4LCB0aGlzLmN5KTtcbiAgfVxuXG4gIHNldCBjZW50ZXIodmVjdG9yKSB7XG4gICAgdGhpcy5jeCA9IHZlY3Rvci54O1xuICAgIHRoaXMuY3kgPSB2ZWN0b3IueTtcbiAgfVxuXG4gIGdldCB0b3BMZWZ0KCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMkQodGhpcy54LCB0aGlzLnkpO1xuICB9XG5cbiAgc2V0IHRvcExlZnQodmVjdG9yKSB7XG4gICAgdGhpcy54ID0gdmVjdG9yLng7XG4gICAgdGhpcy55ID0gdmVjdG9yLnk7XG4gIH1cblxuICBnZXQgdG9wUmlnaHQoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyRCh0aGlzLnJpZ2h0LCB0aGlzLnkpO1xuICB9XG5cbiAgc2V0IHRvcFJpZ2h0KHZlY3Rvcikge1xuICAgIHRoaXMucmlnaHQgPSB2ZWN0b3IueDtcbiAgICB0aGlzLnkgPSB2ZWN0b3IueTtcbiAgfVxuXG4gIGdldCBib3R0b21SaWdodCgpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHRoaXMucmlnaHQsIHRoaXMuYm90dG9tKTtcbiAgfVxuXG4gIHNldCBib3R0b21SaWdodCh2ZWN0b3IpIHtcbiAgICB0aGlzLnJpZ2h0ID0gdmVjdG9yLng7XG4gICAgdGhpcy5ib3R0b20gPSB2ZWN0b3IueTtcbiAgfVxuXG4gIGdldCBib3R0b21MZWZ0KCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMkQodGhpcy54LCB0aGlzLmJvdHRvbSk7XG4gIH1cblxuICBzZXQgYm90dG9tTGVmdCh2ZWN0b3IpIHtcbiAgICB0aGlzLnggPSB2ZWN0b3IueDtcbiAgICB0aGlzLmJvdHRvbSA9IHZlY3Rvci55O1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiBhIGNsb25lZCBjb3B5IG9mIHRoaXNcbiAgICogQHJldHVybiBCb3gyRFxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBCb3gyRCh0aGlzLngsIHRoaXMueSwgdGhpcy53LCB0aGlzLmgpO1xuICB9XG5cbiAgLyoqXG4gICAqIG5vcm1hbGl6ZSBieSByZXR1cm5pbmcgYSBuZXcgYm94IHdpdGggcG9zaXRpdmUgZXh0ZW50c1xuICAgKi9cbiAgbm9ybWFsaXplKCkge1xuICAgIHJldHVybiBuZXcgQm94MkQoXG4gICAgICBNYXRoLm1pbih0aGlzLngsIHRoaXMucmlnaHQpLFxuICAgICAgTWF0aC5taW4odGhpcy55LCB0aGlzLmJvdHRvbSksXG4gICAgICBNYXRoLmFicyh0aGlzLncpLFxuICAgICAgTWF0aC5hYnModGhpcy5oKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIGEgbmV3IEJveCBpbmZsYXRlZCBieSB0aGUgZ2l2ZW4gc2lnbmVkIGFtb3VudFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5mbGF0ZVhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZmxhdGVZXG4gICAqL1xuICBpbmZsYXRlKGluZmxhdGVYLCBpbmZsYXRlWSkge1xuICAgIGNvbnN0IGJveCA9IG5ldyBCb3gyRCh0aGlzLngsIHRoaXMueSwgdGhpcy53ICsgaW5mbGF0ZVggKiAyLCB0aGlzLmggKyBpbmZsYXRlWSAqIDIpO1xuICAgIGJveC5jeCA9IHRoaXMuY3g7XG4gICAgYm94LmN5ID0gdGhpcy5jeTtcbiAgICByZXR1cm4gYm94O1xuICB9XG5cbiAgLyoqXG4gICAqIHNjYWxlIHdpZHRoL2hlaWdodCBvZiBib3ggYXJvdW5kIGNlbnRlciByZXR1cm5pbmcgYSBuZXcgYm94XG4gICAqIEBwYXJhbSB4XG4gICAqIEBwYXJhbSB5XG4gICAqL1xuICBzY2FsZSh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBCb3gyRChcbiAgICAgIHRoaXMuY3ggLSAodGhpcy53aWR0aCAqIHgpIC8gMixcbiAgICAgIHRoaXMuY3kgLSAodGhpcy5oZWlnaHQgKiB5KSAvIDIsXG4gICAgICB0aGlzLndpZHRoICogeCxcbiAgICAgIHRoaXMuaGVpZ2h0ICogeSk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIGEgbmV3IGJveCB0aGF0IGlzIHRoaXMgYm94ICogZVxuICAgKiBAcGFyYW0gbXVsdGlwbGllclxuICAgKi9cbiAgbXVsdGlwbHkobXVsdGlwbGllcikge1xuICAgIHJldHVybiBuZXcgQm94MkQodGhpcy54ICogbXVsdGlwbGllciwgdGhpcy55ICogbXVsdGlwbGllciwgdGhpcy53aWR0aCAqIG11bHRpcGxpZXIsIHRoaXMuaGVpZ2h0ICogbXVsdGlwbGllcik7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIGEgbmV3IGJveCB0aGF0IGlzIHRoaXMgYm94IC8gZVxuICAgKiBAcGFyYW0gZGl2aXNvclxuICAgKi9cbiAgZGl2aWRlKGRpdmlzb3IpIHtcbiAgICByZXR1cm4gbmV3IEJveDJEKHRoaXMueCAvIGRpdmlzb3IsIHRoaXMueSAvIGRpdmlzb3IsIHRoaXMud2lkdGggLyBkaXZpc29yLCB0aGlzLmhlaWdodCAvIGRpdmlzb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0cnVlIGlmIHRoaXMgYm94IGlzIGlkZW50aWNhbCB0byBhbm90aGVyIGJveFxuICAgKiBAcGFyYW0gb3RoZXJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBlcXVhbHMob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIueCA9PT0gdGhpcy54ICYmXG4gICAgICBvdGhlci55ID09PSB0aGlzLnkgJiZcbiAgICAgIG90aGVyLndpZHRoID09PSB0aGlzLndpZHRoICYmXG4gICAgICBvdGhlci5oZWlnaHQgPT09IHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiBhIG5ldyBib3ggdGhhdCBpcyB0aGUgdW5pb24gb2YgdGhpcyBib3ggYW5kIHNvbWUgb3RoZXIgYm94L3JlY3QgbGlrZSBvYmplY3RcbiAgICogQHBhcmFtIGJveCAtIGFueXRoaW5nIHdpdGggeCx5LHcsaCBwcm9wZXJ0aWVzXG4gICAqIEByZXR1cm5zIEJveDJEIC0gdGhlIHVuaW9uIG9mIHRoaXMgYW5kIGJveFxuICAgKi9cbiAgdW5pb24oYm94KSB7XG4gICAgY29uc3QgdW5pID0gbmV3IEJveDJEKFxuICAgICAgTWF0aC5taW4odGhpcy54LCBib3gueCksXG4gICAgICBNYXRoLm1pbih0aGlzLnksIGJveC55KSxcbiAgICAgIDAsIDBcbiAgICApO1xuXG4gICAgdW5pLnJpZ2h0ID0gTWF0aC5tYXgodGhpcy5yaWdodCwgYm94LnggKyBib3gudyk7XG4gICAgdW5pLmJvdHRvbSA9IE1hdGgubWF4KHRoaXMuYm90dG9tLCBib3gueSArIGJveC5oKTtcblxuICAgIHJldHVybiB1bmk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBudGggZWRnZVxuICAgKiAwOiB0b3AgbGVmdCAtPiB0b3AgcmlnaHRcbiAgICogMTogdG9wIHJpZ2h0IC0+IGJvdHRvbSByaWdodFxuICAgKiAyOiBib3R0b20gcmlnaHQgLT4gYm90dG9tIGxlZnRcbiAgICogMzogYm90dG9tIGxlZnQgLT4gdG9wIGxlZnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG50aFxuICAgKi9cbiAgZ2V0RWRnZShudGgpIHtcbiAgICBpbnZhcmlhbnQobnRoID49IDAgJiYgbnRoIDwgNCwgJ0JhZCBwYXJhbWV0ZXInKTtcbiAgICBzd2l0Y2ggKG50aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBuZXcgTGluZTJEKG5ldyBWZWN0b3IyRCh0aGlzLngsIHRoaXMueSksIG5ldyBWZWN0b3IyRCh0aGlzLnJpZ2h0LCB0aGlzLnkpKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gbmV3IExpbmUyRChuZXcgVmVjdG9yMkQodGhpcy5yaWdodCwgdGhpcy55KSwgbmV3IFZlY3RvcjJEKHRoaXMucmlnaHQsIHRoaXMuYm90dG9tKSk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIG5ldyBMaW5lMkQobmV3IFZlY3RvcjJEKHRoaXMucmlnaHQsIHRoaXMuYm90dG9tKSwgbmV3IFZlY3RvcjJEKHRoaXMueCwgdGhpcy5ib3R0b20pKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG5ldyBMaW5lMkQobmV3IFZlY3RvcjJEKHRoaXMueCwgdGhpcy5ib3R0b20pLCBuZXcgVmVjdG9yMkQodGhpcy54LCB0aGlzLnkpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSB1bmlvbiBvZiB0aGUgZ2l2ZW4gYm94ZXMgb3IgYW4gZW1wdHkgYm94IGlmIHRoZSBsaXN0IGlzIGVtcHR5XG4gICAqIEBzdGF0aWNcbiAgICovXG4gIHN0YXRpYyB1bmlvbihib3hlcykge1xuICAgIGNvbnN0IHVuaSA9IG5ldyBCb3gyRCgwLCAwLCAwLCAwKTtcblxuICAgIGlmIChib3hlcyAmJiBib3hlcy5sZW5ndGgpIHtcbiAgICAgIHVuaS54ID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYm94ZXMubWFwKGJveCA9PiBib3gueCkpO1xuICAgICAgdW5pLnkgPSBNYXRoLm1pbi5hcHBseShudWxsLCBib3hlcy5tYXAoYm94ID0+IGJveC55KSk7XG4gICAgICB1bmkuciA9IE1hdGgubWluLmFwcGx5KG51bGwsIGJveGVzLm1hcChib3ggPT4gYm94LnIpKTtcbiAgICAgIHVuaS5iID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYm94ZXMubWFwKGJveCA9PiBib3guYikpO1xuICAgIH1cbiAgICByZXR1cm4gdW5pO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0aGUgaW50ZXJzZWN0aW9uIG9mIHRoaXMgYm94IHdpdGggdGhlIG90aGVyIGJveFxuICAgKiBAcGFyYW0gYm94XG4gICAqL1xuICBpbnRlcnNlY3RXaXRoQm94KGJveCkge1xuICAgIC8vIG1pbmltdW0gb2YgcmlnaHQgZWRnZXNcbiAgICBjb25zdCBtaW54ID0gTWF0aC5taW4odGhpcy5yaWdodCwgYm94LnJpZ2h0KTtcbiAgICAvLyBtYXhpbXVtIG9mIGxlZnQgZWRnZXNcbiAgICBjb25zdCBtYXh4ID0gTWF0aC5tYXgodGhpcy54LCBib3gueCk7XG4gICAgLy8gbWluaW11bSBvZiBib3R0b20gZWRnZXNcbiAgICBjb25zdCBtaW55ID0gTWF0aC5taW4odGhpcy5ib3R0b20sIGJveC5ib3R0b20pO1xuICAgIC8vIG1heGltdW0gb2YgdG9wIGVkZ2VzXG4gICAgY29uc3QgbWF4eSA9IE1hdGgubWF4KHRoaXMueSwgYm94LnkpO1xuICAgIC8vIGlmIGFyZWEgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlcmUgaXMgYW4gaW50ZXJzZWN0aW9uXG4gICAgaWYgKG1heHggPCBtaW54ICYmIG1heHkgPCBtaW55KSB7XG4gICAgICBjb25zdCB4ID0gTWF0aC5taW4obWlueCwgbWF4eCk7XG4gICAgICBjb25zdCB5ID0gTWF0aC5taW4obWlueSwgbWF4eSk7XG4gICAgICBjb25zdCB3ID0gTWF0aC5tYXgobWlueCwgbWF4eCkgLSB4O1xuICAgICAgY29uc3QgaCA9IE1hdGgubWF4KG1pbnksIG1heHkpIC0geTtcbiAgICAgIHJldHVybiBuZXcgQm94MkQoeCwgeSwgdywgaCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0cnVlIGlmIHdlIGFyZSBjb21wbGV0ZWx5IGluc2lkZSB0aGUgb3RoZXIgYm94XG4gICAqIEBwYXJhbSBvdGhlclxuICAgKi9cbiAgaXNJbnNpZGUob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy54ID49IG90aGVyLnggJiZcbiAgICAgIHRoaXMueSA+PSBvdGhlci55ICYmXG4gICAgICB0aGlzLnJpZ2h0IDw9IG90aGVyLnJpZ2h0ICYmXG4gICAgICB0aGlzLmJvdHRvbSA8PSBvdGhlci5ib3R0b207XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIHBvaW50ICggYW55dGhpbmcgd2l0aCB4L3kgcHJvcGVydGllcyApIGlzIGluc2lkZSB0aGUgYm94XG4gICAqIEBwYXJhbSBwb2ludFxuICAgKi9cbiAgcG9pbnRJbkJveChwb2ludCkge1xuICAgIHJldHVybiBwb2ludC54ID49IHRoaXMueCAmJiBwb2ludC55ID49IHRoaXMueSAmJiBwb2ludC54IDwgdGhpcy5yaWdodCAmJiBwb2ludC55IDwgdGhpcy5ib3R0b207XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRydWUgaWYgdGhlIGJveCBoYXZlIHplcm8gb3IgbmVnYXRpdmUgZXh0ZW50cyBpbiBlaXRoZXIgYXhpc1xuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy53IDw9IDAgfHwgdGhpcy5oIDw9IDA7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdHMvZ2VvbWV0cnkvYm94MmQuanNcbiAqKi8iLCJpbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSAnLi4vZ2VvbWV0cnkvdmVjdG9yMmQnO1xuaW1wb3J0IEQgZnJvbSAnLi4vZG9tL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdlclN0YXR1c0JhciB7XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yIG9ubHkgbmVlZHMgdGhlIHZpZXdlclxuICAgKiBAcGFyYW0gdmlld2VyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2aWV3ZXIpIHtcbiAgICB0aGlzLnZpZXdlciA9IHZpZXdlcjtcbiAgICB0aGlzLm91dGVyID0gRChcbiAgICAgIGA8ZGl2IGNsYXNzPVwidmlld2VyLXN0YXR1cy1iYXJcIj5cbiAgICAgICAgPHNwYW4+U2VhcmNoPC9zcGFuPjxpbnB1dCBtYXhsZW5ndGg9XCIxMjhcIiBkYXRhLXJlZj1cInNlYXJjaEJveFwiLz5cbiAgICAgICAgPHNwYW4+U3RhcnQ8L3NwYW4+PGlucHV0IG1heGxlbmd0aD1cIjIwXCIgZGF0YS1yZWY9XCJzdGFydEJveFwiLz5cbiAgICAgICAgPHNwYW4+RW5kPC9zcGFuPjxpbnB1dCBtYXhsZW5ndGg9XCIyMFwiIGRhdGEtcmVmPVwiZW5kQm94XCIvPlxuICAgICAgICA8c3BhbiBkYXRhLXJlZj1cImxlbmd0aFNwYW5cIj5MZW5ndGg6PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXJlZj1cInBvc2l0aW9uU3BhblwiPjwvc3Bhbj5cbiAgICAgIDwvZGl2PmBcbiAgICApO1xuICAgIHRoaXMudmlld2VyLm9wdGlvbnMucGFyZW50LmFwcGVuZENoaWxkKHRoaXMub3V0ZXIuZWwpO1xuICAgIHRoaXMub3V0ZXIuaW1wb3J0UmVmcyh0aGlzKTtcblxuICAgIHRoaXMuc3RhcnRCb3guZWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLnVwZGF0ZVNlbGVjdGlvbi5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVuZEJveC5lbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMudXBkYXRlU2VsZWN0aW9uLmJpbmQodGhpcykpO1xuICAgIHRoaXMuc2VhcmNoQm94LmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5vblNlYXJjaFRlcm1DaGFuZ2VkLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc3RhcnQvZW5kIHZhbHVlXG4gICAqIEBwYXJhbSBpbmRleFxuICAgKi9cbiAgc2V0U3RhcnQoaW5kZXgpIHtcbiAgICB0aGlzLnN0YXJ0Qm94LmVsLnZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA/IGluZGV4IDogJyc7XG4gIH1cbiAgc2V0RW5kKGluZGV4KSB7XG4gICAgdGhpcy5lbmRCb3guZWwudmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID8gaW5kZXggOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIGJhc2UgcGFpcnMgaW5mb3JtYXRpb25cbiAgICogQHBhcmFtIG5cbiAgICovXG4gIHNldEJhc2VQYWlycyhuKSB7XG4gICAgdGhpcy5iYXNlUGFpcnMgPSBuIHx8IDA7XG4gICAgdGhpcy5sZW5ndGhTcGFuLmVsLmlubmVyVGV4dCA9IGBMZW5ndGg6ICR7dGhpcy5iYXNlUGFpcnN9IEJQYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBkaXNwbGF5IHRoZSBwb3NpdGlvbiBib3ggb3IgaGlkZVxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHNldFBvc2l0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5wb3NpdGlvblNwYW4uZWwuaW5uZXJUZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA/IGBQb3NpdGlvbjogJHtpbmRleH1gIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogY2FsbGVkIHRvIHJlc2V0IHNlYXJjaCB0ZXJtIGJveFxuICAgKi9cbiAgcmVzZXRTZWFyY2goKSB7XG4gICAgdGhpcy5zZWFyY2hCb3guZWwudmFsdWUgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGUgc2VsZWN0aW9uIGZyb20gdGV4dCBpbiBpbnB1dHNcbiAgICovXG4gIHVwZGF0ZVNlbGVjdGlvbigpIHtcbiAgICBjb25zdCBsaW1pdHMgPSB0aGlzLmdldFN0YXJ0RW5kRnJvbUlucHV0cygpO1xuICAgIGlmIChsaW1pdHMpIHtcbiAgICAgIHRoaXMudmlld2VyLnVzZXJJbnRlcmZhY2Uuc2V0U2VsZWN0aW9uRnJvbUNvbHVtblJvdyhsaW1pdHMuc3RhcnQsIGxpbWl0cy5lbmQpO1xuICAgICAgdGhpcy52aWV3ZXIuZmlyc3RSb3cgPSBsaW1pdHMuc3RhcnQueTtcbiAgICAgIHRoaXMudmlld2VyLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogaWYgYm90aCBzdGFydCBhbmQgZW5kIGFyZSBjdXJyZW50bHkgdmFsaWQgdGhlbiByZXR1cm5cbiAgICogdGhlIHN0YXJ0IGFuZCBlbmQgYXMgVmVjdG9yMkRcbiAgICovXG4gIGdldFN0YXJ0RW5kRnJvbUlucHV0cygpIHtcbiAgICBsZXQgc3RhcnQgPSBOdW1iZXIucGFyc2VGbG9hdCh0aGlzLnN0YXJ0Qm94LmVsLnZhbHVlKTtcbiAgICBsZXQgZW5kID0gTnVtYmVyLnBhcnNlRmxvYXQodGhpcy5lbmRCb3guZWwudmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNOYU4oc3RhcnQpIHx8IE51bWJlci5pc05hTihlbmQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gY2xhbXAgdG8gYXZhaWxhYmxlIG51bWJlciBvZiBiYXNlIHBhaXJcbiAgICBzdGFydCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHN0YXJ0LCB0aGlzLmJhc2VQYWlycyAtIDEpKTtcbiAgICBlbmQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihlbmQsIHRoaXMuYmFzZVBhaXJzIC0gMSkpO1xuICAgIC8vIHJhbmdlIG11c3QgYmUgcmlnaHQgc2lkZSB1cFxuICAgIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IG5ldyBWZWN0b3IyRChzdGFydCAlIHRoaXMudmlld2VyLnJvd0xlbmd0aCwgTWF0aC5mbG9vcihzdGFydCAvIHRoaXMudmlld2VyLnJvd0xlbmd0aCkpLFxuICAgICAgZW5kOiBuZXcgVmVjdG9yMkQoZW5kICUgdGhpcy52aWV3ZXIucm93TGVuZ3RoLCBNYXRoLmZsb29yKGVuZCAvIHRoaXMudmlld2VyLnJvd0xlbmd0aCkpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIGEgaGFzaCBvZiB0aGUgYmlncmFtcyBmb3IgYSBnaXZlbiBzdHJpbmcuXG4gICAqIEVhY2ggaGFzaCBlbnRyeSBpcyBrZXk6YmlnZ3JhbSwgdmFsdWU6IG51bWJlciBvZiBvY2N1cnJlbmNlc1xuICAgKiBAcGFyYW0gc3RyXG4gICAqL1xuICBiaWdyYW1zKHN0cikge1xuICAgIGludmFyaWFudChzdHIgJiYgc3RyLmxlbmd0aCA+PSAyLCAnc3RyaW5nIG11c3QgYmUgMiBjaGFycyBhdCBsZWFzdCcpO1xuICAgIGNvbnN0IGhhc2ggPSB7fTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aCAtIDE7IGkgKz0gMSkge1xuICAgICAgY29uc3QgYmlncmFtID0gc3RyLnN1YnN0cihpLCAyKTtcbiAgICAgIGxldCByZWNvcmQgPSBoYXNoW2JpZ3JhbV07XG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIHJlY29yZC5jb3VudCArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGFzaFtiaWdyYW1dID0ge2NvdW50OiAxfTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYWRkIG51bWJlciBvZiBwYWlycyB0byBoYXNoIGFuZCByZXR1cm5cbiAgICByZXR1cm4gaGFzaDtcbiAgfVxuICAvKipcbiAgICogTWF0Y2ggdHdvIHN0cmluZyB1c2luZyB0aGUgc29yZW5zZW4tZGljZSBhbGdvcml0aG1cbiAgICogaHR0cDovL3d3dy5hbGdvbWF0aW9uLmNvbS9hbGdvcml0aG0vc29yZW5zZW4tZGljZS1zdHJpbmctc2ltaWxhcml0eVxuICAgKiBAcGFyYW0gcGF0dGVyblxuICAgKiBAcGFyYW0gbWF0dGVyXG4gICAqL1xuICBzb3JlbnNlbkRpY2UoX3N0cjEsIF9zdHIyKSB7XG4gICAgaW52YXJpYW50KF9zdHIxICYmIF9zdHIyLCAnYm90aCBtdXN0IGJlIHN0cmluZ3Mgd2l0aCBhdCBsZWFzdCAxIGNoYXInKTtcbiAgICAvLyBhbHdheXMgY29tcGFyZSB3aXRoIGNhc2VcbiAgICBjb25zdCBzdHIxID0gX3N0cjEudG9VcHBlckNhc2UoKTtcbiAgICBjb25zdCBzdHIyID0gX3N0cjIudG9VcHBlckNhc2UoKTtcblxuICAgIC8vIGlmIHRoZSBwYXR0ZXJuIHN0cmluZyBpcyAxIGNoYXIgdGhlbiBqdXN0IHJldHVybiAxIC8gbGVuZ3RoXG4gICAgLy8gb2YgbWF0Y2ggc3RyaW5nIGlmIHRoZSBjaGFyIG9jY3VycyBpbiB0aGUgdGFyZ2V0XG4gICAgaWYgKHN0cjEubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gc3RyMi5pbmRleE9mKHN0cjEpID49IDAgPyAxIC8gc3RyMi5sZW5ndGggOiAwO1xuICAgIH1cbiAgICAvLyBsaWtld2lzZSBpZiB0aGUgcGF0dGVybiBpcyBvbmx5IDEgY2hhclxuICAgIGlmIChzdHIyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHN0cjEuaW5kZXhPZihzdHIyKSA+PSAwID8gMSAvIHN0cjEubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgLy8gYm90aCBzdHJpbmdzIGhhdmUgb25lIG9yIG1vcmUgYmlncmFtcyBzbyB3ZSBjYW4gdXNlIHRoZSBhbGdvcml0aG1cbiAgICBjb25zdCBiMSA9IHRoaXMuYmlncmFtcyhzdHIxKTtcbiAgICBjb25zdCBiMiA9IHRoaXMuYmlncmFtcyhzdHIyKTtcbiAgICAvLyBjb3VudCB0aGUgb2NjdXJyZW5jZXMgb2YgdGhlIGIxIHBhaXJzIGluIGIyXG4gICAgY29uc3QgYmlncmFtcyA9IE9iamVjdC5rZXlzKGIxKTtcbiAgICBsZXQgbWF0Y2hlcyA9IDA7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJpZ3JhbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGJpZ3JhbSA9IGJpZ3JhbXNbaV07XG4gICAgICBjb25zdCBtYXRjaCA9IGIyW2JpZ3JhbV07XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgbWF0Y2guY291bnQgPSBNYXRoLm1heCgwLCBtYXRjaC5jb3VudCAtIDEpO1xuICAgICAgICBtYXRjaGVzICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJldHVybiBhIG5vcm1hbGl6ZSAoIDAuLjEgKSB2YWx1ZSBieSByZXR1cm5pbmcgdGhlIG51bWJlclxuICAgIC8vIG1hdGNoZXMgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBwYWlycyBpbiBzdHIyXG4gICAgcmV0dXJuIG1hdGNoZXMgLyBPYmplY3Qua2V5cyhiMikubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlYXJjaCB0ZXJtIHdhcyBjaGFuZ2VkLCBzdGFydCBhIG5ldyBzZWFyY2ggb2YgdGhlIGJsb2NrcyBhbmQgYW5ub3RhdGlvbnMgZm9yIHRoZSBjbG9zZXN0IG5hbWVcbiAgICogbWF0Y2guXG4gICAqL1xuICBvblNlYXJjaFRlcm1DaGFuZ2VkKCkge1xuICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaEJveC5lbC52YWx1ZS50cmltKCk7XG4gICAgaWYgKHRlcm0pIHtcbiAgICAgIC8vIGZpbmQgdGhlIGhpZ2hlc3Qgc2NvcmluZyBibG9jayBvciBhbm5vdGF0aW9uXG4gICAgICBsZXQgYmVzdCA9IG51bGw7XG4gICAgICBsZXQgYmVzdFNjb3JlID0gLUluZmluaXR5O1xuICAgICAgbGV0IGJsb2NrT3JBbm5vdGF0aW9uID0gbnVsbDtcblxuICAgICAgLy8gc2NvcmUgYmxvY2tzXG4gICAgICB0aGlzLnZpZXdlci5ibG9ja0xpc3QuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgIGNvbnN0IHNjb3JlID0gdGhpcy5zb3JlbnNlbkRpY2UoYmxvY2suZ2V0TmFtZSgpLCB0ZXJtKTtcbiAgICAgICAgaWYgKHNjb3JlID4gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgYmVzdCA9IGJsb2NrO1xuICAgICAgICAgIGJsb2NrT3JBbm5vdGF0aW9uID0gJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHNjb3JlIGFubm90YXRpb25zXG4gICAgICB0aGlzLnZpZXdlci5hbm5vdGF0aW9uTGlzdC5mb3JFYWNoKGFubm90YXRpb24gPT4ge1xuICAgICAgICBjb25zdCBzY29yZSA9IHRoaXMuc29yZW5zZW5EaWNlKGFubm90YXRpb24ubmFtZSwgdGVybSk7XG4gICAgICAgIGlmIChzY29yZSA+IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBhbm5vdGF0aW9uO1xuICAgICAgICAgIGJsb2NrT3JBbm5vdGF0aW9uID0gJ2Fubm90YXRpb24nO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gc2VsZWN0IGFuZCBzaG93IHRoZSBoaWdoZXN0IHNjb3JpbmcgaXRlbVxuICAgICAgaWYgKGJlc3QgJiYgYmxvY2tPckFubm90YXRpb24gPT09ICdibG9jaycpIHtcbiAgICAgICAgdGhpcy52aWV3ZXIuc2VsZWN0QmxvY2soYmVzdC5pZCk7XG4gICAgICAgIHRoaXMudmlld2VyLnNob3dCbG9jayhiZXN0LmlkKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZXN0ICYmIGJsb2NrT3JBbm5vdGF0aW9uID09PSAnYW5ub3RhdGlvbicpIHtcbiAgICAgICAgdGhpcy52aWV3ZXIuc2VsZWN0QW5ub3RhdGlvbihiZXN0LmlkKTtcbiAgICAgICAgdGhpcy52aWV3ZXIuc2hvd0Fubm90YXRpb24oYmVzdC5pZCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVzdCkge1xuICAgICAgICB0aGlzLnZpZXdlci5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL3ZpZXdlci9zdGF0dXMtYmFyLmpzXG4gKiovIiwiaW1wb3J0IEQgZnJvbSAnLi4vLi4vZG9tL2RvbSc7XG5cbi8qKlxuICogcmVuZGVyIGEgc2VxdWVuY2Ugb2YgY2hhcnMgd2l0aCBhcHBlYXJhbmNlIGFzIGZvciBwcmltYXJ5IHNlcXVlbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlclNlcXVlbmNlUm93KHZpZXdlciwgcm93RWwsIHJlY29yZCwgeSkge1xuICBsZXQgZSA9IEQoJzxkaXYgY2xhc3M9XCJzZXF1ZW5jZS10ZXh0IHJvYm90byBmaXhlZCBmb250LXNpemVcIj48L2Rpdj4nKTtcbiAgZS5zZXRTdHlsZXMoe1xuICAgIGxlZnQgICAgICA6IHJlY29yZC5zdGFydFJvd09mZnNldCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgd2lkdGggICAgIDogcmVjb3JkLmxlbmd0aCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgdG9wICAgICAgIDogeSArICdweCcsXG4gICAgaGVpZ2h0ICAgIDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gICAgbGluZUhlaWdodDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gIH0pO1xuICBlLmVsLmlubmVyVGV4dCA9IHZpZXdlci5nZXRTZXF1ZW5jZShyZWNvcmQuYmxvY2ssIHJlY29yZC5ibG9ja09mZnNldCwgcmVjb3JkLmxlbmd0aCk7XG4gIHJvd0VsLmFwcGVuZENoaWxkKGUpO1xufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdHMvdmlld2VyL3Jvdy10eXBlcy9zZXF1ZW5jZS1yb3cuanNcbiAqKi8iLCJpbXBvcnQgRCBmcm9tICcuLi8uLi9kb20vZG9tJztcblxuLyoqXG4gKiByZW5kZXIgdGhlIHJvdyBvZiArKysrIGNoYXJzIGJldHdlZW4gdGhlIHByaW1hcnkgYW5kIHJldmVyc2Ugc2VxdWVuY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyU2VwYXJhdG9yU2VxdWVuY2VSb3codmlld2VyLCByb3dFbCwgcmVjb3JkLCB5KSB7XG4gIGxldCBlID0gRCgnPGRpdiBjbGFzcz1cInNlcXVlbmNlLXRleHQtbWFya2VyIHJvYm90byBmaXhlZCBmb250LXNpemVcIj48L2Rpdj4nKTtcbiAgZS5zZXRTdHlsZXMoe1xuICAgIGxlZnQgICAgICA6IHJlY29yZC5zdGFydFJvd09mZnNldCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgd2lkdGggICAgIDogcmVjb3JkLmxlbmd0aCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgdG9wICAgICAgIDogeSArICdweCcsXG4gICAgaGVpZ2h0ICAgIDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gICAgbGluZUhlaWdodDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gIH0pO1xuICBlLmVsLmlubmVyVGV4dCA9IFwiK1wiLnJlcGVhdChyZWNvcmQubGVuZ3RoKTtcbiAgcm93RWwuYXBwZW5kQ2hpbGQoZSk7XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL3NlcGFyYXRvci1zZXF1ZW5jZS1yb3cuanNcbiAqKi8iLCJpbXBvcnQgRCBmcm9tICcuLi8uLi9kb20vZG9tJztcblxuLyoqXG4gKiByZW5kZXIgYSBzZXF1ZW5jZSBvZiBjaGFycyB3aXRoIGFwcGVhcmFuY2UgYXMgZm9yIHByaW1hcnkgc2VxdWVuY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyUmV2ZXJzZVNlcXVlbmNlUm93KHZpZXdlciwgcm93RWwsIHJlY29yZCwgeSkge1xuICBsZXQgZSA9IEQoJzxkaXYgY2xhc3M9XCJzZXF1ZW5jZS10ZXh0LXJldmVyc2Ugcm9ib3RvIGZpeGVkIGZvbnQtc2l6ZVwiPjwvZGl2PicpO1xuICBlLnNldFN0eWxlcyh7XG4gICAgbGVmdCAgICAgIDogcmVjb3JkLnN0YXJ0Um93T2Zmc2V0ICogdmlld2VyLmdldENoYXJXaWR0aCgpICsgJ3B4JyxcbiAgICB3aWR0aCAgICAgOiByZWNvcmQubGVuZ3RoICogdmlld2VyLmdldENoYXJXaWR0aCgpICsgJ3B4JyxcbiAgICB0b3AgICAgICAgOiB5ICsgJ3B4JyxcbiAgICBoZWlnaHQgICAgOiB2aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICsgJ3B4JyxcbiAgICBsaW5lSGVpZ2h0OiB2aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICsgJ3B4JyxcbiAgfSk7XG4gIGUuZWwuaW5uZXJUZXh0ID0gdmlld2VyLmdldFNlcXVlbmNlKHJlY29yZC5ibG9jaywgcmVjb3JkLmJsb2NrT2Zmc2V0LCByZWNvcmQubGVuZ3RoLCB0cnVlKTtcbiAgcm93RWwuYXBwZW5kQ2hpbGQoZSk7XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9qYXZhc2NyaXB0cy92aWV3ZXIvcm93LXR5cGVzL3JldmVyc2Utc2VxdWVuY2Utcm93LmpzXG4gKiovIiwiaW1wb3J0IEQgZnJvbSAnLi4vLi4vZG9tL2RvbSc7XG5cbi8qKlxuICogcmVuZGVyIGEgc2VxdWVuY2Ugb2YgY2hhcnMgd2l0aCBhcHBlYXJhbmNlIGFzIGZvciBwcmltYXJ5IHNlcXVlbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlckJsb2NrU2VxdWVuY2VSb3codmlld2VyLCByb3dFbCwgcmVjb3JkLCB5KSB7XG4gIGxldCBlID0gRCgnPGRpdiBjbGFzcz1cInNlcXVlbmNlLW5hbWUgcm9ib3RvIGZpeGVkIGZvbnQtc2l6ZVwiPjwvZGl2PicpO1xuICBlLnNldFN0eWxlcyh7XG4gICAgbGVmdCAgICAgICAgICAgOiByZWNvcmQuc3RhcnRSb3dPZmZzZXQgKiB2aWV3ZXIuZ2V0Q2hhcldpZHRoKCkgKyAncHgnLFxuICAgIHdpZHRoICAgICAgICAgIDogcmVjb3JkLmxlbmd0aCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgdG9wICAgICAgICAgICAgOiB5ICsgJ3B4JyxcbiAgICBoZWlnaHQgICAgICAgICA6IHZpZXdlci5nZXRDaGFySGVpZ2h0KCkgKyAncHgnLFxuICAgIGxpbmVIZWlnaHQgICAgIDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiByZWNvcmQuYmxvY2subWV0YWRhdGEuY29sb3IgfHwgJ2xpZ2h0Z3JheScsXG4gIH0pO1xuICBlLmVsLmlubmVyVGV4dCA9ICfigKInICsgcmVjb3JkLmJsb2NrLmdldE5hbWUoKSArICfigKInO1xuICByb3dFbC5hcHBlbmRDaGlsZChlKTtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL3ZpZXdlci9yb3ctdHlwZXMvYmxvY2stc2VxdWVuY2Utcm93LmpzXG4gKiovIiwiaW1wb3J0IEQgZnJvbSAnLi4vLi4vZG9tL2RvbSc7XG5cbi8qKlxuICogcmVuZGVyIGEgc2VxdWVuY2Ugb2YgY2hhcnMgd2l0aCBhcHBlYXJhbmNlIGFzIGZvciBwcmltYXJ5IHNlcXVlbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlclNlcXVlbmNlUnVsZXIodmlld2VyLCByb3dFbCwgeSwgc3RhcnQsIGxlbmd0aCkge1xuICAvLyByZW5kZXIgdGhlIHJ1bGVyIGNvbnRhaW5lciB3aGljaCBpcyB0YWxsIGVub3VnaCBmb3IgdGhlIG1hcmtlcnMuXG4gIC8vIEl0cyB0b3AgYm9yZGVyIGlzIHNldFxuICBsZXQgZSA9IEQoJzxkaXYgY2xhc3M9XCJzZXF1ZW5jZS1ydWxlciByb2JvdG8gZml4ZWQgZm9udC1zaXplXCI+PC9kaXY+Jyk7XG4gIGNvbnN0IEggPSB2aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICogMS41O1xuICBlLnNldFN0eWxlcyh7XG4gICAgbGVmdCAgICAgIDogJzBweCcsXG4gICAgd2lkdGggICAgIDogbGVuZ3RoICogdmlld2VyLmdldENoYXJXaWR0aCgpICsgJ3B4JyxcbiAgICB0b3AgICAgICAgOiB5ICsgJ3B4JyxcbiAgICBoZWlnaHQgICAgOiBIICsgJ3B4JyxcbiAgICBsaW5lSGVpZ2h0OiBIICsgJ3B4JyxcbiAgfSk7XG4gIC8vIGJlZ2luIGF0IHN0YXJ0IHBvc2l0aW9uIHJvdW5kZWQgZG93biB0byBuZWFyZXN0IDEwXG4gIGNvbnN0IGluaXRpYWwgPSBNYXRoLmZsb29yKHN0YXJ0IC8gMTApICogMTA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbGVuZ3RoOyBpICs9IDEwKSB7XG4gICAgLy8geHAgaXMgdGhlIGxvY2F0aW9uIG9mIHRoZSB0aWNrIG1hcmtcbiAgICBjb25zdCB4cCA9ICgoaW5pdGlhbCAtIHN0YXJ0KSArIGkpICogdmlld2VyLmdldENoYXJXaWR0aCgpICsgdmlld2VyLmdldENoYXJXaWR0aCgpIC8gMjtcbiAgICAvLyB0ZXh0IHZhbHVlIG9mIG1hcmtlclxuICAgIGNvbnN0IHZhbHVlID0gKGluaXRpYWwgKyBpKS50b1N0cmluZygpO1xuICAgIC8vIHdpZHRoIG9mIGVsZW1lbnQgaW5jbHVkaW5nIHRleHRcbiAgICBjb25zdCB3aWR0aCA9IHZhbHVlLmxlbmd0aCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKTtcbiAgICAvLyB0aGUgdGljayArIG51bWJlciBtdXN0IGJlIGNvbXBsZXRlIHZpc2libGUgb3Igd2UgZG9uJ3QgcmVuZGVyXG4gICAgaWYgKHhwIC0gd2lkdGggLyAyID49IDAgJiYgeHAgKyB3aWR0aCAvIDIgPD0gdmlld2VyLnJvd0xlbmd0aCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSkge1xuICAgICAgLy8gY3JlYXRlIHRpY2sgbWFya1xuICAgICAgY29uc3QgdGljayA9IEQoJzxkaXYgY2xhc3M9XCJ0aWNrXCI+PC9kaXY+Jyk7XG4gICAgICB0aWNrLnNldFN0eWxlcyh7XG4gICAgICAgIGxlZnQgIDogeHAgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IHZpZXdlci5nZXRDaGFySGVpZ2h0KCkgLyAyICsgJ3B4JyxcbiAgICAgIH0pO1xuICAgICAgZS5hcHBlbmRDaGlsZCh0aWNrKTtcbiAgICAgIC8vIGFkZCBudW1lcmljIHZhbHVlXG4gICAgICBjb25zdCBudW1iZXIgPSBEKGA8ZGl2IGNsYXNzPVwibnVtYmVyXCI+JHt2YWx1ZX08L2Rpdj5gKTtcbiAgICAgIG51bWJlci5zZXRTdHlsZXMoe1xuICAgICAgICBsZWZ0ICAgICAgOiB4cCAtIHdpZHRoIC8gMiArICdweCcsXG4gICAgICAgIHRvcCAgICAgICA6IHZpZXdlci5nZXRDaGFySGVpZ2h0KCkgLyAyICsgJ3B4JyxcbiAgICAgICAgd2lkdGggICAgIDogd2lkdGggKyAncHgnLFxuICAgICAgICBoZWlnaHQgICAgOiB2aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICsgJ3B4JyxcbiAgICAgICAgbGluZUhlaWdodDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gICAgICB9KTtcbiAgICAgIGUuYXBwZW5kQ2hpbGQobnVtYmVyKTtcbiAgICB9XG4gIH1cbiAgLy8gYWRkIHRoZSBlbnRpcmUgcnVsZXIgdG8gdGhlIHZpZXdlclxuICByb3dFbC5hcHBlbmRDaGlsZChlKTtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL3ZpZXdlci9yb3ctdHlwZXMvcnVsZXItcm93LmpzXG4gKiovIiwiaW1wb3J0IEQgZnJvbSAnLi4vLi4vZG9tL2RvbSc7XG5cbi8qKlxuICogcmVuZGVyIGFuIGFubm90YXRpb24gYmxvY2tcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyQW5ub3RhdGlvbih2aWV3ZXIsIHJvd0VsLCByZWNvcmQsIHkpIHtcbiAgbGV0IGUgPSBEKCc8ZGl2IGNsYXNzPVwiYW5ub3RhdGlvbiByb2JvdG8gZml4ZWQgZm9udC1zaXplXCI+PC9kaXY+Jyk7XG4gIGUuc2V0U3R5bGVzKHtcbiAgICBsZWZ0ICAgICAgICAgICA6IHJlY29yZC5zdGFydCAqIHZpZXdlci5nZXRDaGFyV2lkdGgoKSArICdweCcsXG4gICAgd2lkdGggICAgICAgICAgOiAocmVjb3JkLmVuZCAtIHJlY29yZC5zdGFydCArIDEpICogdmlld2VyLmdldENoYXJXaWR0aCgpICsgJ3B4JyxcbiAgICB0b3AgICAgICAgICAgICA6IHkgKyAocmVjb3JkLmRlcHRoICogdmlld2VyLmdldENoYXJIZWlnaHQoKSkgKyAncHgnLFxuICAgIGhlaWdodCAgICAgICAgIDogdmlld2VyLmdldENoYXJIZWlnaHQoKSArICdweCcsXG4gICAgbGluZUhlaWdodCAgICAgOiB2aWV3ZXIuZ2V0Q2hhckhlaWdodCgpICsgJ3B4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHJlY29yZC5hbm5vdGF0aW9uLmNvbG9yLFxuICB9KTtcbiAgZS5lbC5pbm5lclRleHQgPSByZWNvcmQuYW5ub3RhdGlvbi5uYW1lO1xuICByb3dFbC5hcHBlbmRDaGlsZChlKTtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL3ZpZXdlci9yb3ctdHlwZXMvYW5ub3RhdGlvbi1yb3cuanNcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLy4uL25vZGVfbW9kdWxlcy9hdXRvcHJlZml4ZXItbG9hZGVyL2luZGV4LmpzIS4vdmlld2VyLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi9ub2RlX21vZHVsZXMvYXV0b3ByZWZpeGVyLWxvYWRlci9pbmRleC5qcyEuL3ZpZXdlci5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi9ub2RlX21vZHVsZXMvYXV0b3ByZWZpeGVyLWxvYWRlci9pbmRleC5qcyEuL3ZpZXdlci5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zdHlsZXMvdmlld2VyLmNzc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qIHN1cHBsaWVzIGNvcnJlY3QgZm9udCBmYW1pbHkgZm9yIGZpeGVkIHBpdGNoIG1vbm9zcGFjZSBzZXF1ZW5jZSB0ZXh0IGV0YyovXFxuLnJvYm90byB7XFxuICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xcbn1cXG5cXG4vKiBpZiB5b3Ugd2FudCBmaXhlZCBwaXRjaCBmb250IHdpdGggbm8gbXlzdGVyeSBtZWF0IGluIHRoZSBrZXJuaW5nIGV0YyB0aGlzIGlzIGEgZ29vZCBzdGFydGluZyBwb2ludCovXFxuLyogd2VicGFjayBpbmNsdWRlZCBkaXJlY3RseSAqL1xcbi5maXhlZCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDA7XFxuICAtd2Via2l0LWZvbnQta2VybmluZzogbm9uZTtcXG4gICAgICAgICAgZm9udC1rZXJuaW5nOiBub25lO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxuLmZvbnQtc2l6ZSB7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcblxcbi5pbmxpbmUtYmxvY2sge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG5cXG4vKiBzdGF0dXMgYmFyIGJlbG93IEROQSBpbiBzZXF1ZW5jZSB2aWV3ZXIgKi9cXG4udmlld2VyLXN0YXR1cy1iYXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMnJlbTtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5O1xcbn1cXG5cXG4udmlld2VyLXN0YXR1cy1iYXIgc3BhbiB7XFxuICBjb2xvcjogZ3JheTtcXG4gIG1hcmdpbi1sZWZ0OiAxcmVtO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcblxcbi52aWV3ZXItc3RhdHVzLWJhciBpbnB1dCB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgbWFyZ2luLWxlZnQ6IDFyZW07XFxuICB3aWR0aDogNnJlbTtcXG59XFxuXFxuLyogdGhlIHZpZXdlciBpdHNlbGYgKi9cXG4udmlld2VyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDJyZW0pO1xcbiAgbWFyZ2luOiAwIDFyZW0gMCAxcmVtO1xcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAycmVtKTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi8qIGNvbnRhaW5zIHRoZSBhY3R1YWwgcm93c0NvbnRhaW5lciB3aXRoIHRoZSBjb250ZW50ICovXFxuLnJvd3Mge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5yb3ctZWxlbWVudCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcblxcbi8qIHVzZXIgaW50ZXJmYWNlIGxheWVyICovXFxuLnVzZXJpbnRlcmZhY2Uge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi51c2VyaW50ZXJmYWNlIC5zZWxlY3Rpb24tYm94IHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDUxLCAxNTMsIDI1NSwgMC4xKTtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuLnVzZXJpbnRlcmZhY2UgLmxlZnQtZWRnZSB7XFxuICBib3JkZXItbGVmdDogMnB4IHNvbGlkIGRvZGdlcmJsdWU7XFxufVxcblxcbi51c2VyaW50ZXJmYWNlIC5yaWdodC1lZGdlIHtcXG4gIGJvcmRlci1yaWdodDogMnB4IHNvbGlkIGRvZGdlcmJsdWU7XFxufVxcblxcbi8qIHN0eWxlIGZvciBzZXF1ZW5jZSB0ZXQgKi9cXG4uc2VxdWVuY2UtdGV4dCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgd2hpdGUtc3BhY2U6IHByZTtcXG59XFxuXFxuLnNlcXVlbmNlLXRleHQtcmV2ZXJzZSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgY29sb3I6IGxpZ2h0Z3JheTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7XFxufVxcblxcbi5zZXF1ZW5jZS10ZXh0LW1hcmtlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgY29sb3I6IGxpZ2h0Z3JheTtcXG59XFxuXFxuLyogc3R5bGUgZm9yIGNvbG9yZWQgYmxvY2sgdGhhdCBjb250YWlucyB0aGUgYmxvY2sgbmFtZSAqL1xcbi5zZXF1ZW5jZS1uYW1lIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiBibGFjaztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBib3JkZXItbGVmdDogMXB4IHNvbGlkIHdoaXRlO1xcbn1cXG5cXG4uc2VxdWVuY2UtcnVsZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCBsaWdodGdyYXk7XFxufVxcblxcbi5zZXF1ZW5jZS1ydWxlciAudGljayB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgdG9wOiAwcHg7XFxuICB3aWR0aDogMXB4O1xcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBsaWdodGdyYXk7XFxufVxcblxcbi5zZXF1ZW5jZS1ydWxlciAubnVtYmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGNvbG9yOiBsaWdodGdyYXk7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5hbm5vdGF0aW9uIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiBkaW1ncmF5O1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIGJvcmRlci1sZWZ0OiAxcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5jdXJzb3Ige1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDFweCBzb2xpZCBvcmFuZ2U7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4uc3YtbW91c2VMYXllciB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyIS4vfi9hdXRvcHJlZml4ZXItbG9hZGVyIS4vc3R5bGVzL3ZpZXdlci5jc3NcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbi8qKlxuICogaW50ZXJuYWxseSB0aGUgc2VxdWVuY2Ugdmlld2VyIHVzZXMgYSB3cmFwcGVyIGNsYXNzIGZvciBhbm5vdGF0aW9ucyB0byBvdmVyY29tZSBjZXJ0YWluIGxpbWl0YXRpb25zIGUuZy5cbiAqIHRoZXkgaGF2ZSBubyBpZCwgc3RhcnQvZW5kIGFyZSByZWxhdGl2ZSB0byB0aGUgYmxvY2sgZXRjLiBUaGUgdmlld2VyIGFubm90YXRpb25zIGFyZSBub3QgY29uc3RyYWluZWQgdG8gYmxvY2tzLlxuICogTmF0aXZlIG9iamVjdCBsb29rcyBzb21ldGhpbmcgbGlrZSB0aGlzOlxuXG4ge1xuICBcInRhZ3NcIjoge30sXG4gIFwibmFtZVwiOiBcInRyYW5zcG9zYXNlXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJcIixcbiAgXCJjb2xvclwiOiBcIiM4RUM3OERcIixcbiAgXCJyb2xlXCI6IFwiY2RzXCIsXG4gIFwic2VxdWVuY2VcIjogXCJcIixcbiAgXCJzdGFydFwiOiAwLFxuICBcImVuZFwiOiAyNzUsXG4gIFwiaXNGb3J3YXJkXCI6IGZhbHNlLFxuICBcIm5vdGVzXCI6IHtcbiAgICBcImdlbmJhbmtcIjoge1xuICAgICAgXCJsb2N1c190YWdcIjogXCJWVDUyX1JTMzUzNzBcIixcbiAgICAgIFwiaW5mZXJlbmNlXCI6IFwiRVhJU1RFTkNFOiBzaW1pbGFyIHRvIEFBIHNlcXVlbmNlOlJlZlNlcTpXUF8wMTk4ODk2MTguMVwiLFxuICAgICAgXCJvbGRfbG9jdXNfdGFnXCI6IFwiVlQ1Ml8zNTM2NVwiLFxuICAgICAgXCJjb2Rvbl9zdGFydFwiOiBcIjFcIixcbiAgICAgIFwicHNldWRvXCI6IFwiXCIsXG4gICAgICBcInByb2R1Y3RcIjogXCJ0cmFuc3Bvc2FzZVwiLFxuICAgICAgXCJ0cmFuc2xfdGFibGVcIjogXCIxMVwiLFxuICAgICAgXCJub3RlXCI6IFwiaW5jb21wbGV0ZTsgdG9vIHNob3J0IHBhcnRpYWwgYWJ1dHRpbmcgYXNzZW1ibHkgZ2FwOyBtaXNzaW5nIHN0b3A7IERlcml2ZWQgYnkgYXV0b21hdGVkIGNvbXB1dGF0aW9uYWwgYW5hbHlzaXMgdXNpbmcgZ2VuZSBwcmVkaWN0aW9uIG1ldGhvZDogUHJvdGVpbiBIb21vbG9neS5cIixcbiAgICAgIFwidHlwZVwiOiBcIkNEU1wiXG4gICAgfVxuICB9XG59XCJcblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihhbm5vdGF0aW9uLCBibG9jaykge1xuICAgIHRoaXMuaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5uYW1lID0gYW5ub3RhdGlvbi5uYW1lO1xuICAgIHRoaXMuY29sb3IgPSBhbm5vdGF0aW9uLmNvbG9yIHx8ICdsaWdodGdyYXknO1xuICAgIC8vIHNhdmUgcmVmZXJlbmNlIHRvIGJsb2NrIGZyb20gd2hlbmNlIHdlIGNhbWVcbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3VyIG5hdGl2ZSBhbm5vdGF0aW9uXG4gICAgdGhpcy5uYXRpdmVBbm5vdGF0aW9uID0gYW5ub3RhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBvdXIgYmxvY2sgc3RhcnQvZW5kL2xlbmd0aCBpcyBvbmx5IGNhbGN1bGF0ZWQgb25jZSB3ZSBhcmUgYWRkZWQgdG8gdGhlIHZpZXdlclxuICAgKiBhbmQgdGhlIGdsb2JhbCBwb3NpdGlvbiBvZiBvdXIgcGFyZW50IGJsb2NrIGlzIGtub3duICggc2luY2UgdGhlIG5hdGl2ZSBhbm5vdGF0aW9uXG4gICAqIHN0YXJ0IGFuZCBlbmQgYXJlIHJlbGF0aXZlIHRvIHRoYXQgYmxvY2sgKVxuICAgKiBAcGFyYW0gdmlld2VyXG4gICAqL1xuICBzZXRTdGFydEVuZCh2aWV3ZXIpIHtcbiAgICAvLyB3ZSBhc3N1bWUgYmxvY2tzIGhhdmUgYWxyZWFkeSBiZWVuIG1hcHBlZCB0byBjb2x1bW5zIGFuZCByb3dzIGFuZCB0aGF0IHRoZSBpbmZvcm1hdGlvblxuICAgIC8vIGlzIGF2YWlsYWJsZSBvbiB0aGUgdmlld2VyIG9iamVjdFxuICAgIGNvbnN0IGJsb2NrSW5mbyA9IHZpZXdlci5ibG9ja1Jvd01hcFt0aGlzLmJsb2NrLmlkXTtcbiAgICAvLyBzb21lIGFubm90YXRpb25zIGFyZSBhcHBsaWVkIHRvIHRoZSBjb25zdHJ1Y3QuIFRoZSBjb25zdHJ1Y3QgYmxvY2sgaXMgbm90XG4gICAgLy8gcGFydCBvZiB0aGUgbGlzdCBvZiBibG9ja3MgdGhlIHZpZXdlciBpcyBkaXNwbGF5aW5nLiBGb3IgdGhvc2Ugd2UgYXNzdW1lXG4gICAgLy8gdGhlIHN0YXJ0IGFuZCBlbmQgYXJlIHJlbGF0aXZlIHRvIHRoZSBlbnRpcmUgc2VxdWVuY2VcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG4gICAgaWYgKGJsb2NrSW5mbykge1xuICAgICAgc3RhcnRJbmRleCA9IGJsb2NrSW5mby5zdGFydFJvdyAqIHZpZXdlci5yb3dMZW5ndGggKyBibG9ja0luZm8uc3RhcnRSb3dPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGludmFyaWFudCh2aWV3ZXIuYXBwU3RhdGUuYmxvY2tzW3RoaXMuYmxvY2suaWRdLCdleHBlY3RlZCBibG9jayB0byBiZSB0aGUgYXBwIHN0YXRlIGF0IGxlYXN0Jyk7XG4gICAgfVxuICAgIC8vIG5vdyB3ZSBzZXQgdGhlIGdsb2JhbCBzdGFydCAvIGVuZCBvZiB0aGlzIGFubm90YXRpb25cbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5uYXRpdmVBbm5vdGF0aW9uLnN0YXJ0ICsgc3RhcnRJbmRleDtcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMubmF0aXZlQW5ub3RhdGlvbi5lbmQgLSB0aGlzLm5hdGl2ZUFubm90YXRpb24uc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0ICsgdGhpcy5sZW5ndGggLSAxO1xuICB9XG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2phdmFzY3JpcHRzL3ZpZXdlci9hbm5vdGF0aW9uLmpzXG4gKiovIiwiLy8gICAgIHV1aWQuanNcbi8vXG4vLyAgICAgQ29weXJpZ2h0IChjKSAyMDEwLTIwMTIgUm9iZXJ0IEtpZWZmZXJcbi8vICAgICBNSVQgTGljZW5zZSAtIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblxuLypnbG9iYWwgd2luZG93LCByZXF1aXJlLCBkZWZpbmUgKi9cbihmdW5jdGlvbihfd2luZG93KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuICAvLyBkZXRlY3QgdG8gZGV0ZXJtaW5lIHRoZSBiZXN0IFJORyBzb3VyY2UsIG5vcm1hbGl6aW5nIHRvIGEgZnVuY3Rpb24gdGhhdFxuICAvLyByZXR1cm5zIDEyOC1iaXRzIG9mIHJhbmRvbW5lc3MsIHNpbmNlIHRoYXQncyB3aGF0J3MgdXN1YWxseSByZXF1aXJlZFxuICB2YXIgX3JuZywgX21hdGhSTkcsIF9ub2RlUk5HLCBfd2hhdHdnUk5HLCBfcHJldmlvdXNSb290O1xuXG4gIGZ1bmN0aW9uIHNldHVwQnJvd3NlcigpIHtcbiAgICAvLyBBbGxvdyBmb3IgTVNJRTExIG1zQ3J5cHRvXG4gICAgdmFyIF9jcnlwdG8gPSBfd2luZG93LmNyeXB0byB8fCBfd2luZG93Lm1zQ3J5cHRvO1xuXG4gICAgaWYgKCFfcm5nICYmIF9jcnlwdG8gJiYgX2NyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAgICAgLy9cbiAgICAgIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgICAgICBfd2hhdHdnUk5HID0gX3JuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICAgICAgICBfY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgICAgICAgIHJldHVybiBfcm5kczg7XG4gICAgICAgIH07XG4gICAgICAgIF9ybmcoKTtcbiAgICAgIH0gY2F0Y2goZSkge31cbiAgICB9XG5cbiAgICBpZiAoIV9ybmcpIHtcbiAgICAgIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgICAgIC8vXG4gICAgICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAgICAgLy8gcXVhbGl0eS5cbiAgICAgIHZhciAgX3JuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICAgICAgX21hdGhSTkcgPSBfcm5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSB7IHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7IH1cbiAgICAgICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfcm5kcztcbiAgICAgIH07XG4gICAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbU0VDVVJJVFldIG5vZGUtdXVpZDogY3J5cHRvIG5vdCB1c2FibGUsIGZhbGxpbmcgYmFjayB0byBpbnNlY3VyZSBNYXRoLnJhbmRvbSgpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwTm9kZSgpIHtcbiAgICAvLyBOb2RlLmpzIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vbm9kZWpzLm9yZy9kb2NzL3YwLjYuMi9hcGkvY3J5cHRvLmh0bWxcbiAgICAvL1xuICAgIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiByZXF1aXJlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX3JiID0gcmVxdWlyZSgnY3J5cHRvJykucmFuZG9tQnl0ZXM7XG4gICAgICAgIF9ub2RlUk5HID0gX3JuZyA9IF9yYiAmJiBmdW5jdGlvbigpIHtyZXR1cm4gX3JiKDE2KTt9O1xuICAgICAgICBfcm5nKCk7XG4gICAgICB9IGNhdGNoKGUpIHt9XG4gICAgfVxuICB9XG5cbiAgaWYgKF93aW5kb3cpIHtcbiAgICBzZXR1cEJyb3dzZXIoKTtcbiAgfSBlbHNlIHtcbiAgICBzZXR1cE5vZGUoKTtcbiAgfVxuXG4gIC8vIEJ1ZmZlciBjbGFzcyB0byB1c2VcbiAgdmFyIEJ1ZmZlckNsYXNzID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiBCdWZmZXIpID8gQnVmZmVyIDogQXJyYXk7XG5cbiAgLy8gTWFwcyBmb3IgbnVtYmVyIDwtPiBoZXggc3RyaW5nIGNvbnZlcnNpb25cbiAgdmFyIF9ieXRlVG9IZXggPSBbXTtcbiAgdmFyIF9oZXhUb0J5dGUgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgIF9ieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xuICAgIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xuICB9XG5cbiAgLy8gKipgcGFyc2UoKWAgLSBQYXJzZSBhIFVVSUQgaW50byBpdCdzIGNvbXBvbmVudCBieXRlcyoqXG4gIGZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSAoYnVmICYmIG9mZnNldCkgfHwgMCwgaWkgPSAwO1xuXG4gICAgYnVmID0gYnVmIHx8IFtdO1xuICAgIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICAgIGlmIChpaSA8IDE2KSB7IC8vIERvbid0IG92ZXJmbG93IVxuICAgICAgICBidWZbaSArIGlpKytdID0gX2hleFRvQnl0ZVtvY3RdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWmVybyBvdXQgcmVtYWluaW5nIGJ5dGVzIGlmIHN0cmluZyB3YXMgc2hvcnRcbiAgICB3aGlsZSAoaWkgPCAxNikge1xuICAgICAgYnVmW2kgKyBpaSsrXSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIC8vICoqYHVucGFyc2UoKWAgLSBDb252ZXJ0IFVVSUQgYnl0ZSBhcnJheSAoYWxhIHBhcnNlKCkpIGludG8gYSBzdHJpbmcqKlxuICBmdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBvZmZzZXQgfHwgMCwgYnRoID0gX2J5dGVUb0hleDtcbiAgICByZXR1cm4gIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xuICB9XG5cbiAgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuICAvL1xuICAvLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuICAvLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG4gIC8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG4gIHZhciBfc2VlZEJ5dGVzID0gX3JuZygpO1xuXG4gIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICB2YXIgX25vZGVJZCA9IFtcbiAgICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG4gIF07XG5cbiAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgdmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuICAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbiAgdmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gICAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBjbG9ja3NlcSA9IChvcHRpb25zLmNsb2Nrc2VxICE9IG51bGwpID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTtcblxuICAgIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gICAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICAgIHZhciBtc2VjcyA9IChvcHRpb25zLm1zZWNzICE9IG51bGwpID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAgIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gICAgdmFyIG5zZWNzID0gKG9wdGlvbnMubnNlY3MgIT0gbnVsbCkgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gICAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAgIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgICAvLyB0aW1lIGludGVydmFsXG4gICAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09IG51bGwpIHtcbiAgICAgIG5zZWNzID0gMDtcbiAgICB9XG5cbiAgICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gICAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgICB9XG5cbiAgICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gICAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICAgIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gICAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gICAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgICAvLyBgdGltZV9sb3dgXG4gICAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICAgIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfbWlkYFxuICAgIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICAgIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAgIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAgIC8vIGBjbG9ja19zZXFfbG93YFxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAgIC8vIGBub2RlYFxuICAgIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyBuKyspIHtcbiAgICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmID8gYnVmIDogdW5wYXJzZShiKTtcbiAgfVxuXG4gIC8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbiAgZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgICBpZiAodHlwZW9mKG9wdGlvbnMpID09PSAnc3RyaW5nJykge1xuICAgICAgYnVmID0gKG9wdGlvbnMgPT09ICdiaW5hcnknKSA/IG5ldyBCdWZmZXJDbGFzcygxNikgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAgIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gICAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gICAgaWYgKGJ1Zikge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xuICB9XG5cbiAgLy8gRXhwb3J0IHB1YmxpYyBBUElcbiAgdmFyIHV1aWQgPSB2NDtcbiAgdXVpZC52MSA9IHYxO1xuICB1dWlkLnY0ID0gdjQ7XG4gIHV1aWQucGFyc2UgPSBwYXJzZTtcbiAgdXVpZC51bnBhcnNlID0gdW5wYXJzZTtcbiAgdXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuICB1dWlkLl9ybmcgPSBfcm5nO1xuICB1dWlkLl9tYXRoUk5HID0gX21hdGhSTkc7XG4gIHV1aWQuX25vZGVSTkcgPSBfbm9kZVJORztcbiAgdXVpZC5fd2hhdHdnUk5HID0gX3doYXR3Z1JORztcblxuICBpZiAoKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlKSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIFB1Ymxpc2ggYXMgbm9kZS5qcyBtb2R1bGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gUHVibGlzaCBhcyBBTUQgbW9kdWxlXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiB1dWlkO30pO1xuXG5cbiAgfSBlbHNlIHtcbiAgICAvLyBQdWJsaXNoIGFzIGdsb2JhbCAoaW4gYnJvd3NlcnMpXG4gICAgX3ByZXZpb3VzUm9vdCA9IF93aW5kb3cudXVpZDtcblxuICAgIC8vICoqYG5vQ29uZmxpY3QoKWAgLSAoYnJvd3NlciBvbmx5KSB0byByZXNldCBnbG9iYWwgJ3V1aWQnIHZhcioqXG4gICAgdXVpZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfd2luZG93LnV1aWQgPSBfcHJldmlvdXNSb290O1xuICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgfTtcblxuICAgIF93aW5kb3cudXVpZCA9IHV1aWQ7XG4gIH1cbn0pKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd2luZG93ID8gd2luZG93IDogbnVsbCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9ub2RlLXV1aWQvdXVpZC5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbnZhciByb290UGFyZW50ID0ge31cblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBTYWZhcmkgNS03IGxhY2tzIHN1cHBvcnQgZm9yIGNoYW5naW5nIHRoZSBgT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvcmAgcHJvcGVydHlcbiAqICAgICBvbiBvYmplY3RzLlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgZnVuY3Rpb24gQmFyICgpIHt9XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICBhcnIuY29uc3RydWN0b3IgPSBCYXJcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICBhcnIuY29uc3RydWN0b3IgPT09IEJhciAmJiAvLyBjb25zdHJ1Y3RvciBjYW4gYmUgc2V0XG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKGFyZykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIC8vIEF2b2lkIGdvaW5nIHRocm91Z2ggYW4gQXJndW1lbnRzQWRhcHRvclRyYW1wb2xpbmUgaW4gdGhlIGNvbW1vbiBjYXNlLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBhcmd1bWVudHNbMV0pXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnKVxuICB9XG5cbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXMubGVuZ3RoID0gMFxuICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZyb21OdW1iZXIodGhpcywgYXJnKVxuICB9XG5cbiAgLy8gU2xpZ2h0bHkgbGVzcyBjb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhpcywgYXJnLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6ICd1dGY4JylcbiAgfVxuXG4gIC8vIFVudXN1YWwuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoaXMsIGFyZylcbn1cblxuZnVuY3Rpb24gZnJvbU51bWJlciAodGhhdCwgbGVuZ3RoKSB7XG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGggPCAwID8gMCA6IGNoZWNrZWQobGVuZ3RoKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykgZW5jb2RpbmcgPSAndXRmOCdcblxuICAvLyBBc3N1bXB0aW9uOiBieXRlTGVuZ3RoKCkgcmV0dXJuIHZhbHVlIGlzIGFsd2F5cyA8IGtNYXhMZW5ndGguXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqZWN0KSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqZWN0KSkgcmV0dXJuIGZyb21CdWZmZXIodGhhdCwgb2JqZWN0KVxuXG4gIGlmIChpc0FycmF5KG9iamVjdCkpIHJldHVybiBmcm9tQXJyYXkodGhhdCwgb2JqZWN0KVxuXG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3RhcnQgd2l0aCBudW1iZXIsIGJ1ZmZlciwgYXJyYXkgb3Igc3RyaW5nJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKG9iamVjdC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21UeXBlZEFycmF5KHRoYXQsIG9iamVjdClcbiAgICB9XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIG9iamVjdClcbiAgICB9XG4gIH1cblxuICBpZiAob2JqZWN0Lmxlbmd0aCkgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqZWN0KVxuXG4gIHJldHVybiBmcm9tSnNvbk9iamVjdCh0aGF0LCBvYmplY3QpXG59XG5cbmZ1bmN0aW9uIGZyb21CdWZmZXIgKHRoYXQsIGJ1ZmZlcikge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChidWZmZXIubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgYnVmZmVyLmNvcHkodGhhdCwgMCwgMCwgbGVuZ3RoKVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXkgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vLyBEdXBsaWNhdGUgb2YgZnJvbUFycmF5KCkgdG8ga2VlcCBmcm9tQXJyYXkoKSBtb25vbW9ycGhpYy5cbmZ1bmN0aW9uIGZyb21UeXBlZEFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICAvLyBUcnVuY2F0aW5nIHRoZSBlbGVtZW50cyBpcyBwcm9iYWJseSBub3Qgd2hhdCBwZW9wbGUgZXhwZWN0IGZyb20gdHlwZWRcbiAgLy8gYXJyYXlzIHdpdGggQllURVNfUEVSX0VMRU1FTlQgPiAxIGJ1dCBpdCdzIGNvbXBhdGlibGUgd2l0aCB0aGUgYmVoYXZpb3JcbiAgLy8gb2YgdGhlIG9sZCBCdWZmZXIgY29uc3RydWN0b3IuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5KSB7XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGFycmF5LmJ5dGVMZW5ndGhcbiAgICB0aGF0ID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGFycmF5KSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21UeXBlZEFycmF5KHRoYXQsIG5ldyBVaW50OEFycmF5KGFycmF5KSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRGVzZXJpYWxpemUgeyB0eXBlOiAnQnVmZmVyJywgZGF0YTogWzEsMiwzLC4uLl0gfSBpbnRvIGEgQnVmZmVyIG9iamVjdC5cbi8vIFJldHVybnMgYSB6ZXJvLWxlbmd0aCBidWZmZXIgZm9yIGlucHV0cyB0aGF0IGRvbid0IGNvbmZvcm0gdG8gdGhlIHNwZWMuXG5mdW5jdGlvbiBmcm9tSnNvbk9iamVjdCAodGhhdCwgb2JqZWN0KSB7XG4gIHZhciBhcnJheVxuICB2YXIgbGVuZ3RoID0gMFxuXG4gIGlmIChvYmplY3QudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmplY3QuZGF0YSkpIHtcbiAgICBhcnJheSA9IG9iamVjdC5kYXRhXG4gICAgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB9XG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG59IGVsc2Uge1xuICAvLyBwcmUtc2V0IGZvciB2YWx1ZXMgdGhhdCBtYXkgZXhpc3QgaW4gdGhlIGZ1dHVyZVxuICBCdWZmZXIucHJvdG90eXBlLmxlbmd0aCA9IHVuZGVmaW5lZFxuICBCdWZmZXIucHJvdG90eXBlLnBhcmVudCA9IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBhbGxvY2F0ZSAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGF0Ll9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBmcm9tUG9vbCA9IGxlbmd0aCAhPT0gMCAmJiBsZW5ndGggPD0gQnVmZmVyLnBvb2xTaXplID4+PiAxXG4gIGlmIChmcm9tUG9vbCkgdGhhdC5wYXJlbnQgPSByb290UGFyZW50XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2xvd0J1ZmZlcikpIHJldHVybiBuZXcgU2xvd0J1ZmZlcihzdWJqZWN0LCBlbmNvZGluZylcblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZylcbiAgZGVsZXRlIGJ1Zi5wYXJlbnRcbiAgcmV0dXJuIGJ1ZlxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgdmFyIGkgPSAwXG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSBicmVha1xuXG4gICAgKytpXG4gIH1cblxuICBpZiAoaSAhPT0gbGVuKSB7XG4gICAgeCA9IGFbaV1cbiAgICB5ID0gYltpXVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdsaXN0IGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycy4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykgc3RyaW5nID0gJycgKyBzdHJpbmdcblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIC8vIERlcHJlY2F0ZWRcbiAgICAgIGNhc2UgJ3Jhdyc6XG4gICAgICBjYXNlICdyYXdzJzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICBzdGFydCA9IHN0YXJ0IHwgMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPT09IEluZmluaXR5ID8gdGhpcy5sZW5ndGggOiBlbmQgfCAwXG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcbiAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKGVuZCA8PSBzdGFydCkgcmV0dXJuICcnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiAwXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICBieXRlT2Zmc2V0ID4+PSAwXG5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVybiAtMVxuXG4gIC8vIE5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gTWF0aC5tYXgodGhpcy5sZW5ndGggKyBieXRlT2Zmc2V0LCAwKVxuXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSByZXR1cm4gLTEgLy8gc3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcgYWx3YXlzIGZhaWxzXG4gICAgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgfVxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgfVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgWyB2YWwgXSwgYnl0ZU9mZnNldClcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yICh2YXIgaSA9IDA7IGJ5dGVPZmZzZXQgKyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYXJyW2J5dGVPZmZzZXQgKyBpXSA9PT0gdmFsW2ZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4XSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbC5sZW5ndGgpIHJldHVybiBieXRlT2Zmc2V0ICsgZm91bmRJbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuLy8gYGdldGAgaXMgZGVwcmVjYXRlZFxuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgaXMgZGVwcmVjYXRlZFxuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQgKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aCB8IDBcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignYXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGJpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgaWYgKG5ld0J1Zi5sZW5ndGgpIG5ld0J1Zi5wYXJlbnQgPSB0aGlzLnBhcmVudCB8fCB0aGlzXG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdidWZmZXIgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ZhbHVlIGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpLCAwKVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpLCAwKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSB2YWx1ZSA8IDAgPyAxIDogMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRTdGFydClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICB0aGlzW2ldID0gdmFsdWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gdXRmOFRvQnl0ZXModmFsdWUudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gdG9BcnJheUJ1ZmZlciAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gX2F1Z21lbnQgKGFycikge1xuICBhcnIuY29uc3RydWN0b3IgPSBCdWZmZXJcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IHNldCBtZXRob2QgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuZXF1YWxzID0gQlAuZXF1YWxzXG4gIGFyci5jb21wYXJlID0gQlAuY29tcGFyZVxuICBhcnIuaW5kZXhPZiA9IEJQLmluZGV4T2ZcbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludExFID0gQlAucmVhZFVJbnRMRVxuICBhcnIucmVhZFVJbnRCRSA9IEJQLnJlYWRVSW50QkVcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50TEUgPSBCUC5yZWFkSW50TEVcbiAgYXJyLnJlYWRJbnRCRSA9IEJQLnJlYWRJbnRCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnRMRSA9IEJQLndyaXRlVUludExFXG4gIGFyci53cml0ZVVJbnRCRSA9IEJQLndyaXRlVUludEJFXG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnRMRSA9IEJQLndyaXRlSW50TEVcbiAgYXJyLndyaXRlSW50QkUgPSBCUC53cml0ZUludEJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2J1ZmZlci9+L2Jhc2U2NC1qcy9saWIvYjY0LmpzXG4gKiogbW9kdWxlIGlkID0gMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2J1ZmZlci9+L2llZWU3NTQvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vYnVmZmVyL34vaXNhcnJheS9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDMxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9ybmcnKVxuXG5mdW5jdGlvbiBlcnJvciAoKSB7XG4gIHZhciBtID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKVxuICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgIG0sXG4gICAgJ3dlIGFjY2VwdCBwdWxsIHJlcXVlc3RzJyxcbiAgICAnaHR0cDovL2dpdGh1Yi5jb20vZG9taW5pY3RhcnIvY3J5cHRvLWJyb3dzZXJpZnknXG4gICAgXS5qb2luKCdcXG4nKSlcbn1cblxuZXhwb3J0cy5jcmVhdGVIYXNoID0gcmVxdWlyZSgnLi9jcmVhdGUtaGFzaCcpXG5cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IHJlcXVpcmUoJy4vY3JlYXRlLWhtYWMnKVxuXG5leHBvcnRzLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oc2l6ZSwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQsIG5ldyBCdWZmZXIocm5nKHNpemUpKSlcbiAgICB9IGNhdGNoIChlcnIpIHsgY2FsbGJhY2soZXJyKSB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIocm5nKHNpemUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2goYSwgZikge1xuICBmb3IodmFyIGkgaW4gYSlcbiAgICBmKGFbaV0sIGkpXG59XG5cbmV4cG9ydHMuZ2V0SGFzaGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gWydzaGExJywgJ3NoYTI1NicsICdzaGE1MTInLCAnbWQ1JywgJ3JtZDE2MCddXG59XG5cbnZhciBwID0gcmVxdWlyZSgnLi9wYmtkZjInKShleHBvcnRzKVxuZXhwb3J0cy5wYmtkZjIgPSBwLnBia2RmMlxuZXhwb3J0cy5wYmtkZjJTeW5jID0gcC5wYmtkZjJTeW5jXG5cblxuLy8gdGhlIGxlYXN0IEkgY2FuIGRvIGlzIG1ha2UgZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSByZXN0IG9mIHRoZSBub2RlLmpzL2NyeXB0byBhcGkuXG5lYWNoKFsnY3JlYXRlQ3JlZGVudGlhbHMnXG4sICdjcmVhdGVDaXBoZXInXG4sICdjcmVhdGVDaXBoZXJpdidcbiwgJ2NyZWF0ZURlY2lwaGVyJ1xuLCAnY3JlYXRlRGVjaXBoZXJpdidcbiwgJ2NyZWF0ZVNpZ24nXG4sICdjcmVhdGVWZXJpZnknXG4sICdjcmVhdGVEaWZmaWVIZWxsbWFuJ1xuXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBlcnJvcignc29ycnksJywgbmFtZSwgJ2lzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKVxuICB9XG59KVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMzJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIGcgPSAoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB3aW5kb3cgPyBnbG9iYWwgOiB3aW5kb3cpIHx8IHt9XG4gIF9jcnlwdG8gPSAoXG4gICAgZy5jcnlwdG8gfHwgZy5tc0NyeXB0byB8fCByZXF1aXJlKCdjcnlwdG8nKVxuICApXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgIC8vIE1vZGVybiBCcm93c2Vyc1xuICAgIGlmKF9jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBuZXcgQnVmZmVyKHNpemUpOyAvL2luIGJyb3dzZXJpZnksIHRoaXMgaXMgYW4gZXh0ZW5kZWQgVWludDhBcnJheVxuICAgICAgLyogVGhpcyB3aWxsIG5vdCB3b3JrIGluIG9sZGVyIGJyb3dzZXJzLlxuICAgICAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlc1xuICAgICAgICovXG4gICAgXG4gICAgICBfY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKF9jcnlwdG8ucmFuZG9tQnl0ZXMpIHtcbiAgICAgIHJldHVybiBfY3J5cHRvLnJhbmRvbUJ5dGVzKHNpemUpXG4gICAgfVxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3NlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24gbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXJcXG4nK1xuICAgICAgICAndXNlIGNocm9tZSwgRmlyZUZveCBvciBJbnRlcm5ldCBFeHBsb3JlciAxMSdcbiAgICAgIClcbiAgfVxufSgpKVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L3JuZy5qc1xuICoqIG1vZHVsZSBpZCA9IDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiAoaWdub3JlZCkgKi9cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGNyeXB0byAoaWdub3JlZClcbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNyZWF0ZUhhc2ggPSByZXF1aXJlKCdzaGEuanMnKVxuXG52YXIgbWQ1ID0gdG9Db25zdHJ1Y3RvcihyZXF1aXJlKCcuL21kNScpKVxudmFyIHJtZDE2MCA9IHRvQ29uc3RydWN0b3IocmVxdWlyZSgncmlwZW1kMTYwJykpXG5cbmZ1bmN0aW9uIHRvQ29uc3RydWN0b3IgKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1ZmZlcnMgPSBbXVxuICAgIHZhciBtPSB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhLCBlbmMpIHtcbiAgICAgICAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSwgZW5jKVxuICAgICAgICBidWZmZXJzLnB1c2goZGF0YSlcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH0sXG4gICAgICBkaWdlc3Q6IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAgICAgdmFyIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycylcbiAgICAgICAgdmFyIHIgPSBmbihidWYpXG4gICAgICAgIGJ1ZmZlcnMgPSBudWxsXG4gICAgICAgIHJldHVybiBlbmMgPyByLnRvU3RyaW5nKGVuYykgOiByXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYWxnKSB7XG4gIGlmKCdtZDUnID09PSBhbGcpIHJldHVybiBuZXcgbWQ1KClcbiAgaWYoJ3JtZDE2MCcgPT09IGFsZykgcmV0dXJuIG5ldyBybWQxNjAoKVxuICByZXR1cm4gY3JlYXRlSGFzaChhbGcpXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvY3JlYXRlLWhhc2guanNcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhbGcpIHtcbiAgdmFyIEFsZyA9IGV4cG9ydHNbYWxnXVxuICBpZighQWxnKSB0aHJvdyBuZXcgRXJyb3IoYWxnICsgJyBpcyBub3Qgc3VwcG9ydGVkICh3ZSBhY2NlcHQgcHVsbCByZXF1ZXN0cyknKVxuICByZXR1cm4gbmV3IEFsZygpXG59XG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcbnZhciBIYXNoICAgPSByZXF1aXJlKCcuL2hhc2gnKShCdWZmZXIpXG5cbmV4cG9ydHMuc2hhMSA9IHJlcXVpcmUoJy4vc2hhMScpKEJ1ZmZlciwgSGFzaClcbmV4cG9ydHMuc2hhMjU2ID0gcmVxdWlyZSgnLi9zaGEyNTYnKShCdWZmZXIsIEhhc2gpXG5leHBvcnRzLnNoYTUxMiA9IHJlcXVpcmUoJy4vc2hhNTEyJykoQnVmZmVyLCBIYXNoKVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJ1ZmZlcikge1xuXG4gIC8vcHJvdG90eXBlIGNsYXNzIGZvciBoYXNoIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBIYXNoIChibG9ja1NpemUsIGZpbmFsU2l6ZSkge1xuICAgIHRoaXMuX2Jsb2NrID0gbmV3IEJ1ZmZlcihibG9ja1NpemUpIC8vbmV3IFVpbnQzMkFycmF5KGJsb2NrU2l6ZS80KVxuICAgIHRoaXMuX2ZpbmFsU2l6ZSA9IGZpbmFsU2l6ZVxuICAgIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxuICAgIHRoaXMuX2xlbiA9IDBcbiAgICB0aGlzLl9zID0gMFxuICB9XG5cbiAgSGFzaC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zID0gMFxuICAgIHRoaXMuX2xlbiA9IDBcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmMpIHtcbiAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGRhdGEpIHtcbiAgICAgIGVuYyA9IGVuYyB8fCBcInV0ZjhcIlxuICAgICAgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSwgZW5jKVxuICAgIH1cblxuICAgIHZhciBsID0gdGhpcy5fbGVuICs9IGRhdGEubGVuZ3RoXG4gICAgdmFyIHMgPSB0aGlzLl9zID0gKHRoaXMuX3MgfHwgMClcbiAgICB2YXIgZiA9IDBcbiAgICB2YXIgYnVmZmVyID0gdGhpcy5fYmxvY2tcblxuICAgIHdoaWxlIChzIDwgbCkge1xuICAgICAgdmFyIHQgPSBNYXRoLm1pbihkYXRhLmxlbmd0aCwgZiArIHRoaXMuX2Jsb2NrU2l6ZSAtIChzICUgdGhpcy5fYmxvY2tTaXplKSlcbiAgICAgIHZhciBjaCA9ICh0IC0gZilcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaDsgaSsrKSB7XG4gICAgICAgIGJ1ZmZlclsocyAlIHRoaXMuX2Jsb2NrU2l6ZSkgKyBpXSA9IGRhdGFbaSArIGZdXG4gICAgICB9XG5cbiAgICAgIHMgKz0gY2hcbiAgICAgIGYgKz0gY2hcblxuICAgICAgaWYgKChzICUgdGhpcy5fYmxvY2tTaXplKSA9PT0gMCkge1xuICAgICAgICB0aGlzLl91cGRhdGUoYnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9zID0gc1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAvLyBTdXBwb3NlIHRoZSBsZW5ndGggb2YgdGhlIG1lc3NhZ2UgTSwgaW4gYml0cywgaXMgbFxuICAgIHZhciBsID0gdGhpcy5fbGVuICogOFxuXG4gICAgLy8gQXBwZW5kIHRoZSBiaXQgMSB0byB0aGUgZW5kIG9mIHRoZSBtZXNzYWdlXG4gICAgdGhpcy5fYmxvY2tbdGhpcy5fbGVuICUgdGhpcy5fYmxvY2tTaXplXSA9IDB4ODBcblxuICAgIC8vIGFuZCB0aGVuIGsgemVybyBiaXRzLCB3aGVyZSBrIGlzIHRoZSBzbWFsbGVzdCBub24tbmVnYXRpdmUgc29sdXRpb24gdG8gdGhlIGVxdWF0aW9uIChsICsgMSArIGspID09PSBmaW5hbFNpemUgbW9kIGJsb2NrU2l6ZVxuICAgIHRoaXMuX2Jsb2NrLmZpbGwoMCwgdGhpcy5fbGVuICUgdGhpcy5fYmxvY2tTaXplICsgMSlcblxuICAgIGlmIChsICUgKHRoaXMuX2Jsb2NrU2l6ZSAqIDgpID49IHRoaXMuX2ZpbmFsU2l6ZSAqIDgpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZSh0aGlzLl9ibG9jaylcbiAgICAgIHRoaXMuX2Jsb2NrLmZpbGwoMClcbiAgICB9XG5cbiAgICAvLyB0byB0aGlzIGFwcGVuZCB0aGUgYmxvY2sgd2hpY2ggaXMgZXF1YWwgdG8gdGhlIG51bWJlciBsIHdyaXR0ZW4gaW4gYmluYXJ5XG4gICAgLy8gVE9ETzogaGFuZGxlIGNhc2Ugd2hlcmUgbCBpcyA+IE1hdGgucG93KDIsIDI5KVxuICAgIHRoaXMuX2Jsb2NrLndyaXRlSW50MzJCRShsLCB0aGlzLl9ibG9ja1NpemUgLSA0KVxuXG4gICAgdmFyIGhhc2ggPSB0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spIHx8IHRoaXMuX2hhc2goKVxuXG4gICAgcmV0dXJuIGVuYyA/IGhhc2gudG9TdHJpbmcoZW5jKSA6IGhhc2hcbiAgfVxuXG4gIEhhc2gucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdfdXBkYXRlIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MnKVxuICB9XG5cbiAgcmV0dXJuIEhhc2hcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9oYXNoLmpzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgUFVCIDE4MC0xXG4gKiBWZXJzaW9uIDIuMWEgQ29weXJpZ2h0IFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDIuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ3V0aWwnKS5pbmhlcml0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCdWZmZXIsIEhhc2gpIHtcblxuICB2YXIgQSA9IDB8MFxuICB2YXIgQiA9IDR8MFxuICB2YXIgQyA9IDh8MFxuICB2YXIgRCA9IDEyfDBcbiAgdmFyIEUgPSAxNnwwXG5cbiAgdmFyIFcgPSBuZXcgKHR5cGVvZiBJbnQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IEFycmF5IDogSW50MzJBcnJheSkoODApXG5cbiAgdmFyIFBPT0wgPSBbXVxuXG4gIGZ1bmN0aW9uIFNoYTEgKCkge1xuICAgIGlmKFBPT0wubGVuZ3RoKVxuICAgICAgcmV0dXJuIFBPT0wucG9wKCkuaW5pdCgpXG5cbiAgICBpZighKHRoaXMgaW5zdGFuY2VvZiBTaGExKSkgcmV0dXJuIG5ldyBTaGExKClcbiAgICB0aGlzLl93ID0gV1xuICAgIEhhc2guY2FsbCh0aGlzLCAxNio0LCAxNCo0KVxuXG4gICAgdGhpcy5faCA9IG51bGxcbiAgICB0aGlzLmluaXQoKVxuICB9XG5cbiAgaW5oZXJpdHMoU2hhMSwgSGFzaClcblxuICBTaGExLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2EgPSAweDY3NDUyMzAxXG4gICAgdGhpcy5fYiA9IDB4ZWZjZGFiODlcbiAgICB0aGlzLl9jID0gMHg5OGJhZGNmZVxuICAgIHRoaXMuX2QgPSAweDEwMzI1NDc2XG4gICAgdGhpcy5fZSA9IDB4YzNkMmUxZjBcblxuICAgIEhhc2gucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBTaGExLnByb3RvdHlwZS5fUE9PTCA9IFBPT0xcbiAgU2hhMS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChYKSB7XG5cbiAgICB2YXIgYSwgYiwgYywgZCwgZSwgX2EsIF9iLCBfYywgX2QsIF9lXG5cbiAgICBhID0gX2EgPSB0aGlzLl9hXG4gICAgYiA9IF9iID0gdGhpcy5fYlxuICAgIGMgPSBfYyA9IHRoaXMuX2NcbiAgICBkID0gX2QgPSB0aGlzLl9kXG4gICAgZSA9IF9lID0gdGhpcy5fZVxuXG4gICAgdmFyIHcgPSB0aGlzLl93XG5cbiAgICBmb3IodmFyIGogPSAwOyBqIDwgODA7IGorKykge1xuICAgICAgdmFyIFcgPSB3W2pdID0gaiA8IDE2ID8gWC5yZWFkSW50MzJCRShqKjQpXG4gICAgICAgIDogcm9sKHdbaiAtIDNdIF4gd1tqIC0gIDhdIF4gd1tqIC0gMTRdIF4gd1tqIC0gMTZdLCAxKVxuXG4gICAgICB2YXIgdCA9IGFkZChcbiAgICAgICAgYWRkKHJvbChhLCA1KSwgc2hhMV9mdChqLCBiLCBjLCBkKSksXG4gICAgICAgIGFkZChhZGQoZSwgVyksIHNoYTFfa3QoaikpXG4gICAgICApXG5cbiAgICAgIGUgPSBkXG4gICAgICBkID0gY1xuICAgICAgYyA9IHJvbChiLCAzMClcbiAgICAgIGIgPSBhXG4gICAgICBhID0gdFxuICAgIH1cblxuICAgIHRoaXMuX2EgPSBhZGQoYSwgX2EpXG4gICAgdGhpcy5fYiA9IGFkZChiLCBfYilcbiAgICB0aGlzLl9jID0gYWRkKGMsIF9jKVxuICAgIHRoaXMuX2QgPSBhZGQoZCwgX2QpXG4gICAgdGhpcy5fZSA9IGFkZChlLCBfZSlcbiAgfVxuXG4gIFNoYTEucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKFBPT0wubGVuZ3RoIDwgMTAwKSBQT09MLnB1c2godGhpcylcbiAgICB2YXIgSCA9IG5ldyBCdWZmZXIoMjApXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLl9hfDAsIHRoaXMuX2J8MCwgdGhpcy5fY3wwLCB0aGlzLl9kfDAsIHRoaXMuX2V8MClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9hfDAsIEEpXG4gICAgSC53cml0ZUludDMyQkUodGhpcy5fYnwwLCBCKVxuICAgIEgud3JpdGVJbnQzMkJFKHRoaXMuX2N8MCwgQylcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9kfDAsIEQpXG4gICAgSC53cml0ZUludDMyQkUodGhpcy5fZXwwLCBFKVxuICAgIHJldHVybiBIXG4gIH1cblxuICAvKlxuICAgKiBQZXJmb3JtIHRoZSBhcHByb3ByaWF0ZSB0cmlwbGV0IGNvbWJpbmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgY3VycmVudFxuICAgKiBpdGVyYXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHNoYTFfZnQodCwgYiwgYywgZCkge1xuICAgIGlmKHQgPCAyMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICAgIGlmKHQgPCA0MCkgcmV0dXJuIGIgXiBjIF4gZDtcbiAgICBpZih0IDwgNjApIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgcmV0dXJuIGIgXiBjIF4gZDtcbiAgfVxuXG4gIC8qXG4gICAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gc2hhMV9rdCh0KSB7XG4gICAgcmV0dXJuICh0IDwgMjApID8gIDE1MTg1MDAyNDkgOiAodCA8IDQwKSA/ICAxODU5Nzc1MzkzIDpcbiAgICAgICAgICAgKHQgPCA2MCkgPyAtMTg5NDAwNzU4OCA6IC04OTk0OTc1MTQ7XG4gIH1cblxuICAvKlxuICAgKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gICAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gICAqIC8vZG9taW5pY3RhcnI6IHRoaXMgaXMgMTAgeWVhcnMgb2xkLCBzbyBtYXliZSB0aGlzIGNhbiBiZSBkcm9wcGVkPylcbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGFkZCh4LCB5KSB7XG4gICAgcmV0dXJuICh4ICsgeSApIHwgMFxuICAvL2xldHMgc2VlIGhvdyB0aGlzIGdvZXMgb24gdGVzdGxpbmcuXG4gIC8vICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICAvLyAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICAvLyAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG4gIH1cblxuICAvKlxuICAgKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gICAqL1xuICBmdW5jdGlvbiByb2wobnVtLCBjbnQpIHtcbiAgICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XG4gIH1cblxuICByZXR1cm4gU2hhMVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL3NoYTEuanNcbiAqKiBtb2R1bGUgaWQgPSAzOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDM5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA0MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4vKipcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMjU2LCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIDE4MC0yXG4gKiBWZXJzaW9uIDIuMi1iZXRhIENvcHlyaWdodCBBbmdlbCBNYXJpbiwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqXG4gKi9cblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgndXRpbCcpLmluaGVyaXRzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJ1ZmZlciwgSGFzaCkge1xuXG4gIHZhciBLID0gW1xuICAgICAgMHg0MjhBMkY5OCwgMHg3MTM3NDQ5MSwgMHhCNUMwRkJDRiwgMHhFOUI1REJBNSxcbiAgICAgIDB4Mzk1NkMyNUIsIDB4NTlGMTExRjEsIDB4OTIzRjgyQTQsIDB4QUIxQzVFRDUsXG4gICAgICAweEQ4MDdBQTk4LCAweDEyODM1QjAxLCAweDI0MzE4NUJFLCAweDU1MEM3REMzLFxuICAgICAgMHg3MkJFNUQ3NCwgMHg4MERFQjFGRSwgMHg5QkRDMDZBNywgMHhDMTlCRjE3NCxcbiAgICAgIDB4RTQ5QjY5QzEsIDB4RUZCRTQ3ODYsIDB4MEZDMTlEQzYsIDB4MjQwQ0ExQ0MsXG4gICAgICAweDJERTkyQzZGLCAweDRBNzQ4NEFBLCAweDVDQjBBOURDLCAweDc2Rjk4OERBLFxuICAgICAgMHg5ODNFNTE1MiwgMHhBODMxQzY2RCwgMHhCMDAzMjdDOCwgMHhCRjU5N0ZDNyxcbiAgICAgIDB4QzZFMDBCRjMsIDB4RDVBNzkxNDcsIDB4MDZDQTYzNTEsIDB4MTQyOTI5NjcsXG4gICAgICAweDI3QjcwQTg1LCAweDJFMUIyMTM4LCAweDREMkM2REZDLCAweDUzMzgwRDEzLFxuICAgICAgMHg2NTBBNzM1NCwgMHg3NjZBMEFCQiwgMHg4MUMyQzkyRSwgMHg5MjcyMkM4NSxcbiAgICAgIDB4QTJCRkU4QTEsIDB4QTgxQTY2NEIsIDB4QzI0QjhCNzAsIDB4Qzc2QzUxQTMsXG4gICAgICAweEQxOTJFODE5LCAweEQ2OTkwNjI0LCAweEY0MEUzNTg1LCAweDEwNkFBMDcwLFxuICAgICAgMHgxOUE0QzExNiwgMHgxRTM3NkMwOCwgMHgyNzQ4Nzc0QywgMHgzNEIwQkNCNSxcbiAgICAgIDB4MzkxQzBDQjMsIDB4NEVEOEFBNEEsIDB4NUI5Q0NBNEYsIDB4NjgyRTZGRjMsXG4gICAgICAweDc0OEY4MkVFLCAweDc4QTU2MzZGLCAweDg0Qzg3ODE0LCAweDhDQzcwMjA4LFxuICAgICAgMHg5MEJFRkZGQSwgMHhBNDUwNkNFQiwgMHhCRUY5QTNGNywgMHhDNjcxNzhGMlxuICAgIF1cblxuICB2YXIgVyA9IG5ldyBBcnJheSg2NClcblxuICBmdW5jdGlvbiBTaGEyNTYoKSB7XG4gICAgdGhpcy5pbml0KClcblxuICAgIHRoaXMuX3cgPSBXIC8vbmV3IEFycmF5KDY0KVxuXG4gICAgSGFzaC5jYWxsKHRoaXMsIDE2KjQsIDE0KjQpXG4gIH1cblxuICBpbmhlcml0cyhTaGEyNTYsIEhhc2gpXG5cbiAgU2hhMjU2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdGhpcy5fYSA9IDB4NmEwOWU2Njd8MFxuICAgIHRoaXMuX2IgPSAweGJiNjdhZTg1fDBcbiAgICB0aGlzLl9jID0gMHgzYzZlZjM3MnwwXG4gICAgdGhpcy5fZCA9IDB4YTU0ZmY1M2F8MFxuICAgIHRoaXMuX2UgPSAweDUxMGU1MjdmfDBcbiAgICB0aGlzLl9mID0gMHg5YjA1Njg4Y3wwXG4gICAgdGhpcy5fZyA9IDB4MWY4M2Q5YWJ8MFxuICAgIHRoaXMuX2ggPSAweDViZTBjZDE5fDBcblxuICAgIHRoaXMuX2xlbiA9IHRoaXMuX3MgPSAwXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZnVuY3Rpb24gUyAoWCwgbikge1xuICAgIHJldHVybiAoWCA+Pj4gbikgfCAoWCA8PCAoMzIgLSBuKSk7XG4gIH1cblxuICBmdW5jdGlvbiBSIChYLCBuKSB7XG4gICAgcmV0dXJuIChYID4+PiBuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENoICh4LCB5LCB6KSB7XG4gICAgcmV0dXJuICgoeCAmIHkpIF4gKCh+eCkgJiB6KSk7XG4gIH1cblxuICBmdW5jdGlvbiBNYWogKHgsIHksIHopIHtcbiAgICByZXR1cm4gKCh4ICYgeSkgXiAoeCAmIHopIF4gKHkgJiB6KSk7XG4gIH1cblxuICBmdW5jdGlvbiBTaWdtYTAyNTYgKHgpIHtcbiAgICByZXR1cm4gKFMoeCwgMikgXiBTKHgsIDEzKSBeIFMoeCwgMjIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNpZ21hMTI1NiAoeCkge1xuICAgIHJldHVybiAoUyh4LCA2KSBeIFMoeCwgMTEpIF4gUyh4LCAyNSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gR2FtbWEwMjU2ICh4KSB7XG4gICAgcmV0dXJuIChTKHgsIDcpIF4gUyh4LCAxOCkgXiBSKHgsIDMpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEdhbW1hMTI1NiAoeCkge1xuICAgIHJldHVybiAoUyh4LCAxNykgXiBTKHgsIDE5KSBeIFIoeCwgMTApKTtcbiAgfVxuXG4gIFNoYTI1Ni5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uKE0pIHtcblxuICAgIHZhciBXID0gdGhpcy5fd1xuICAgIHZhciBhLCBiLCBjLCBkLCBlLCBmLCBnLCBoXG4gICAgdmFyIFQxLCBUMlxuXG4gICAgYSA9IHRoaXMuX2EgfCAwXG4gICAgYiA9IHRoaXMuX2IgfCAwXG4gICAgYyA9IHRoaXMuX2MgfCAwXG4gICAgZCA9IHRoaXMuX2QgfCAwXG4gICAgZSA9IHRoaXMuX2UgfCAwXG4gICAgZiA9IHRoaXMuX2YgfCAwXG4gICAgZyA9IHRoaXMuX2cgfCAwXG4gICAgaCA9IHRoaXMuX2ggfCAwXG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyBqKyspIHtcbiAgICAgIHZhciB3ID0gV1tqXSA9IGogPCAxNlxuICAgICAgICA/IE0ucmVhZEludDMyQkUoaiAqIDQpXG4gICAgICAgIDogR2FtbWExMjU2KFdbaiAtIDJdKSArIFdbaiAtIDddICsgR2FtbWEwMjU2KFdbaiAtIDE1XSkgKyBXW2ogLSAxNl1cblxuICAgICAgVDEgPSBoICsgU2lnbWExMjU2KGUpICsgQ2goZSwgZiwgZykgKyBLW2pdICsgd1xuXG4gICAgICBUMiA9IFNpZ21hMDI1NihhKSArIE1haihhLCBiLCBjKTtcbiAgICAgIGggPSBnOyBnID0gZjsgZiA9IGU7IGUgPSBkICsgVDE7IGQgPSBjOyBjID0gYjsgYiA9IGE7IGEgPSBUMSArIFQyO1xuICAgIH1cblxuICAgIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxuICAgIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxuICAgIHRoaXMuX2MgPSAoYyArIHRoaXMuX2MpIHwgMFxuICAgIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxuICAgIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxuICAgIHRoaXMuX2YgPSAoZiArIHRoaXMuX2YpIHwgMFxuICAgIHRoaXMuX2cgPSAoZyArIHRoaXMuX2cpIHwgMFxuICAgIHRoaXMuX2ggPSAoaCArIHRoaXMuX2gpIHwgMFxuXG4gIH07XG5cbiAgU2hhMjU2LnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgSCA9IG5ldyBCdWZmZXIoMzIpXG5cbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9hLCAgMClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9iLCAgNClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9jLCAgOClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9kLCAxMilcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9lLCAxNilcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9mLCAyMClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9nLCAyNClcbiAgICBILndyaXRlSW50MzJCRSh0aGlzLl9oLCAyOClcblxuICAgIHJldHVybiBIXG4gIH1cblxuICByZXR1cm4gU2hhMjU2XG5cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9+L3NoYS5qcy9zaGEyNTYuanNcbiAqKiBtb2R1bGUgaWQgPSA0MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgndXRpbCcpLmluaGVyaXRzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJ1ZmZlciwgSGFzaCkge1xuICB2YXIgSyA9IFtcbiAgICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxuICAgIDB4YjVjMGZiY2YsIDB4ZWM0ZDNiMmYsIDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMsXG4gICAgMHgzOTU2YzI1YiwgMHhmMzQ4YjUzOCwgMHg1OWYxMTFmMSwgMHhiNjA1ZDAxOSxcbiAgICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxuICAgIDB4ZDgwN2FhOTgsIDB4YTMwMzAyNDIsIDB4MTI4MzViMDEsIDB4NDU3MDZmYmUsXG4gICAgMHgyNDMxODViZSwgMHg0ZWU0YjI4YywgMHg1NTBjN2RjMywgMHhkNWZmYjRlMixcbiAgICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxuICAgIDB4OWJkYzA2YTcsIDB4MjVjNzEyMzUsIDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQsXG4gICAgMHhlNDliNjljMSwgMHg5ZWYxNGFkMiwgMHhlZmJlNDc4NiwgMHgzODRmMjVlMyxcbiAgICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxuICAgIDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUsIDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMsXG4gICAgMHg1Y2IwYTlkYywgMHhiZDQxZmJkNCwgMHg3NmY5ODhkYSwgMHg4MzExNTNiNSxcbiAgICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxuICAgIDB4YjAwMzI3YzgsIDB4OThmYjIxM2YsIDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQsXG4gICAgMHhjNmUwMGJmMywgMHgzZGE4OGZjMiwgMHhkNWE3OTE0NywgMHg5MzBhYTcyNSxcbiAgICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxuICAgIDB4MjdiNzBhODUsIDB4NDZkMjJmZmMsIDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYsXG4gICAgMHg0ZDJjNmRmYywgMHg1YWM0MmFlZCwgMHg1MzM4MGQxMywgMHg5ZDk1YjNkZixcbiAgICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxuICAgIDB4ODFjMmM5MmUsIDB4NDdlZGFlZTYsIDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IsXG4gICAgMHhhMmJmZThhMSwgMHg0Y2YxMDM2NCwgMHhhODFhNjY0YiwgMHhiYzQyMzAwMSxcbiAgICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxuICAgIDB4ZDE5MmU4MTksIDB4ZDZlZjUyMTgsIDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTAsXG4gICAgMHhmNDBlMzU4NSwgMHg1NzcxMjAyYSwgMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCxcbiAgICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxuICAgIDB4Mjc0ODc3NGMsIDB4ZGY4ZWViOTksIDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgsXG4gICAgMHgzOTFjMGNiMywgMHhjNWM5NWE2MywgMHg0ZWQ4YWE0YSwgMHhlMzQxOGFjYixcbiAgICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxuICAgIDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMsIDB4NzhhNTYzNmYsIDB4NDMxNzJmNjAsXG4gICAgMHg4NGM4NzgxNCwgMHhhMWYwYWI3MiwgMHg4Y2M3MDIwOCwgMHgxYTY0MzllYyxcbiAgICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxuICAgIDB4YmVmOWEzZjcsIDB4YjJjNjc5MTUsIDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIsXG4gICAgMHhjYTI3M2VjZSwgMHhlYTI2NjE5YywgMHhkMTg2YjhjNywgMHgyMWMwYzIwNyxcbiAgICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxuICAgIDB4MDZmMDY3YWEsIDB4NzIxNzZmYmEsIDB4MGE2MzdkYzUsIDB4YTJjODk4YTYsXG4gICAgMHgxMTNmOTgwNCwgMHhiZWY5MGRhZSwgMHgxYjcxMGIzNSwgMHgxMzFjNDcxYixcbiAgICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxuICAgIDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMsIDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMsXG4gICAgMHg0Y2M1ZDRiZSwgMHhjYjNlNDJiNiwgMHg1OTdmMjk5YywgMHhmYzY1N2UyYSxcbiAgICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XG4gIF1cblxuICB2YXIgVyA9IG5ldyBBcnJheSgxNjApXG5cbiAgZnVuY3Rpb24gU2hhNTEyKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gICAgdGhpcy5fdyA9IFdcblxuICAgIEhhc2guY2FsbCh0aGlzLCAxMjgsIDExMilcbiAgfVxuXG4gIGluaGVyaXRzKFNoYTUxMiwgSGFzaClcblxuICBTaGE1MTIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB0aGlzLl9hID0gMHg2YTA5ZTY2N3wwXG4gICAgdGhpcy5fYiA9IDB4YmI2N2FlODV8MFxuICAgIHRoaXMuX2MgPSAweDNjNmVmMzcyfDBcbiAgICB0aGlzLl9kID0gMHhhNTRmZjUzYXwwXG4gICAgdGhpcy5fZSA9IDB4NTEwZTUyN2Z8MFxuICAgIHRoaXMuX2YgPSAweDliMDU2ODhjfDBcbiAgICB0aGlzLl9nID0gMHgxZjgzZDlhYnwwXG4gICAgdGhpcy5faCA9IDB4NWJlMGNkMTl8MFxuXG4gICAgdGhpcy5fYWwgPSAweGYzYmNjOTA4fDBcbiAgICB0aGlzLl9ibCA9IDB4ODRjYWE3M2J8MFxuICAgIHRoaXMuX2NsID0gMHhmZTk0ZjgyYnwwXG4gICAgdGhpcy5fZGwgPSAweDVmMWQzNmYxfDBcbiAgICB0aGlzLl9lbCA9IDB4YWRlNjgyZDF8MFxuICAgIHRoaXMuX2ZsID0gMHgyYjNlNmMxZnwwXG4gICAgdGhpcy5fZ2wgPSAweGZiNDFiZDZifDBcbiAgICB0aGlzLl9obCA9IDB4MTM3ZTIxNzl8MFxuXG4gICAgdGhpcy5fbGVuID0gdGhpcy5fcyA9IDBcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBTIChYLCBYbCwgbikge1xuICAgIHJldHVybiAoWCA+Pj4gbikgfCAoWGwgPDwgKDMyIC0gbikpXG4gIH1cblxuICBmdW5jdGlvbiBDaCAoeCwgeSwgeikge1xuICAgIHJldHVybiAoKHggJiB5KSBeICgofngpICYgeikpO1xuICB9XG5cbiAgZnVuY3Rpb24gTWFqICh4LCB5LCB6KSB7XG4gICAgcmV0dXJuICgoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeikpO1xuICB9XG5cbiAgU2hhNTEyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oTSkge1xuXG4gICAgdmFyIFcgPSB0aGlzLl93XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGhcbiAgICB2YXIgYWwsIGJsLCBjbCwgZGwsIGVsLCBmbCwgZ2wsIGhsXG5cbiAgICBhID0gdGhpcy5fYSB8IDBcbiAgICBiID0gdGhpcy5fYiB8IDBcbiAgICBjID0gdGhpcy5fYyB8IDBcbiAgICBkID0gdGhpcy5fZCB8IDBcbiAgICBlID0gdGhpcy5fZSB8IDBcbiAgICBmID0gdGhpcy5fZiB8IDBcbiAgICBnID0gdGhpcy5fZyB8IDBcbiAgICBoID0gdGhpcy5faCB8IDBcblxuICAgIGFsID0gdGhpcy5fYWwgfCAwXG4gICAgYmwgPSB0aGlzLl9ibCB8IDBcbiAgICBjbCA9IHRoaXMuX2NsIHwgMFxuICAgIGRsID0gdGhpcy5fZGwgfCAwXG4gICAgZWwgPSB0aGlzLl9lbCB8IDBcbiAgICBmbCA9IHRoaXMuX2ZsIHwgMFxuICAgIGdsID0gdGhpcy5fZ2wgfCAwXG4gICAgaGwgPSB0aGlzLl9obCB8IDBcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODA7IGkrKykge1xuICAgICAgdmFyIGogPSBpICogMlxuXG4gICAgICB2YXIgV2ksIFdpbFxuXG4gICAgICBpZiAoaSA8IDE2KSB7XG4gICAgICAgIFdpID0gV1tqXSA9IE0ucmVhZEludDMyQkUoaiAqIDQpXG4gICAgICAgIFdpbCA9IFdbaiArIDFdID0gTS5yZWFkSW50MzJCRShqICogNCArIDQpXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB4ICA9IFdbaiAtIDE1KjJdXG4gICAgICAgIHZhciB4bCA9IFdbaiAtIDE1KjIgKyAxXVxuICAgICAgICB2YXIgZ2FtbWEwICA9IFMoeCwgeGwsIDEpIF4gUyh4LCB4bCwgOCkgXiAoeCA+Pj4gNylcbiAgICAgICAgdmFyIGdhbW1hMGwgPSBTKHhsLCB4LCAxKSBeIFMoeGwsIHgsIDgpIF4gUyh4bCwgeCwgNylcblxuICAgICAgICB4ICA9IFdbaiAtIDIqMl1cbiAgICAgICAgeGwgPSBXW2ogLSAyKjIgKyAxXVxuICAgICAgICB2YXIgZ2FtbWExICA9IFMoeCwgeGwsIDE5KSBeIFMoeGwsIHgsIDI5KSBeICh4ID4+PiA2KVxuICAgICAgICB2YXIgZ2FtbWExbCA9IFMoeGwsIHgsIDE5KSBeIFMoeCwgeGwsIDI5KSBeIFMoeGwsIHgsIDYpXG5cbiAgICAgICAgLy8gV1tpXSA9IGdhbW1hMCArIFdbaSAtIDddICsgZ2FtbWExICsgV1tpIC0gMTZdXG4gICAgICAgIHZhciBXaTcgID0gV1tqIC0gNyoyXVxuICAgICAgICB2YXIgV2k3bCA9IFdbaiAtIDcqMiArIDFdXG5cbiAgICAgICAgdmFyIFdpMTYgID0gV1tqIC0gMTYqMl1cbiAgICAgICAgdmFyIFdpMTZsID0gV1tqIC0gMTYqMiArIDFdXG5cbiAgICAgICAgV2lsID0gZ2FtbWEwbCArIFdpN2xcbiAgICAgICAgV2kgID0gZ2FtbWEwICArIFdpNyArICgoV2lsID4+PiAwKSA8IChnYW1tYTBsID4+PiAwKSA/IDEgOiAwKVxuICAgICAgICBXaWwgPSBXaWwgKyBnYW1tYTFsXG4gICAgICAgIFdpICA9IFdpICArIGdhbW1hMSAgKyAoKFdpbCA+Pj4gMCkgPCAoZ2FtbWExbCA+Pj4gMCkgPyAxIDogMClcbiAgICAgICAgV2lsID0gV2lsICsgV2kxNmxcbiAgICAgICAgV2kgID0gV2kgICsgV2kxNiArICgoV2lsID4+PiAwKSA8IChXaTE2bCA+Pj4gMCkgPyAxIDogMClcblxuICAgICAgICBXW2pdID0gV2lcbiAgICAgICAgV1tqICsgMV0gPSBXaWxcbiAgICAgIH1cblxuICAgICAgdmFyIG1haiA9IE1haihhLCBiLCBjKVxuICAgICAgdmFyIG1hamwgPSBNYWooYWwsIGJsLCBjbClcblxuICAgICAgdmFyIHNpZ21hMGggPSBTKGEsIGFsLCAyOCkgXiBTKGFsLCBhLCAyKSBeIFMoYWwsIGEsIDcpXG4gICAgICB2YXIgc2lnbWEwbCA9IFMoYWwsIGEsIDI4KSBeIFMoYSwgYWwsIDIpIF4gUyhhLCBhbCwgNylcbiAgICAgIHZhciBzaWdtYTFoID0gUyhlLCBlbCwgMTQpIF4gUyhlLCBlbCwgMTgpIF4gUyhlbCwgZSwgOSlcbiAgICAgIHZhciBzaWdtYTFsID0gUyhlbCwgZSwgMTQpIF4gUyhlbCwgZSwgMTgpIF4gUyhlLCBlbCwgOSlcblxuICAgICAgLy8gdDEgPSBoICsgc2lnbWExICsgY2ggKyBLW2ldICsgV1tpXVxuICAgICAgdmFyIEtpID0gS1tqXVxuICAgICAgdmFyIEtpbCA9IEtbaiArIDFdXG5cbiAgICAgIHZhciBjaCA9IENoKGUsIGYsIGcpXG4gICAgICB2YXIgY2hsID0gQ2goZWwsIGZsLCBnbClcblxuICAgICAgdmFyIHQxbCA9IGhsICsgc2lnbWExbFxuICAgICAgdmFyIHQxID0gaCArIHNpZ21hMWggKyAoKHQxbCA+Pj4gMCkgPCAoaGwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBjaGxcbiAgICAgIHQxID0gdDEgKyBjaCArICgodDFsID4+PiAwKSA8IChjaGwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBLaWxcbiAgICAgIHQxID0gdDEgKyBLaSArICgodDFsID4+PiAwKSA8IChLaWwgPj4+IDApID8gMSA6IDApXG4gICAgICB0MWwgPSB0MWwgKyBXaWxcbiAgICAgIHQxID0gdDEgKyBXaSArICgodDFsID4+PiAwKSA8IChXaWwgPj4+IDApID8gMSA6IDApXG5cbiAgICAgIC8vIHQyID0gc2lnbWEwICsgbWFqXG4gICAgICB2YXIgdDJsID0gc2lnbWEwbCArIG1hamxcbiAgICAgIHZhciB0MiA9IHNpZ21hMGggKyBtYWogKyAoKHQybCA+Pj4gMCkgPCAoc2lnbWEwbCA+Pj4gMCkgPyAxIDogMClcblxuICAgICAgaCAgPSBnXG4gICAgICBobCA9IGdsXG4gICAgICBnICA9IGZcbiAgICAgIGdsID0gZmxcbiAgICAgIGYgID0gZVxuICAgICAgZmwgPSBlbFxuICAgICAgZWwgPSAoZGwgKyB0MWwpIHwgMFxuICAgICAgZSAgPSAoZCArIHQxICsgKChlbCA+Pj4gMCkgPCAoZGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICAgIGQgID0gY1xuICAgICAgZGwgPSBjbFxuICAgICAgYyAgPSBiXG4gICAgICBjbCA9IGJsXG4gICAgICBiICA9IGFcbiAgICAgIGJsID0gYWxcbiAgICAgIGFsID0gKHQxbCArIHQybCkgfCAwXG4gICAgICBhICA9ICh0MSArIHQyICsgKChhbCA+Pj4gMCkgPCAodDFsID4+PiAwKSA/IDEgOiAwKSkgfCAwXG4gICAgfVxuXG4gICAgdGhpcy5fYWwgPSAodGhpcy5fYWwgKyBhbCkgfCAwXG4gICAgdGhpcy5fYmwgPSAodGhpcy5fYmwgKyBibCkgfCAwXG4gICAgdGhpcy5fY2wgPSAodGhpcy5fY2wgKyBjbCkgfCAwXG4gICAgdGhpcy5fZGwgPSAodGhpcy5fZGwgKyBkbCkgfCAwXG4gICAgdGhpcy5fZWwgPSAodGhpcy5fZWwgKyBlbCkgfCAwXG4gICAgdGhpcy5fZmwgPSAodGhpcy5fZmwgKyBmbCkgfCAwXG4gICAgdGhpcy5fZ2wgPSAodGhpcy5fZ2wgKyBnbCkgfCAwXG4gICAgdGhpcy5faGwgPSAodGhpcy5faGwgKyBobCkgfCAwXG5cbiAgICB0aGlzLl9hID0gKHRoaXMuX2EgKyBhICsgKCh0aGlzLl9hbCA+Pj4gMCkgPCAoYWwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9iID0gKHRoaXMuX2IgKyBiICsgKCh0aGlzLl9ibCA+Pj4gMCkgPCAoYmwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9jID0gKHRoaXMuX2MgKyBjICsgKCh0aGlzLl9jbCA+Pj4gMCkgPCAoY2wgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9kID0gKHRoaXMuX2QgKyBkICsgKCh0aGlzLl9kbCA+Pj4gMCkgPCAoZGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9lID0gKHRoaXMuX2UgKyBlICsgKCh0aGlzLl9lbCA+Pj4gMCkgPCAoZWwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9mID0gKHRoaXMuX2YgKyBmICsgKCh0aGlzLl9mbCA+Pj4gMCkgPCAoZmwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9nID0gKHRoaXMuX2cgKyBnICsgKCh0aGlzLl9nbCA+Pj4gMCkgPCAoZ2wgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgICB0aGlzLl9oID0gKHRoaXMuX2ggKyBoICsgKCh0aGlzLl9obCA+Pj4gMCkgPCAoaGwgPj4+IDApID8gMSA6IDApKSB8IDBcbiAgfVxuXG4gIFNoYTUxMi5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIEggPSBuZXcgQnVmZmVyKDY0KVxuXG4gICAgZnVuY3Rpb24gd3JpdGVJbnQ2NEJFKGgsIGwsIG9mZnNldCkge1xuICAgICAgSC53cml0ZUludDMyQkUoaCwgb2Zmc2V0KVxuICAgICAgSC53cml0ZUludDMyQkUobCwgb2Zmc2V0ICsgNClcbiAgICB9XG5cbiAgICB3cml0ZUludDY0QkUodGhpcy5fYSwgdGhpcy5fYWwsIDApXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2IsIHRoaXMuX2JsLCA4KVxuICAgIHdyaXRlSW50NjRCRSh0aGlzLl9jLCB0aGlzLl9jbCwgMTYpXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2QsIHRoaXMuX2RsLCAyNClcbiAgICB3cml0ZUludDY0QkUodGhpcy5fZSwgdGhpcy5fZWwsIDMyKVxuICAgIHdyaXRlSW50NjRCRSh0aGlzLl9mLCB0aGlzLl9mbCwgNDApXG4gICAgd3JpdGVJbnQ2NEJFKHRoaXMuX2csIHRoaXMuX2dsLCA0OClcbiAgICB3cml0ZUludDY0QkUodGhpcy5faCwgdGhpcy5faGwsIDU2KVxuXG4gICAgcmV0dXJuIEhcbiAgfVxuXG4gIHJldHVybiBTaGE1MTJcblxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vc2hhLmpzL3NoYTUxMi5qc1xuICoqIG1vZHVsZSBpZCA9IDQzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSU0EgRGF0YSBTZWN1cml0eSwgSW5jLiBNRDUgTWVzc2FnZVxuICogRGlnZXN0IEFsZ29yaXRobSwgYXMgZGVmaW5lZCBpbiBSRkMgMTMyMS5cbiAqIFZlcnNpb24gMi4xIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwMi5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG4vKlxuICogQ2FsY3VsYXRlIHRoZSBNRDUgb2YgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb3JlX21kNSh4LCBsZW4pXG57XG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKChsZW4pICUgMzIpO1xuICB4WygoKGxlbiArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsZW47XG5cbiAgdmFyIGEgPSAgMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9ICAyNzE3MzM4Nzg7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxuICB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDBdLCA3ICwgLTY4MDg3NjkzNik7XG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKyA0XSwgNyAsIC0xNzY0MTg4OTcpO1xuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDcgLCAgMTc3MDAzNTQxNik7XG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzEwXSwgMTcsIC00MjA2Myk7XG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKzEyXSwgNyAsICAxODA0NjAzNjgyKTtcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsxM10sIDEyLCAtNDAzNDExMDEpO1xuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XG5cbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDUgLCAtMTY1Nzk2NTEwKTtcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgNl0sIDkgLCAtMTA2OTUwMTYzMik7XG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krMTFdLCAxNCwgIDY0MzcxNzcxMyk7XG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDVdLCA1ICwgLTcwMTU1ODY5MSk7XG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krMTBdLCA5ICwgIDM4MDE2MDgzKTtcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgOV0sIDUgLCAgNTY4NDQ2NDM4KTtcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxNF0sIDkgLCAtMTAxOTgwMzY5MCk7XG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDhdLCAyMCwgIDExNjM1MzE1MDEpO1xuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKzEzXSwgNSAsIC0xNDQ0NjgxNDY3KTtcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgMl0sIDkgLCAtNTE0MDM3ODQpO1xuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKyA3XSwgMTQsICAxNzM1MzI4NDczKTtcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG5cbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDQgLCAtMzc4NTU4KTtcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDFdLCA0ICwgLTE1MzA5OTIwNjApO1xuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krMTNdLCA0ICwgIDY4MTI3OTE3NCk7XG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDZdLCAyMywgIDc2MDI5MTg5KTtcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsgOV0sIDQgLCAtNjQwMzY0NDg3KTtcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsxMl0sIDExLCAtNDIxODE1ODM1KTtcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcblxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyAwXSwgNiAsIC0xOTg2MzA4NDQpO1xuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsxMl0sIDYgLCAgMTcwMDQ4NTU3MSk7XG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDhdLCA2ICwgIDE4NzMzMTMzNTkpO1xuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDYgLCAtMTQ1NTIzMDcwKTtcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XG5cbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gIH1cbiAgcmV0dXJuIEFycmF5KGEsIGIsIGMsIGQpO1xuXG59XG5cbi8qXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuICovXG5mdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpXG57XG4gIHJldHVybiBzYWZlX2FkZChiaXRfcm9sKHNhZmVfYWRkKHNhZmVfYWRkKGEsIHEpLCBzYWZlX2FkZCh4LCB0KSksIHMpLGIpO1xufVxuZnVuY3Rpb24gbWQ1X2ZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpXG57XG4gIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcbn1cbmZ1bmN0aW9uIG1kNV9nZyhhLCBiLCBjLCBkLCB4LCBzLCB0KVxue1xuICByZXR1cm4gbWQ1X2NtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdClcbntcbiAgcmV0dXJuIG1kNV9jbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcbn1cbmZ1bmN0aW9uIG1kNV9paShhLCBiLCBjLCBkLCB4LCBzLCB0KVxue1xuICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XG59XG5cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5mdW5jdGlvbiBzYWZlX2FkZCh4LCB5KVxue1xuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xufVxuXG4vKlxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICovXG5mdW5jdGlvbiBiaXRfcm9sKG51bSwgY250KVxue1xuICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWQ1KGJ1Zikge1xuICByZXR1cm4gaGVscGVycy5oYXNoKGJ1ZiwgY29yZV9tZDUsIDE2KTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvbWQ1LmpzXG4gKiogbW9kdWxlIGlkID0gNDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpbnRTaXplID0gNDtcbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcihpbnRTaXplKTsgemVyb0J1ZmZlci5maWxsKDApO1xudmFyIGNocnN6ID0gODtcblxuZnVuY3Rpb24gdG9BcnJheShidWYsIGJpZ0VuZGlhbikge1xuICBpZiAoKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSAhPT0gMCkge1xuICAgIHZhciBsZW4gPSBidWYubGVuZ3RoICsgKGludFNpemUgLSAoYnVmLmxlbmd0aCAlIGludFNpemUpKTtcbiAgICBidWYgPSBCdWZmZXIuY29uY2F0KFtidWYsIHplcm9CdWZmZXJdLCBsZW4pO1xuICB9XG5cbiAgdmFyIGFyciA9IFtdO1xuICB2YXIgZm4gPSBiaWdFbmRpYW4gPyBidWYucmVhZEludDMyQkUgOiBidWYucmVhZEludDMyTEU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSArPSBpbnRTaXplKSB7XG4gICAgYXJyLnB1c2goZm4uY2FsbChidWYsIGkpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiB0b0J1ZmZlcihhcnIsIHNpemUsIGJpZ0VuZGlhbikge1xuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLndyaXRlSW50MzJCRSA6IGJ1Zi53cml0ZUludDMyTEU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgZm4uY2FsbChidWYsIGFycltpXSwgaSAqIDQsIHRydWUpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbmZ1bmN0aW9uIGhhc2goYnVmLCBmbiwgaGFzaFNpemUsIGJpZ0VuZGlhbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSBidWYgPSBuZXcgQnVmZmVyKGJ1Zik7XG4gIHZhciBhcnIgPSBmbih0b0FycmF5KGJ1ZiwgYmlnRW5kaWFuKSwgYnVmLmxlbmd0aCAqIGNocnN6KTtcbiAgcmV0dXJuIHRvQnVmZmVyKGFyciwgaGFzaFNpemUsIGJpZ0VuZGlhbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBoYXNoOiBoYXNoIH07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vY3J5cHRvLWJyb3dzZXJpZnkvaGVscGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDQ1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbm1vZHVsZS5leHBvcnRzID0gcmlwZW1kMTYwXG5cblxuXG4vKlxuQ3J5cHRvSlMgdjMuMS4yXG5jb2RlLmdvb2dsZS5jb20vcC9jcnlwdG8tanNcbihjKSAyMDA5LTIwMTMgYnkgSmVmZiBNb3R0LiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuY29kZS5nb29nbGUuY29tL3AvY3J5cHRvLWpzL3dpa2kvTGljZW5zZVxuKi9cbi8qKiBAcHJlc2VydmVcbihjKSAyMDEyIGJ5IEPDqWRyaWMgTWVzbmlsLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgICAtIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAtIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuKi9cblxuLy8gQ29uc3RhbnRzIHRhYmxlXG52YXIgemwgPSBbXG4gICAgMCwgIDEsICAyLCAgMywgIDQsICA1LCAgNiwgIDcsICA4LCAgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgICA3LCAgNCwgMTMsICAxLCAxMCwgIDYsIDE1LCAgMywgMTIsICAwLCAgOSwgIDUsICAyLCAxNCwgMTEsICA4LFxuICAgIDMsIDEwLCAxNCwgIDQsICA5LCAxNSwgIDgsICAxLCAgMiwgIDcsICAwLCAgNiwgMTMsIDExLCAgNSwgMTIsXG4gICAgMSwgIDksIDExLCAxMCwgIDAsICA4LCAxMiwgIDQsIDEzLCAgMywgIDcsIDE1LCAxNCwgIDUsICA2LCAgMixcbiAgICA0LCAgMCwgIDUsICA5LCAgNywgMTIsICAyLCAxMCwgMTQsICAxLCAgMywgIDgsIDExLCAgNiwgMTUsIDEzXTtcbnZhciB6ciA9IFtcbiAgICA1LCAxNCwgIDcsICAwLCAgOSwgIDIsIDExLCAgNCwgMTMsICA2LCAxNSwgIDgsICAxLCAxMCwgIDMsIDEyLFxuICAgIDYsIDExLCAgMywgIDcsICAwLCAxMywgIDUsIDEwLCAxNCwgMTUsICA4LCAxMiwgIDQsICA5LCAgMSwgIDIsXG4gICAgMTUsICA1LCAgMSwgIDMsICA3LCAxNCwgIDYsICA5LCAxMSwgIDgsIDEyLCAgMiwgMTAsICAwLCAgNCwgMTMsXG4gICAgOCwgIDYsICA0LCAgMSwgIDMsIDExLCAxNSwgIDAsICA1LCAxMiwgIDIsIDEzLCAgOSwgIDcsIDEwLCAxNCxcbiAgICAxMiwgMTUsIDEwLCAgNCwgIDEsICA1LCAgOCwgIDcsICA2LCAgMiwgMTMsIDE0LCAgMCwgIDMsICA5LCAxMV07XG52YXIgc2wgPSBbXG4gICAgIDExLCAxNCwgMTUsIDEyLCAgNSwgIDgsICA3LCAgOSwgMTEsIDEzLCAxNCwgMTUsICA2LCAgNywgIDksICA4LFxuICAgIDcsIDYsICAgOCwgMTMsIDExLCAgOSwgIDcsIDE1LCAgNywgMTIsIDE1LCAgOSwgMTEsICA3LCAxMywgMTIsXG4gICAgMTEsIDEzLCAgNiwgIDcsIDE0LCAgOSwgMTMsIDE1LCAxNCwgIDgsIDEzLCAgNiwgIDUsIDEyLCAgNywgIDUsXG4gICAgICAxMSwgMTIsIDE0LCAxNSwgMTQsIDE1LCAgOSwgIDgsICA5LCAxNCwgIDUsICA2LCAgOCwgIDYsICA1LCAxMixcbiAgICA5LCAxNSwgIDUsIDExLCAgNiwgIDgsIDEzLCAxMiwgIDUsIDEyLCAxMywgMTQsIDExLCAgOCwgIDUsICA2IF07XG52YXIgc3IgPSBbXG4gICAgOCwgIDksICA5LCAxMSwgMTMsIDE1LCAxNSwgIDUsICA3LCAgNywgIDgsIDExLCAxNCwgMTQsIDEyLCAgNixcbiAgICA5LCAxMywgMTUsICA3LCAxMiwgIDgsICA5LCAxMSwgIDcsICA3LCAxMiwgIDcsICA2LCAxNSwgMTMsIDExLFxuICAgIDksICA3LCAxNSwgMTEsICA4LCAgNiwgIDYsIDE0LCAxMiwgMTMsICA1LCAxNCwgMTMsIDEzLCAgNywgIDUsXG4gICAgMTUsICA1LCAgOCwgMTEsIDE0LCAxNCwgIDYsIDE0LCAgNiwgIDksIDEyLCAgOSwgMTIsICA1LCAxNSwgIDgsXG4gICAgOCwgIDUsIDEyLCAgOSwgMTIsICA1LCAxNCwgIDYsICA4LCAxMywgIDYsICA1LCAxNSwgMTMsIDExLCAxMSBdO1xuXG52YXIgaGwgPSAgWyAweDAwMDAwMDAwLCAweDVBODI3OTk5LCAweDZFRDlFQkExLCAweDhGMUJCQ0RDLCAweEE5NTNGRDRFXTtcbnZhciBociA9ICBbIDB4NTBBMjhCRTYsIDB4NUM0REQxMjQsIDB4NkQ3MDNFRjMsIDB4N0E2RDc2RTksIDB4MDAwMDAwMDBdO1xuXG52YXIgYnl0ZXNUb1dvcmRzID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gIHZhciB3b3JkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KSB7XG4gICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKTtcbiAgfVxuICByZXR1cm4gd29yZHM7XG59O1xuXG52YXIgd29yZHNUb0J5dGVzID0gZnVuY3Rpb24gKHdvcmRzKSB7XG4gIHZhciBieXRlcyA9IFtdO1xuICBmb3IgKHZhciBiID0gMDsgYiA8IHdvcmRzLmxlbmd0aCAqIDMyOyBiICs9IDgpIHtcbiAgICBieXRlcy5wdXNoKCh3b3Jkc1tiID4+PiA1XSA+Pj4gKDI0IC0gYiAlIDMyKSkgJiAweEZGKTtcbiAgfVxuICByZXR1cm4gYnl0ZXM7XG59O1xuXG52YXIgcHJvY2Vzc0Jsb2NrID0gZnVuY3Rpb24gKEgsIE0sIG9mZnNldCkge1xuXG4gIC8vIFN3YXAgZW5kaWFuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIHZhciBvZmZzZXRfaSA9IG9mZnNldCArIGk7XG4gICAgdmFyIE1fb2Zmc2V0X2kgPSBNW29mZnNldF9pXTtcblxuICAgIC8vIFN3YXBcbiAgICBNW29mZnNldF9pXSA9IChcbiAgICAgICAgKCgoTV9vZmZzZXRfaSA8PCA4KSAgfCAoTV9vZmZzZXRfaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcbiAgICAgICAgKCgoTV9vZmZzZXRfaSA8PCAyNCkgfCAoTV9vZmZzZXRfaSA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG4gICAgKTtcbiAgfVxuXG4gIC8vIFdvcmtpbmcgdmFyaWFibGVzXG4gIHZhciBhbCwgYmwsIGNsLCBkbCwgZWw7XG4gIHZhciBhciwgYnIsIGNyLCBkciwgZXI7XG5cbiAgYXIgPSBhbCA9IEhbMF07XG4gIGJyID0gYmwgPSBIWzFdO1xuICBjciA9IGNsID0gSFsyXTtcbiAgZHIgPSBkbCA9IEhbM107XG4gIGVyID0gZWwgPSBIWzRdO1xuICAvLyBDb21wdXRhdGlvblxuICB2YXIgdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA4MDsgaSArPSAxKSB7XG4gICAgdCA9IChhbCArICBNW29mZnNldCt6bFtpXV0pfDA7XG4gICAgaWYgKGk8MTYpe1xuICAgICAgICB0ICs9ICBmMShibCxjbCxkbCkgKyBobFswXTtcbiAgICB9IGVsc2UgaWYgKGk8MzIpIHtcbiAgICAgICAgdCArPSAgZjIoYmwsY2wsZGwpICsgaGxbMV07XG4gICAgfSBlbHNlIGlmIChpPDQ4KSB7XG4gICAgICAgIHQgKz0gIGYzKGJsLGNsLGRsKSArIGhsWzJdO1xuICAgIH0gZWxzZSBpZiAoaTw2NCkge1xuICAgICAgICB0ICs9ICBmNChibCxjbCxkbCkgKyBobFszXTtcbiAgICB9IGVsc2Ugey8vIGlmIChpPDgwKSB7XG4gICAgICAgIHQgKz0gIGY1KGJsLGNsLGRsKSArIGhsWzRdO1xuICAgIH1cbiAgICB0ID0gdHwwO1xuICAgIHQgPSAgcm90bCh0LHNsW2ldKTtcbiAgICB0ID0gKHQrZWwpfDA7XG4gICAgYWwgPSBlbDtcbiAgICBlbCA9IGRsO1xuICAgIGRsID0gcm90bChjbCwgMTApO1xuICAgIGNsID0gYmw7XG4gICAgYmwgPSB0O1xuXG4gICAgdCA9IChhciArIE1bb2Zmc2V0K3pyW2ldXSl8MDtcbiAgICBpZiAoaTwxNil7XG4gICAgICAgIHQgKz0gIGY1KGJyLGNyLGRyKSArIGhyWzBdO1xuICAgIH0gZWxzZSBpZiAoaTwzMikge1xuICAgICAgICB0ICs9ICBmNChicixjcixkcikgKyBoclsxXTtcbiAgICB9IGVsc2UgaWYgKGk8NDgpIHtcbiAgICAgICAgdCArPSAgZjMoYnIsY3IsZHIpICsgaHJbMl07XG4gICAgfSBlbHNlIGlmIChpPDY0KSB7XG4gICAgICAgIHQgKz0gIGYyKGJyLGNyLGRyKSArIGhyWzNdO1xuICAgIH0gZWxzZSB7Ly8gaWYgKGk8ODApIHtcbiAgICAgICAgdCArPSAgZjEoYnIsY3IsZHIpICsgaHJbNF07XG4gICAgfVxuICAgIHQgPSB0fDA7XG4gICAgdCA9ICByb3RsKHQsc3JbaV0pIDtcbiAgICB0ID0gKHQrZXIpfDA7XG4gICAgYXIgPSBlcjtcbiAgICBlciA9IGRyO1xuICAgIGRyID0gcm90bChjciwgMTApO1xuICAgIGNyID0gYnI7XG4gICAgYnIgPSB0O1xuICB9XG4gIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG4gIHQgICAgPSAoSFsxXSArIGNsICsgZHIpfDA7XG4gIEhbMV0gPSAoSFsyXSArIGRsICsgZXIpfDA7XG4gIEhbMl0gPSAoSFszXSArIGVsICsgYXIpfDA7XG4gIEhbM10gPSAoSFs0XSArIGFsICsgYnIpfDA7XG4gIEhbNF0gPSAoSFswXSArIGJsICsgY3IpfDA7XG4gIEhbMF0gPSAgdDtcbn07XG5cbmZ1bmN0aW9uIGYxKHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCkgXiAoeSkgXiAoeikpO1xufVxuXG5mdW5jdGlvbiBmMih4LCB5LCB6KSB7XG4gIHJldHVybiAoKCh4KSYoeSkpIHwgKCh+eCkmKHopKSk7XG59XG5cbmZ1bmN0aW9uIGYzKHgsIHksIHopIHtcbiAgcmV0dXJuICgoKHgpIHwgKH4oeSkpKSBeICh6KSk7XG59XG5cbmZ1bmN0aW9uIGY0KHgsIHksIHopIHtcbiAgcmV0dXJuICgoKHgpICYgKHopKSB8ICgoeSkmKH4oeikpKSk7XG59XG5cbmZ1bmN0aW9uIGY1KHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCkgXiAoKHkpIHwofih6KSkpKTtcbn1cblxuZnVuY3Rpb24gcm90bCh4LG4pIHtcbiAgcmV0dXJuICh4PDxuKSB8ICh4Pj4+KDMyLW4pKTtcbn1cblxuZnVuY3Rpb24gcmlwZW1kMTYwKG1lc3NhZ2UpIHtcbiAgdmFyIEggPSBbMHg2NzQ1MjMwMSwgMHhFRkNEQUI4OSwgMHg5OEJBRENGRSwgMHgxMDMyNTQ3NiwgMHhDM0QyRTFGMF07XG5cbiAgaWYgKHR5cGVvZiBtZXNzYWdlID09ICdzdHJpbmcnKVxuICAgIG1lc3NhZ2UgPSBuZXcgQnVmZmVyKG1lc3NhZ2UsICd1dGY4Jyk7XG5cbiAgdmFyIG0gPSBieXRlc1RvV29yZHMobWVzc2FnZSk7XG5cbiAgdmFyIG5CaXRzTGVmdCA9IG1lc3NhZ2UubGVuZ3RoICogODtcbiAgdmFyIG5CaXRzVG90YWwgPSBtZXNzYWdlLmxlbmd0aCAqIDg7XG5cbiAgLy8gQWRkIHBhZGRpbmdcbiAgbVtuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuICBtWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSAoXG4gICAgICAoKChuQml0c1RvdGFsIDw8IDgpICB8IChuQml0c1RvdGFsID4+PiAyNCkpICYgMHgwMGZmMDBmZikgfFxuICAgICAgKCgobkJpdHNUb3RhbCA8PCAyNCkgfCAobkJpdHNUb3RhbCA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG4gICk7XG5cbiAgZm9yICh2YXIgaT0wIDsgaTxtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIHByb2Nlc3NCbG9jayhILCBtLCBpKTtcbiAgfVxuXG4gIC8vIFN3YXAgZW5kaWFuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAvLyBTaG9ydGN1dFxuICAgIHZhciBIX2kgPSBIW2ldO1xuXG4gICAgLy8gU3dhcFxuICAgIEhbaV0gPSAoKChIX2kgPDwgOCkgIHwgKEhfaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcbiAgICAgICAgICAoKChIX2kgPDwgMjQpIHwgKEhfaSA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApO1xuICB9XG5cbiAgdmFyIGRpZ2VzdGJ5dGVzID0gd29yZHNUb0J5dGVzKEgpO1xuICByZXR1cm4gbmV3IEJ1ZmZlcihkaWdlc3RieXRlcyk7XG59XG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vcmlwZW1kMTYwL2xpYi9yaXBlbWQxNjAuanNcbiAqKiBtb2R1bGUgaWQgPSA0NlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNyZWF0ZUhhc2ggPSByZXF1aXJlKCcuL2NyZWF0ZS1oYXNoJylcblxudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKDEyOClcbnplcm9CdWZmZXIuZmlsbCgwKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhtYWNcblxuZnVuY3Rpb24gSG1hYyAoYWxnLCBrZXkpIHtcbiAgaWYoISh0aGlzIGluc3RhbmNlb2YgSG1hYykpIHJldHVybiBuZXcgSG1hYyhhbGcsIGtleSlcbiAgdGhpcy5fb3BhZCA9IG9wYWRcbiAgdGhpcy5fYWxnID0gYWxnXG5cbiAgdmFyIGJsb2Nrc2l6ZSA9IChhbGcgPT09ICdzaGE1MTInKSA/IDEyOCA6IDY0XG5cbiAga2V5ID0gdGhpcy5fa2V5ID0gIUJ1ZmZlci5pc0J1ZmZlcihrZXkpID8gbmV3IEJ1ZmZlcihrZXkpIDoga2V5XG5cbiAgaWYoa2V5Lmxlbmd0aCA+IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IGNyZWF0ZUhhc2goYWxnKS51cGRhdGUoa2V5KS5kaWdlc3QoKVxuICB9IGVsc2UgaWYoa2V5Lmxlbmd0aCA8IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IEJ1ZmZlci5jb25jYXQoW2tleSwgemVyb0J1ZmZlcl0sIGJsb2Nrc2l6ZSlcbiAgfVxuXG4gIHZhciBpcGFkID0gdGhpcy5faXBhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKVxuICB2YXIgb3BhZCA9IHRoaXMuX29wYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSlcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmxvY2tzaXplOyBpKyspIHtcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXG4gIH1cblxuICB0aGlzLl9oYXNoID0gY3JlYXRlSGFzaChhbGcpLnVwZGF0ZShpcGFkKVxufVxuXG5IbWFjLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSwgZW5jKSB7XG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEsIGVuYylcbiAgcmV0dXJuIHRoaXNcbn1cblxuSG1hYy5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKGVuYykge1xuICB2YXIgaCA9IHRoaXMuX2hhc2guZGlnZXN0KClcbiAgcmV0dXJuIGNyZWF0ZUhhc2godGhpcy5fYWxnKS51cGRhdGUodGhpcy5fb3BhZCkudXBkYXRlKGgpLmRpZ2VzdChlbmMpXG59XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9jcnlwdG8tYnJvd3NlcmlmeS9jcmVhdGUtaG1hYy5qc1xuICoqIG1vZHVsZSBpZCA9IDQ3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcGJrZGYyRXhwb3J0ID0gcmVxdWlyZSgncGJrZGYyLWNvbXBhdC9wYmtkZjInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjcnlwdG8sIGV4cG9ydHMpIHtcbiAgZXhwb3J0cyA9IGV4cG9ydHMgfHwge31cblxuICB2YXIgZXhwb3J0ZWQgPSBwYmtkZjJFeHBvcnQoY3J5cHRvKVxuXG4gIGV4cG9ydHMucGJrZGYyID0gZXhwb3J0ZWQucGJrZGYyXG4gIGV4cG9ydHMucGJrZGYyU3luYyA9IGV4cG9ydGVkLnBia2RmMlN5bmNcblxuICByZXR1cm4gZXhwb3J0c1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L3Bia2RmMi5qc1xuICoqIG1vZHVsZSBpZCA9IDQ4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNyeXB0bykge1xuICBmdW5jdGlvbiBwYmtkZjIocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0LCBjYWxsYmFjaykge1xuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZGlnZXN0KSB7XG4gICAgICBjYWxsYmFjayA9IGRpZ2VzdFxuICAgICAgZGlnZXN0ID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjYWxsYmFjaylcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY2FsbGJhY2sgcHJvdmlkZWQgdG8gcGJrZGYyJylcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IHBia2RmMlN5bmMocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCByZXN1bHQpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBia2RmMlN5bmMocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0KSB7XG4gICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgaXRlcmF0aW9ucylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0l0ZXJhdGlvbnMgbm90IGEgbnVtYmVyJylcblxuICAgIGlmIChpdGVyYXRpb25zIDwgMClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JhZCBpdGVyYXRpb25zJylcblxuICAgIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIGtleWxlbilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSBsZW5ndGggbm90IGEgbnVtYmVyJylcblxuICAgIGlmIChrZXlsZW4gPCAwKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIGtleSBsZW5ndGgnKVxuXG4gICAgZGlnZXN0ID0gZGlnZXN0IHx8ICdzaGExJ1xuXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocGFzc3dvcmQpKSBwYXNzd29yZCA9IG5ldyBCdWZmZXIocGFzc3dvcmQpXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpIHNhbHQgPSBuZXcgQnVmZmVyKHNhbHQpXG5cbiAgICB2YXIgaExlbiwgbCA9IDEsIHIsIFRcbiAgICB2YXIgREsgPSBuZXcgQnVmZmVyKGtleWxlbilcbiAgICB2YXIgYmxvY2sxID0gbmV3IEJ1ZmZlcihzYWx0Lmxlbmd0aCArIDQpXG4gICAgc2FsdC5jb3B5KGJsb2NrMSwgMCwgMCwgc2FsdC5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBsOyBpKyspIHtcbiAgICAgIGJsb2NrMS53cml0ZVVJbnQzMkJFKGksIHNhbHQubGVuZ3RoKVxuXG4gICAgICB2YXIgVSA9IGNyeXB0by5jcmVhdGVIbWFjKGRpZ2VzdCwgcGFzc3dvcmQpLnVwZGF0ZShibG9jazEpLmRpZ2VzdCgpXG5cbiAgICAgIGlmICghaExlbikge1xuICAgICAgICBoTGVuID0gVS5sZW5ndGhcbiAgICAgICAgVCA9IG5ldyBCdWZmZXIoaExlbilcbiAgICAgICAgbCA9IE1hdGguY2VpbChrZXlsZW4gLyBoTGVuKVxuICAgICAgICByID0ga2V5bGVuIC0gKGwgLSAxKSAqIGhMZW5cblxuICAgICAgICBpZiAoa2V5bGVuID4gKE1hdGgucG93KDIsIDMyKSAtIDEpICogaExlbilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdrZXlsZW4gZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCcpXG4gICAgICB9XG5cbiAgICAgIFUuY29weShULCAwLCAwLCBoTGVuKVxuXG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGl0ZXJhdGlvbnM7IGorKykge1xuICAgICAgICBVID0gY3J5cHRvLmNyZWF0ZUhtYWMoZGlnZXN0LCBwYXNzd29yZCkudXBkYXRlKFUpLmRpZ2VzdCgpXG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBoTGVuOyBrKyspIHtcbiAgICAgICAgICBUW2tdIF49IFVba11cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZGVzdFBvcyA9IChpIC0gMSkgKiBoTGVuXG4gICAgICB2YXIgbGVuID0gKGkgPT0gbCA/IHIgOiBoTGVuKVxuICAgICAgVC5jb3B5KERLLCBkZXN0UG9zLCAwLCBsZW4pXG4gICAgfVxuXG4gICAgcmV0dXJuIERLXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBia2RmMjogcGJrZGYyLFxuICAgIHBia2RmMlN5bmM6IHBia2RmMlN5bmNcbiAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L2NyeXB0by1icm93c2VyaWZ5L34vcGJrZGYyLWNvbXBhdC9wYmtkZjIuanNcbiAqKiBtb2R1bGUgaWQgPSA0OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==