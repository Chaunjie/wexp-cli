"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function r(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,n,t){return n&&r(e.prototype,n),t&&r(e,t),e}}();function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var _class=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"$getCurrentPage",value:function(){return getCurrentPages()}},{key:"$query",value:function(t){var r=this;return new Promise(function(n,e){wx.createSelectorQuery().in(r).selectAll(t).boundingClientRect(function(e){n(e)}).exec()})}}]),e}();exports.default=_class;