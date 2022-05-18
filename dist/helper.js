(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/stackframe/stackframe.js
  var require_stackframe = __commonJS({
    "node_modules/stackframe/stackframe.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("stackframe", [], factory);
        } else if (typeof exports === "object") {
          module.exports = factory();
        } else {
          root.StackFrame = factory();
        }
      })(exports, function() {
        "use strict";
        function _isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }
        __name(_isNumber, "_isNumber");
        function _capitalize(str) {
          return str.charAt(0).toUpperCase() + str.substring(1);
        }
        __name(_capitalize, "_capitalize");
        function _getter(p) {
          return function() {
            return this[p];
          };
        }
        __name(_getter, "_getter");
        var booleanProps = ["isConstructor", "isEval", "isNative", "isToplevel"];
        var numericProps = ["columnNumber", "lineNumber"];
        var stringProps = ["fileName", "functionName", "source"];
        var arrayProps = ["args"];
        var objectProps = ["evalOrigin"];
        var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);
        function StackFrame(obj) {
          if (!obj)
            return;
          for (var i2 = 0; i2 < props.length; i2++) {
            if (obj[props[i2]] !== void 0) {
              this["set" + _capitalize(props[i2])](obj[props[i2]]);
            }
          }
        }
        __name(StackFrame, "StackFrame");
        StackFrame.prototype = {
          getArgs: function() {
            return this.args;
          },
          setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== "[object Array]") {
              throw new TypeError("Args must be an Array");
            }
            this.args = v;
          },
          getEvalOrigin: function() {
            return this.evalOrigin;
          },
          setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
              this.evalOrigin = v;
            } else if (v instanceof Object) {
              this.evalOrigin = new StackFrame(v);
            } else {
              throw new TypeError("Eval Origin must be an Object or StackFrame");
            }
          },
          toString: function() {
            var fileName = this.getFileName() || "";
            var lineNumber = this.getLineNumber() || "";
            var columnNumber = this.getColumnNumber() || "";
            var functionName = this.getFunctionName() || "";
            if (this.getIsEval()) {
              if (fileName) {
                return "[eval] (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
              }
              return "[eval]:" + lineNumber + ":" + columnNumber;
            }
            if (functionName) {
              return functionName + " (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
            }
            return fileName + ":" + lineNumber + ":" + columnNumber;
          }
        };
        StackFrame.fromString = /* @__PURE__ */ __name(function StackFrame$$fromString(str) {
          var argsStartIndex = str.indexOf("(");
          var argsEndIndex = str.lastIndexOf(")");
          var functionName = str.substring(0, argsStartIndex);
          var args = str.substring(argsStartIndex + 1, argsEndIndex).split(",");
          var locationString = str.substring(argsEndIndex + 1);
          if (locationString.indexOf("@") === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, "");
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
          }
          return new StackFrame({
            functionName,
            args: args || void 0,
            fileName,
            lineNumber: lineNumber || void 0,
            columnNumber: columnNumber || void 0
          });
        }, "StackFrame$$fromString");
        for (var i = 0; i < booleanProps.length; i++) {
          StackFrame.prototype["get" + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
          StackFrame.prototype["set" + _capitalize(booleanProps[i])] = function(p) {
            return function(v) {
              this[p] = Boolean(v);
            };
          }(booleanProps[i]);
        }
        for (var j = 0; j < numericProps.length; j++) {
          StackFrame.prototype["get" + _capitalize(numericProps[j])] = _getter(numericProps[j]);
          StackFrame.prototype["set" + _capitalize(numericProps[j])] = function(p) {
            return function(v) {
              if (!_isNumber(v)) {
                throw new TypeError(p + " must be a Number");
              }
              this[p] = Number(v);
            };
          }(numericProps[j]);
        }
        for (var k = 0; k < stringProps.length; k++) {
          StackFrame.prototype["get" + _capitalize(stringProps[k])] = _getter(stringProps[k]);
          StackFrame.prototype["set" + _capitalize(stringProps[k])] = function(p) {
            return function(v) {
              this[p] = String(v);
            };
          }(stringProps[k]);
        }
        return StackFrame;
      });
    }
  });

  // node_modules/error-stack-parser/error-stack-parser.js
  var require_error_stack_parser = __commonJS({
    "node_modules/error-stack-parser/error-stack-parser.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("error-stack-parser", ["stackframe"], factory);
        } else if (typeof exports === "object") {
          module.exports = factory(require_stackframe());
        } else {
          root.ErrorStackParser = factory(root.StackFrame);
        }
      })(exports, /* @__PURE__ */ __name(function ErrorStackParser(StackFrame) {
        "use strict";
        var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
        var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
        var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
        return {
          parse: /* @__PURE__ */ __name(function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
              return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
              return this.parseV8OrIE(error);
            } else if (error.stack) {
              return this.parseFFOrSafari(error);
            } else {
              throw new Error("Cannot parse given Error object");
            }
          }, "ErrorStackParser$$parse"),
          extractLocation: /* @__PURE__ */ __name(function ErrorStackParser$$extractLocation(urlLike) {
            if (urlLike.indexOf(":") === -1) {
              return [urlLike];
            }
            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
            return [parts[1], parts[2] || void 0, parts[3] || void 0];
          }, "ErrorStackParser$$extractLocation"),
          parseV8OrIE: /* @__PURE__ */ __name(function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split("\n").filter(function(line) {
              return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);
            return filtered.map(function(line) {
              if (line.indexOf("(eval ") > -1) {
                line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(\),.*$)/g, "");
              }
              var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(");
              var location2 = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);
              sanitizedLine = location2 ? sanitizedLine.replace(location2[0], "") : sanitizedLine;
              var tokens = sanitizedLine.split(/\s+/).slice(1);
              var locationParts = this.extractLocation(location2 ? location2[1] : tokens.pop());
              var functionName = tokens.join(" ") || void 0;
              var fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
              return new StackFrame({
                functionName,
                fileName,
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
              });
            }, this);
          }, "ErrorStackParser$$parseV8OrIE"),
          parseFFOrSafari: /* @__PURE__ */ __name(function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split("\n").filter(function(line) {
              return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);
            return filtered.map(function(line) {
              if (line.indexOf(" > eval") > -1) {
                line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
              }
              if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
                return new StackFrame({
                  functionName: line
                });
              } else {
                var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                var matches = line.match(functionNameRegex);
                var functionName = matches && matches[1] ? matches[1] : void 0;
                var locationParts = this.extractLocation(line.replace(functionNameRegex, ""));
                return new StackFrame({
                  functionName,
                  fileName: locationParts[0],
                  lineNumber: locationParts[1],
                  columnNumber: locationParts[2],
                  source: line
                });
              }
            }, this);
          }, "ErrorStackParser$$parseFFOrSafari"),
          parseOpera: /* @__PURE__ */ __name(function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
              return this.parseOpera9(e);
            } else if (!e.stack) {
              return this.parseOpera10(e);
            } else {
              return this.parseOpera11(e);
            }
          }, "ErrorStackParser$$parseOpera"),
          parseOpera9: /* @__PURE__ */ __name(function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split("\n");
            var result = [];
            for (var i = 2, len = lines.length; i < len; i += 2) {
              var match = lineRE.exec(lines[i]);
              if (match) {
                result.push(new StackFrame({
                  fileName: match[2],
                  lineNumber: match[1],
                  source: lines[i]
                }));
              }
            }
            return result;
          }, "ErrorStackParser$$parseOpera9"),
          parseOpera10: /* @__PURE__ */ __name(function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split("\n");
            var result = [];
            for (var i = 0, len = lines.length; i < len; i += 2) {
              var match = lineRE.exec(lines[i]);
              if (match) {
                result.push(new StackFrame({
                  functionName: match[3] || void 0,
                  fileName: match[2],
                  lineNumber: match[1],
                  source: lines[i]
                }));
              }
            }
            return result;
          }, "ErrorStackParser$$parseOpera10"),
          parseOpera11: /* @__PURE__ */ __name(function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split("\n").filter(function(line) {
              return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);
            return filtered.map(function(line) {
              var tokens = line.split("@");
              var locationParts = this.extractLocation(tokens.pop());
              var functionCall = tokens.shift() || "";
              var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
              var argsRaw;
              if (functionCall.match(/\(([^)]*)\)/)) {
                argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
              }
              var args = argsRaw === void 0 || argsRaw === "[arguments not available]" ? void 0 : argsRaw.split(",");
              return new StackFrame({
                functionName,
                args,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
              });
            }, this);
          }, "ErrorStackParser$$parseOpera11")
        };
      }, "ErrorStackParser"));
    }
  });

  // node_modules/stack-generator/stack-generator.js
  var require_stack_generator = __commonJS({
    "node_modules/stack-generator/stack-generator.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("stack-generator", ["stackframe"], factory);
        } else if (typeof exports === "object") {
          module.exports = factory(require_stackframe());
        } else {
          root.StackGenerator = factory(root.StackFrame);
        }
      })(exports, function(StackFrame) {
        return {
          backtrace: /* @__PURE__ */ __name(function StackGenerator$$backtrace(opts) {
            var stack = [];
            var maxStackSize = 10;
            if (typeof opts === "object" && typeof opts.maxStackSize === "number") {
              maxStackSize = opts.maxStackSize;
            }
            var curr = arguments.callee;
            while (curr && stack.length < maxStackSize && curr["arguments"]) {
              var args = new Array(curr["arguments"].length);
              for (var i = 0; i < args.length; ++i) {
                args[i] = curr["arguments"][i];
              }
              if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
                stack.push(new StackFrame({ functionName: RegExp.$1 || void 0, args }));
              } else {
                stack.push(new StackFrame({ args }));
              }
              try {
                curr = curr.caller;
              } catch (e) {
                break;
              }
            }
            return stack;
          }, "StackGenerator$$backtrace")
        };
      });
    }
  });

  // node_modules/source-map/lib/util.js
  var require_util = __commonJS({
    "node_modules/source-map/lib/util.js"(exports) {
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      __name(getArg, "getArg");
      exports.getArg = getArg;
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        };
      }
      __name(urlParse, "urlParse");
      exports.urlParse = urlParse;
      function urlGenerate(aParsedUrl) {
        var url = "";
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ":";
        }
        url += "//";
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + "@";
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      __name(urlGenerate, "urlGenerate");
      exports.urlGenerate = urlGenerate;
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = exports.isAbsolute(path);
        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === ".") {
            parts.splice(i, 1);
          } else if (part === "..") {
            up++;
          } else if (up > 0) {
            if (part === "") {
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join("/");
        if (path === "") {
          path = isAbsolute ? "/" : ".";
        }
        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }
      __name(normalize, "normalize");
      exports.normalize = normalize;
      function join(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || "/";
        }
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      __name(join, "join");
      exports.join = join;
      exports.isAbsolute = function(aPath) {
        return aPath.charAt(0) === "/" || !!aPath.match(urlRegexp);
      };
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        aRoot = aRoot.replace(/\/$/, "");
        var level = 0;
        while (aPath.indexOf(aRoot + "/") !== 0) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) {
            return aPath;
          }
          aRoot = aRoot.slice(0, index);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }
          ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }
      __name(relative, "relative");
      exports.relative = relative;
      var supportsNullProto = function() {
        var obj = /* @__PURE__ */ Object.create(null);
        return !("__proto__" in obj);
      }();
      function identity(s) {
        return s;
      }
      __name(identity, "identity");
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return "$" + aStr;
        }
        return aStr;
      }
      __name(toSetString, "toSetString");
      exports.toSetString = supportsNullProto ? identity : toSetString;
      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }
        return aStr;
      }
      __name(fromSetString, "fromSetString");
      exports.fromSetString = supportsNullProto ? identity : fromSetString;
      function isProtoString(s) {
        if (!s) {
          return false;
        }
        var length = s.length;
        if (length < 9) {
          return false;
        }
        if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
          return false;
        }
        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36) {
            return false;
          }
        }
        return true;
      }
      __name(isProtoString, "isProtoString");
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = mappingA.source - mappingB.source;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        return mappingA.name - mappingB.name;
      }
      __name(compareByOriginalPositions, "compareByOriginalPositions");
      exports.compareByOriginalPositions = compareByOriginalPositions;
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }
        cmp = mappingA.source - mappingB.source;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return mappingA.name - mappingB.name;
      }
      __name(compareByGeneratedPositionsDeflated, "compareByGeneratedPositionsDeflated");
      exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }
        if (aStr1 > aStr2) {
          return 1;
        }
        return -1;
      }
      __name(strcmp, "strcmp");
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      __name(compareByGeneratedPositionsInflated, "compareByGeneratedPositionsInflated");
      exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    }
  });

  // node_modules/source-map/lib/binary-search.js
  var require_binary_search = __commonJS({
    "node_modules/source-map/lib/binary-search.js"(exports) {
      exports.GREATEST_LOWER_BOUND = 1;
      exports.LEAST_UPPER_BOUND = 2;
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          return mid;
        } else if (cmp > 0) {
          if (aHigh - mid > 1) {
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return aHigh < aHaystack.length ? aHigh : -1;
          } else {
            return mid;
          }
        } else {
          if (mid - aLow > 1) {
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return mid;
          } else {
            return aLow < 0 ? -1 : aLow;
          }
        }
      }
      __name(recursiveSearch, "recursiveSearch");
      exports.search = /* @__PURE__ */ __name(function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
          return -1;
        }
        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
        if (index < 0) {
          return -1;
        }
        while (index - 1 >= 0) {
          if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
            break;
          }
          --index;
        }
        return index;
      }, "search");
    }
  });

  // node_modules/source-map/lib/array-set.js
  var require_array_set = __commonJS({
    "node_modules/source-map/lib/array-set.js"(exports) {
      var util = require_util();
      var has = Object.prototype.hasOwnProperty;
      function ArraySet() {
        this._array = [];
        this._set = /* @__PURE__ */ Object.create(null);
      }
      __name(ArraySet, "ArraySet");
      ArraySet.fromArray = /* @__PURE__ */ __name(function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      }, "ArraySet_fromArray");
      ArraySet.prototype.size = /* @__PURE__ */ __name(function ArraySet_size() {
        return Object.getOwnPropertyNames(this._set).length;
      }, "ArraySet_size");
      ArraySet.prototype.add = /* @__PURE__ */ __name(function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = util.toSetString(aStr);
        var isDuplicate = has.call(this._set, sStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          this._set[sStr] = idx;
        }
      }, "ArraySet_add");
      ArraySet.prototype.has = /* @__PURE__ */ __name(function ArraySet_has(aStr) {
        var sStr = util.toSetString(aStr);
        return has.call(this._set, sStr);
      }, "ArraySet_has");
      ArraySet.prototype.indexOf = /* @__PURE__ */ __name(function ArraySet_indexOf(aStr) {
        var sStr = util.toSetString(aStr);
        if (has.call(this._set, sStr)) {
          return this._set[sStr];
        }
        throw new Error('"' + aStr + '" is not in the set.');
      }, "ArraySet_indexOf");
      ArraySet.prototype.at = /* @__PURE__ */ __name(function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error("No element indexed by " + aIdx);
      }, "ArraySet_at");
      ArraySet.prototype.toArray = /* @__PURE__ */ __name(function ArraySet_toArray() {
        return this._array.slice();
      }, "ArraySet_toArray");
      exports.ArraySet = ArraySet;
    }
  });

  // node_modules/source-map/lib/base64.js
  var require_base64 = __commonJS({
    "node_modules/source-map/lib/base64.js"(exports) {
      var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      exports.encode = function(number) {
        if (0 <= number && number < intToCharMap.length) {
          return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
      };
      exports.decode = function(charCode) {
        var bigA = 65;
        var bigZ = 90;
        var littleA = 97;
        var littleZ = 122;
        var zero = 48;
        var nine = 57;
        var plus = 43;
        var slash = 47;
        var littleOffset = 26;
        var numberOffset = 52;
        if (bigA <= charCode && charCode <= bigZ) {
          return charCode - bigA;
        }
        if (littleA <= charCode && charCode <= littleZ) {
          return charCode - littleA + littleOffset;
        }
        if (zero <= charCode && charCode <= nine) {
          return charCode - zero + numberOffset;
        }
        if (charCode == plus) {
          return 62;
        }
        if (charCode == slash) {
          return 63;
        }
        return -1;
      };
    }
  });

  // node_modules/source-map/lib/base64-vlq.js
  var require_base64_vlq = __commonJS({
    "node_modules/source-map/lib/base64-vlq.js"(exports) {
      var base64 = require_base64();
      var VLQ_BASE_SHIFT = 5;
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
      var VLQ_BASE_MASK = VLQ_BASE - 1;
      var VLQ_CONTINUATION_BIT = VLQ_BASE;
      function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
      }
      __name(toVLQSigned, "toVLQSigned");
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
      }
      __name(fromVLQSigned, "fromVLQSigned");
      exports.encode = /* @__PURE__ */ __name(function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;
        var vlq = toVLQSigned(aValue);
        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);
        return encoded;
      }, "base64VLQ_encode");
      exports.decode = /* @__PURE__ */ __name(function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;
        do {
          if (aIndex >= strLen) {
            throw new Error("Expected more digits in base 64 VLQ value.");
          }
          digit = base64.decode(aStr.charCodeAt(aIndex++));
          if (digit === -1) {
            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          }
          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);
        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
      }, "base64VLQ_decode");
    }
  });

  // node_modules/source-map/lib/quick-sort.js
  var require_quick_sort = __commonJS({
    "node_modules/source-map/lib/quick-sort.js"(exports) {
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }
      __name(swap, "swap");
      function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
      }
      __name(randomIntInRange, "randomIntInRange");
      function doQuickSort(ary, comparator, p, r) {
        if (p < r) {
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;
          swap(ary, pivotIndex, r);
          var pivot = ary[r];
          for (var j = p; j < r; j++) {
            if (comparator(ary[j], pivot) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }
          swap(ary, i + 1, j);
          var q = i + 1;
          doQuickSort(ary, comparator, p, q - 1);
          doQuickSort(ary, comparator, q + 1, r);
        }
      }
      __name(doQuickSort, "doQuickSort");
      exports.quickSort = function(ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
      };
    }
  });

  // node_modules/source-map/lib/source-map-consumer.js
  var require_source_map_consumer = __commonJS({
    "node_modules/source-map/lib/source-map-consumer.js"(exports) {
      var util = require_util();
      var binarySearch = require_binary_search();
      var ArraySet = require_array_set().ArraySet;
      var base64VLQ = require_base64_vlq();
      var quickSort = require_quick_sort().quickSort;
      function SourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
        }
        return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap) : new BasicSourceMapConsumer(sourceMap);
      }
      __name(SourceMapConsumer, "SourceMapConsumer");
      SourceMapConsumer.fromSourceMap = function(aSourceMap) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
      };
      SourceMapConsumer.prototype._version = 3;
      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
        get: function() {
          if (!this.__generatedMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__generatedMappings;
        }
      });
      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
        get: function() {
          if (!this.__originalMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__originalMappings;
        }
      });
      SourceMapConsumer.prototype._charIsMappingSeparator = /* @__PURE__ */ __name(function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
        var c = aStr.charAt(index);
        return c === ";" || c === ",";
      }, "SourceMapConsumer_charIsMappingSeparator");
      SourceMapConsumer.prototype._parseMappings = /* @__PURE__ */ __name(function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
      }, "SourceMapConsumer_parseMappings");
      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;
      SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
      SourceMapConsumer.LEAST_UPPER_BOUND = 2;
      SourceMapConsumer.prototype.eachMapping = /* @__PURE__ */ __name(function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        var mappings;
        switch (order) {
          case SourceMapConsumer.GENERATED_ORDER:
            mappings = this._generatedMappings;
            break;
          case SourceMapConsumer.ORIGINAL_ORDER:
            mappings = this._originalMappings;
            break;
          default:
            throw new Error("Unknown order of iteration.");
        }
        var sourceRoot = this.sourceRoot;
        mappings.map(function(mapping) {
          var source = mapping.source === null ? null : this._sources.at(mapping.source);
          if (source != null && sourceRoot != null) {
            source = util.join(sourceRoot, source);
          }
          return {
            source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name === null ? null : this._names.at(mapping.name)
          };
        }, this).forEach(aCallback, context);
      }, "SourceMapConsumer_eachMapping");
      SourceMapConsumer.prototype.allGeneratedPositionsFor = /* @__PURE__ */ __name(function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var line = util.getArg(aArgs, "line");
        var needle = {
          source: util.getArg(aArgs, "source"),
          originalLine: line,
          originalColumn: util.getArg(aArgs, "column", 0)
        };
        if (this.sourceRoot != null) {
          needle.source = util.relative(this.sourceRoot, needle.source);
        }
        if (!this._sources.has(needle.source)) {
          return [];
        }
        needle.source = this._sources.indexOf(needle.source);
        var mappings = [];
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (aArgs.column === void 0) {
            var originalLine = mapping.originalLine;
            while (mapping && mapping.originalLine === originalLine) {
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          } else {
            var originalColumn = mapping.originalColumn;
            while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          }
        }
        return mappings;
      }, "SourceMapConsumer_allGeneratedPositionsFor");
      exports.SourceMapConsumer = SourceMapConsumer;
      function BasicSourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
        }
        var version = util.getArg(sourceMap, "version");
        var sources = util.getArg(sourceMap, "sources");
        var names = util.getArg(sourceMap, "names", []);
        var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
        var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
        var mappings = util.getArg(sourceMap, "mappings");
        var file = util.getArg(sourceMap, "file", null);
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        sources = sources.map(String).map(util.normalize).map(function(source) {
          return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
        });
        this._names = ArraySet.fromArray(names.map(String), true);
        this._sources = ArraySet.fromArray(sources, true);
        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this.file = file;
      }
      __name(BasicSourceMapConsumer, "BasicSourceMapConsumer");
      BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
      BasicSourceMapConsumer.fromSourceMap = /* @__PURE__ */ __name(function SourceMapConsumer_fromSourceMap(aSourceMap) {
        var smc = Object.create(BasicSourceMapConsumer.prototype);
        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;
        var generatedMappings = aSourceMap._mappings.toArray().slice();
        var destGeneratedMappings = smc.__generatedMappings = [];
        var destOriginalMappings = smc.__originalMappings = [];
        for (var i = 0, length = generatedMappings.length; i < length; i++) {
          var srcMapping = generatedMappings[i];
          var destMapping = new Mapping();
          destMapping.generatedLine = srcMapping.generatedLine;
          destMapping.generatedColumn = srcMapping.generatedColumn;
          if (srcMapping.source) {
            destMapping.source = sources.indexOf(srcMapping.source);
            destMapping.originalLine = srcMapping.originalLine;
            destMapping.originalColumn = srcMapping.originalColumn;
            if (srcMapping.name) {
              destMapping.name = names.indexOf(srcMapping.name);
            }
            destOriginalMappings.push(destMapping);
          }
          destGeneratedMappings.push(destMapping);
        }
        quickSort(smc.__originalMappings, util.compareByOriginalPositions);
        return smc;
      }, "SourceMapConsumer_fromSourceMap");
      BasicSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
        get: function() {
          return this._sources.toArray().map(function(s) {
            return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
          }, this);
        }
      });
      function Mapping() {
        this.generatedLine = 0;
        this.generatedColumn = 0;
        this.source = null;
        this.originalLine = null;
        this.originalColumn = null;
        this.name = null;
      }
      __name(Mapping, "Mapping");
      BasicSourceMapConsumer.prototype._parseMappings = /* @__PURE__ */ __name(function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var length = aStr.length;
        var index = 0;
        var cachedSegments = {};
        var temp = {};
        var originalMappings = [];
        var generatedMappings = [];
        var mapping, str, segment, end, value;
        while (index < length) {
          if (aStr.charAt(index) === ";") {
            generatedLine++;
            index++;
            previousGeneratedColumn = 0;
          } else if (aStr.charAt(index) === ",") {
            index++;
          } else {
            mapping = new Mapping();
            mapping.generatedLine = generatedLine;
            for (end = index; end < length; end++) {
              if (this._charIsMappingSeparator(aStr, end)) {
                break;
              }
            }
            str = aStr.slice(index, end);
            segment = cachedSegments[str];
            if (segment) {
              index += str.length;
            } else {
              segment = [];
              while (index < end) {
                base64VLQ.decode(aStr, index, temp);
                value = temp.value;
                index = temp.rest;
                segment.push(value);
              }
              if (segment.length === 2) {
                throw new Error("Found a source, but no line and column");
              }
              if (segment.length === 3) {
                throw new Error("Found a source and line, but no column");
              }
              cachedSegments[str] = segment;
            }
            mapping.generatedColumn = previousGeneratedColumn + segment[0];
            previousGeneratedColumn = mapping.generatedColumn;
            if (segment.length > 1) {
              mapping.source = previousSource + segment[1];
              previousSource += segment[1];
              mapping.originalLine = previousOriginalLine + segment[2];
              previousOriginalLine = mapping.originalLine;
              mapping.originalLine += 1;
              mapping.originalColumn = previousOriginalColumn + segment[3];
              previousOriginalColumn = mapping.originalColumn;
              if (segment.length > 4) {
                mapping.name = previousName + segment[4];
                previousName += segment[4];
              }
            }
            generatedMappings.push(mapping);
            if (typeof mapping.originalLine === "number") {
              originalMappings.push(mapping);
            }
          }
        }
        quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
        this.__generatedMappings = generatedMappings;
        quickSort(originalMappings, util.compareByOriginalPositions);
        this.__originalMappings = originalMappings;
      }, "SourceMapConsumer_parseMappings");
      BasicSourceMapConsumer.prototype._findMapping = /* @__PURE__ */ __name(function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        if (aNeedle[aLineName] <= 0) {
          throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
      }, "SourceMapConsumer_findMapping");
      BasicSourceMapConsumer.prototype.computeColumnSpans = /* @__PURE__ */ __name(function SourceMapConsumer_computeColumnSpans() {
        for (var index = 0; index < this._generatedMappings.length; ++index) {
          var mapping = this._generatedMappings[index];
          if (index + 1 < this._generatedMappings.length) {
            var nextMapping = this._generatedMappings[index + 1];
            if (mapping.generatedLine === nextMapping.generatedLine) {
              mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
              continue;
            }
          }
          mapping.lastGeneratedColumn = Infinity;
        }
      }, "SourceMapConsumer_computeColumnSpans");
      BasicSourceMapConsumer.prototype.originalPositionFor = /* @__PURE__ */ __name(function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._generatedMappings[index];
          if (mapping.generatedLine === needle.generatedLine) {
            var source = util.getArg(mapping, "source", null);
            if (source !== null) {
              source = this._sources.at(source);
              if (this.sourceRoot != null) {
                source = util.join(this.sourceRoot, source);
              }
            }
            var name = util.getArg(mapping, "name", null);
            if (name !== null) {
              name = this._names.at(name);
            }
            return {
              source,
              line: util.getArg(mapping, "originalLine", null),
              column: util.getArg(mapping, "originalColumn", null),
              name
            };
          }
        }
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }, "SourceMapConsumer_originalPositionFor");
      BasicSourceMapConsumer.prototype.hasContentsOfAllSources = /* @__PURE__ */ __name(function BasicSourceMapConsumer_hasContentsOfAllSources() {
        if (!this.sourcesContent) {
          return false;
        }
        return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
          return sc == null;
        });
      }, "BasicSourceMapConsumer_hasContentsOfAllSources");
      BasicSourceMapConsumer.prototype.sourceContentFor = /* @__PURE__ */ __name(function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        if (!this.sourcesContent) {
          return null;
        }
        if (this.sourceRoot != null) {
          aSource = util.relative(this.sourceRoot, aSource);
        }
        if (this._sources.has(aSource)) {
          return this.sourcesContent[this._sources.indexOf(aSource)];
        }
        var url;
        if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
          var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
          if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }
          if ((!url.path || url.path == "/") && this._sources.has("/" + aSource)) {
            return this.sourcesContent[this._sources.indexOf("/" + aSource)];
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      }, "SourceMapConsumer_sourceContentFor");
      BasicSourceMapConsumer.prototype.generatedPositionFor = /* @__PURE__ */ __name(function SourceMapConsumer_generatedPositionFor(aArgs) {
        var source = util.getArg(aArgs, "source");
        if (this.sourceRoot != null) {
          source = util.relative(this.sourceRoot, source);
        }
        if (!this._sources.has(source)) {
          return {
            line: null,
            column: null,
            lastColumn: null
          };
        }
        source = this._sources.indexOf(source);
        var needle = {
          source,
          originalLine: util.getArg(aArgs, "line"),
          originalColumn: util.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (mapping.source === needle.source) {
            return {
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            };
          }
        }
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }, "SourceMapConsumer_generatedPositionFor");
      exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
      function IndexedSourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
        }
        var version = util.getArg(sourceMap, "version");
        var sections = util.getArg(sourceMap, "sections");
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        this._sources = new ArraySet();
        this._names = new ArraySet();
        var lastOffset = {
          line: -1,
          column: 0
        };
        this._sections = sections.map(function(s) {
          if (s.url) {
            throw new Error("Support for url field in sections not implemented.");
          }
          var offset = util.getArg(s, "offset");
          var offsetLine = util.getArg(offset, "line");
          var offsetColumn = util.getArg(offset, "column");
          if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
            throw new Error("Section offsets must be ordered and non-overlapping.");
          }
          lastOffset = offset;
          return {
            generatedOffset: {
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1
            },
            consumer: new SourceMapConsumer(util.getArg(s, "map"))
          };
        });
      }
      __name(IndexedSourceMapConsumer, "IndexedSourceMapConsumer");
      IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
      IndexedSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
        get: function() {
          var sources = [];
          for (var i = 0; i < this._sections.length; i++) {
            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
              sources.push(this._sections[i].consumer.sources[j]);
            }
          }
          return sources;
        }
      });
      IndexedSourceMapConsumer.prototype.originalPositionFor = /* @__PURE__ */ __name(function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
          var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }
          return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
        });
        var section = this._sections[sectionIndex];
        if (!section) {
          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        }
        return section.consumer.originalPositionFor({
          line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
          column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          bias: aArgs.bias
        });
      }, "IndexedSourceMapConsumer_originalPositionFor");
      IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = /* @__PURE__ */ __name(function IndexedSourceMapConsumer_hasContentsOfAllSources() {
        return this._sections.every(function(s) {
          return s.consumer.hasContentsOfAllSources();
        });
      }, "IndexedSourceMapConsumer_hasContentsOfAllSources");
      IndexedSourceMapConsumer.prototype.sourceContentFor = /* @__PURE__ */ __name(function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var content = section.consumer.sourceContentFor(aSource, true);
          if (content) {
            return content;
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      }, "IndexedSourceMapConsumer_sourceContentFor");
      IndexedSourceMapConsumer.prototype.generatedPositionFor = /* @__PURE__ */ __name(function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          if (section.consumer.sources.indexOf(util.getArg(aArgs, "source")) === -1) {
            continue;
          }
          var generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            var ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
            };
            return ret;
          }
        }
        return {
          line: null,
          column: null
        };
      }, "IndexedSourceMapConsumer_generatedPositionFor");
      IndexedSourceMapConsumer.prototype._parseMappings = /* @__PURE__ */ __name(function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var sectionMappings = section.consumer._generatedMappings;
          for (var j = 0; j < sectionMappings.length; j++) {
            var mapping = sectionMappings[j];
            var source = section.consumer._sources.at(mapping.source);
            if (section.consumer.sourceRoot !== null) {
              source = util.join(section.consumer.sourceRoot, source);
            }
            this._sources.add(source);
            source = this._sources.indexOf(source);
            var name = section.consumer._names.at(mapping.name);
            this._names.add(name);
            name = this._names.indexOf(name);
            var adjustedMapping = {
              source,
              generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
              generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name
            };
            this.__generatedMappings.push(adjustedMapping);
            if (typeof adjustedMapping.originalLine === "number") {
              this.__originalMappings.push(adjustedMapping);
            }
          }
        }
        quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
        quickSort(this.__originalMappings, util.compareByOriginalPositions);
      }, "IndexedSourceMapConsumer_parseMappings");
      exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
    }
  });

  // node_modules/stacktrace-gps/stacktrace-gps.js
  var require_stacktrace_gps = __commonJS({
    "node_modules/stacktrace-gps/stacktrace-gps.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("stacktrace-gps", ["source-map", "stackframe"], factory);
        } else if (typeof exports === "object") {
          module.exports = factory(require_source_map_consumer(), require_stackframe());
        } else {
          root.StackTraceGPS = factory(root.SourceMap || root.sourceMap, root.StackFrame);
        }
      })(exports, function(SourceMap, StackFrame) {
        "use strict";
        function _xdr(url) {
          return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open("get", url);
            req.onerror = reject;
            req.onreadystatechange = /* @__PURE__ */ __name(function onreadystatechange() {
              if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 300 || url.substr(0, 7) === "file://" && req.responseText) {
                  resolve(req.responseText);
                } else {
                  reject(new Error("HTTP status: " + req.status + " retrieving " + url));
                }
              }
            }, "onreadystatechange");
            req.send();
          });
        }
        __name(_xdr, "_xdr");
        function _atob(b64str) {
          if (typeof window !== "undefined" && window.atob) {
            return window.atob(b64str);
          } else {
            throw new Error("You must supply a polyfill for window.atob in this environment");
          }
        }
        __name(_atob, "_atob");
        function _parseJson(string) {
          if (typeof JSON !== "undefined" && JSON.parse) {
            return JSON.parse(string);
          } else {
            throw new Error("You must supply a polyfill for JSON.parse in this environment");
          }
        }
        __name(_parseJson, "_parseJson");
        function _findFunctionName(source, lineNumber) {
          var syntaxes = [
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
            /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
            /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?(\S+)\s*\(.*?\)\s*\{/,
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
          ];
          var lines = source.split("\n");
          var code = "";
          var maxLines = Math.min(lineNumber, 20);
          for (var i = 0; i < maxLines; ++i) {
            var line = lines[lineNumber - i - 1];
            var commentPos = line.indexOf("//");
            if (commentPos >= 0) {
              line = line.substr(0, commentPos);
            }
            if (line) {
              code = line + code;
              var len = syntaxes.length;
              for (var index = 0; index < len; index++) {
                var m = syntaxes[index].exec(code);
                if (m && m[1]) {
                  return m[1];
                }
              }
            }
          }
          return void 0;
        }
        __name(_findFunctionName, "_findFunctionName");
        function _ensureSupportedEnvironment() {
          if (typeof Object.defineProperty !== "function" || typeof Object.create !== "function") {
            throw new Error("Unable to consume source maps in older browsers");
          }
        }
        __name(_ensureSupportedEnvironment, "_ensureSupportedEnvironment");
        function _ensureStackFrameIsLegit(stackframe) {
          if (typeof stackframe !== "object") {
            throw new TypeError("Given StackFrame is not an object");
          } else if (typeof stackframe.fileName !== "string") {
            throw new TypeError("Given file name is not a String");
          } else if (typeof stackframe.lineNumber !== "number" || stackframe.lineNumber % 1 !== 0 || stackframe.lineNumber < 1) {
            throw new TypeError("Given line number must be a positive integer");
          } else if (typeof stackframe.columnNumber !== "number" || stackframe.columnNumber % 1 !== 0 || stackframe.columnNumber < 0) {
            throw new TypeError("Given column number must be a non-negative integer");
          }
          return true;
        }
        __name(_ensureStackFrameIsLegit, "_ensureStackFrameIsLegit");
        function _findSourceMappingURL(source) {
          var sourceMappingUrlRegExp = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/mg;
          var lastSourceMappingUrl;
          var matchSourceMappingUrl;
          while (matchSourceMappingUrl = sourceMappingUrlRegExp.exec(source)) {
            lastSourceMappingUrl = matchSourceMappingUrl[1];
          }
          if (lastSourceMappingUrl) {
            return lastSourceMappingUrl;
          } else {
            throw new Error("sourceMappingURL not found");
          }
        }
        __name(_findSourceMappingURL, "_findSourceMappingURL");
        function _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache) {
          return new Promise(function(resolve, reject) {
            var loc = sourceMapConsumer.originalPositionFor({
              line: stackframe.lineNumber,
              column: stackframe.columnNumber
            });
            if (loc.source) {
              var mappedSource = sourceMapConsumer.sourceContentFor(loc.source);
              if (mappedSource) {
                sourceCache[loc.source] = mappedSource;
              }
              resolve(new StackFrame({
                functionName: loc.name || stackframe.functionName,
                args: stackframe.args,
                fileName: loc.source,
                lineNumber: loc.line,
                columnNumber: loc.column
              }));
            } else {
              reject(new Error("Could not get original source for given stackframe and source map"));
            }
          });
        }
        __name(_extractLocationInfoFromSourceMapSource, "_extractLocationInfoFromSourceMapSource");
        return /* @__PURE__ */ __name(function StackTraceGPS(opts) {
          if (!(this instanceof StackTraceGPS)) {
            return new StackTraceGPS(opts);
          }
          opts = opts || {};
          this.sourceCache = opts.sourceCache || {};
          this.sourceMapConsumerCache = opts.sourceMapConsumerCache || {};
          this.ajax = opts.ajax || _xdr;
          this._atob = opts.atob || _atob;
          this._get = /* @__PURE__ */ __name(function _get(location2) {
            return new Promise(function(resolve, reject) {
              var isDataUrl = location2.substr(0, 5) === "data:";
              if (this.sourceCache[location2]) {
                resolve(this.sourceCache[location2]);
              } else if (opts.offline && !isDataUrl) {
                reject(new Error("Cannot make network requests in offline mode"));
              } else {
                if (isDataUrl) {
                  var supportedEncodingRegexp = /^data:application\/json;([\w=:"-]+;)*base64,/;
                  var match = location2.match(supportedEncodingRegexp);
                  if (match) {
                    var sourceMapStart = match[0].length;
                    var encodedSource = location2.substr(sourceMapStart);
                    var source = this._atob(encodedSource);
                    this.sourceCache[location2] = source;
                    resolve(source);
                  } else {
                    reject(new Error("The encoding of the inline sourcemap is not supported"));
                  }
                } else {
                  var xhrPromise = this.ajax(location2, { method: "get" });
                  this.sourceCache[location2] = xhrPromise;
                  xhrPromise.then(resolve, reject);
                }
              }
            }.bind(this));
          }, "_get");
          this._getSourceMapConsumer = /* @__PURE__ */ __name(function _getSourceMapConsumer(sourceMappingURL, defaultSourceRoot) {
            return new Promise(function(resolve) {
              if (this.sourceMapConsumerCache[sourceMappingURL]) {
                resolve(this.sourceMapConsumerCache[sourceMappingURL]);
              } else {
                var sourceMapConsumerPromise = new Promise(function(resolve2, reject) {
                  return this._get(sourceMappingURL).then(function(sourceMapSource) {
                    if (typeof sourceMapSource === "string") {
                      sourceMapSource = _parseJson(sourceMapSource.replace(/^\)\]\}'/, ""));
                    }
                    if (typeof sourceMapSource.sourceRoot === "undefined") {
                      sourceMapSource.sourceRoot = defaultSourceRoot;
                    }
                    resolve2(new SourceMap.SourceMapConsumer(sourceMapSource));
                  }, reject);
                }.bind(this));
                this.sourceMapConsumerCache[sourceMappingURL] = sourceMapConsumerPromise;
                resolve(sourceMapConsumerPromise);
              }
            }.bind(this));
          }, "_getSourceMapConsumer");
          this.pinpoint = /* @__PURE__ */ __name(function StackTraceGPS$$pinpoint(stackframe) {
            return new Promise(function(resolve, reject) {
              this.getMappedLocation(stackframe).then(function(mappedStackFrame) {
                function resolveMappedStackFrame() {
                  resolve(mappedStackFrame);
                }
                __name(resolveMappedStackFrame, "resolveMappedStackFrame");
                this.findFunctionName(mappedStackFrame).then(resolve, resolveMappedStackFrame)["catch"](resolveMappedStackFrame);
              }.bind(this), reject);
            }.bind(this));
          }, "StackTraceGPS$$pinpoint");
          this.findFunctionName = /* @__PURE__ */ __name(function StackTraceGPS$$findFunctionName(stackframe) {
            return new Promise(function(resolve, reject) {
              _ensureStackFrameIsLegit(stackframe);
              this._get(stackframe.fileName).then(/* @__PURE__ */ __name(function getSourceCallback(source) {
                var lineNumber = stackframe.lineNumber;
                var columnNumber = stackframe.columnNumber;
                var guessedFunctionName = _findFunctionName(source, lineNumber, columnNumber);
                if (guessedFunctionName) {
                  resolve(new StackFrame({
                    functionName: guessedFunctionName,
                    args: stackframe.args,
                    fileName: stackframe.fileName,
                    lineNumber,
                    columnNumber
                  }));
                } else {
                  resolve(stackframe);
                }
              }, "getSourceCallback"), reject)["catch"](reject);
            }.bind(this));
          }, "StackTraceGPS$$findFunctionName");
          this.getMappedLocation = /* @__PURE__ */ __name(function StackTraceGPS$$getMappedLocation(stackframe) {
            return new Promise(function(resolve, reject) {
              _ensureSupportedEnvironment();
              _ensureStackFrameIsLegit(stackframe);
              var sourceCache = this.sourceCache;
              var fileName = stackframe.fileName;
              this._get(fileName).then(function(source) {
                var sourceMappingURL = _findSourceMappingURL(source);
                var isDataUrl = sourceMappingURL.substr(0, 5) === "data:";
                var defaultSourceRoot = fileName.substring(0, fileName.lastIndexOf("/") + 1);
                if (sourceMappingURL[0] !== "/" && !isDataUrl && !/^https?:\/\/|^\/\//i.test(sourceMappingURL)) {
                  sourceMappingURL = defaultSourceRoot + sourceMappingURL;
                }
                return this._getSourceMapConsumer(sourceMappingURL, defaultSourceRoot).then(function(sourceMapConsumer) {
                  return _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache).then(resolve)["catch"](function() {
                    resolve(stackframe);
                  });
                });
              }.bind(this), reject)["catch"](reject);
            }.bind(this));
          }, "StackTraceGPS$$getMappedLocation");
        }, "StackTraceGPS");
      });
    }
  });

  // node_modules/stacktrace-js/stacktrace.js
  var require_stacktrace = __commonJS({
    "node_modules/stacktrace-js/stacktrace.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("stacktrace", ["error-stack-parser", "stack-generator", "stacktrace-gps"], factory);
        } else if (typeof exports === "object") {
          module.exports = factory(require_error_stack_parser(), require_stack_generator(), require_stacktrace_gps());
        } else {
          root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator, root.StackTraceGPS);
        }
      })(exports, /* @__PURE__ */ __name(function StackTrace2(ErrorStackParser, StackGenerator, StackTraceGPS) {
        var _options = {
          filter: function(stackframe) {
            return (stackframe.functionName || "").indexOf("StackTrace$$") === -1 && (stackframe.functionName || "").indexOf("ErrorStackParser$$") === -1 && (stackframe.functionName || "").indexOf("StackTraceGPS$$") === -1 && (stackframe.functionName || "").indexOf("StackGenerator$$") === -1;
          },
          sourceCache: {}
        };
        var _generateError = /* @__PURE__ */ __name(function StackTrace$$GenerateError() {
          try {
            throw new Error();
          } catch (err) {
            return err;
          }
        }, "StackTrace$$GenerateError");
        function _merge(first, second) {
          var target = {};
          [first, second].forEach(function(obj) {
            for (var prop in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                target[prop] = obj[prop];
              }
            }
            return target;
          });
          return target;
        }
        __name(_merge, "_merge");
        function _isShapedLikeParsableError(err) {
          return err.stack || err["opera#sourceloc"];
        }
        __name(_isShapedLikeParsableError, "_isShapedLikeParsableError");
        function _filtered(stackframes, filter) {
          if (typeof filter === "function") {
            return stackframes.filter(filter);
          }
          return stackframes;
        }
        __name(_filtered, "_filtered");
        return {
          get: /* @__PURE__ */ __name(function StackTrace$$get(opts) {
            var err = _generateError();
            return _isShapedLikeParsableError(err) ? this.fromError(err, opts) : this.generateArtificially(opts);
          }, "StackTrace$$get"),
          getSync: /* @__PURE__ */ __name(function StackTrace$$getSync(opts) {
            opts = _merge(_options, opts);
            var err = _generateError();
            var stack = _isShapedLikeParsableError(err) ? ErrorStackParser.parse(err) : StackGenerator.backtrace(opts);
            return _filtered(stack, opts.filter);
          }, "StackTrace$$getSync"),
          fromError: /* @__PURE__ */ __name(function StackTrace$$fromError(error, opts) {
            opts = _merge(_options, opts);
            var gps = new StackTraceGPS(opts);
            return new Promise(function(resolve) {
              var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
              resolve(Promise.all(stackframes.map(function(sf) {
                return new Promise(function(resolve2) {
                  function resolveOriginal() {
                    resolve2(sf);
                  }
                  __name(resolveOriginal, "resolveOriginal");
                  gps.pinpoint(sf).then(resolve2, resolveOriginal)["catch"](resolveOriginal);
                });
              })));
            }.bind(this));
          }, "StackTrace$$fromError"),
          generateArtificially: /* @__PURE__ */ __name(function StackTrace$$generateArtificially(opts) {
            opts = _merge(_options, opts);
            var stackFrames = StackGenerator.backtrace(opts);
            if (typeof opts.filter === "function") {
              stackFrames = stackFrames.filter(opts.filter);
            }
            return Promise.resolve(stackFrames);
          }, "StackTrace$$generateArtificially"),
          instrument: /* @__PURE__ */ __name(function StackTrace$$instrument(fn, callback, errback, thisArg) {
            if (typeof fn !== "function") {
              throw new Error("Cannot instrument non-function object");
            } else if (typeof fn.__stacktraceOriginalFn === "function") {
              return fn;
            }
            var instrumented = (/* @__PURE__ */ __name(function StackTrace$$instrumented() {
              try {
                this.get().then(callback, errback)["catch"](errback);
                return fn.apply(thisArg || this, arguments);
              } catch (e) {
                if (_isShapedLikeParsableError(e)) {
                  this.fromError(e).then(callback, errback)["catch"](errback);
                }
                throw e;
              }
            }, "StackTrace$$instrumented")).bind(this);
            instrumented.__stacktraceOriginalFn = fn;
            return instrumented;
          }, "StackTrace$$instrument"),
          deinstrument: /* @__PURE__ */ __name(function StackTrace$$deinstrument(fn) {
            if (typeof fn !== "function") {
              throw new Error("Cannot de-instrument non-function object");
            } else if (typeof fn.__stacktraceOriginalFn === "function") {
              return fn.__stacktraceOriginalFn;
            } else {
              return fn;
            }
          }, "StackTrace$$deinstrument"),
          report: /* @__PURE__ */ __name(function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
            return new Promise(function(resolve, reject) {
              var req = new XMLHttpRequest();
              req.onerror = reject;
              req.onreadystatechange = /* @__PURE__ */ __name(function onreadystatechange() {
                if (req.readyState === 4) {
                  if (req.status >= 200 && req.status < 400) {
                    resolve(req.responseText);
                  } else {
                    reject(new Error("POST to " + url + " failed with status: " + req.status));
                  }
                }
              }, "onreadystatechange");
              req.open("post", url);
              req.setRequestHeader("Content-Type", "application/json");
              if (requestOptions && typeof requestOptions.headers === "object") {
                var headers = requestOptions.headers;
                for (var header in headers) {
                  if (Object.prototype.hasOwnProperty.call(headers, header)) {
                    req.setRequestHeader(header, headers[header]);
                  }
                }
              }
              var reportPayload = { stack: stackframes };
              if (errorMsg !== void 0 && errorMsg !== null) {
                reportPayload.message = errorMsg;
              }
              req.send(JSON.stringify(reportPayload));
            });
          }, "StackTrace$$report")
        };
      }, "StackTrace"));
    }
  });

  // helper.ts
  var import_stacktrace_js = __toESM(require_stacktrace());
  window.addEventListener("error", (e) => {
    import_stacktrace_js.default.fromError(e.error).then((stack) => {
      fetch("/error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          msg: e.error.message,
          stack: stack.slice(0, 4).map((step) => {
            return __spreadProps(__spreadValues({}, step), {
              file: step.fileName.replace(location.origin + "/", ""),
              line: step.lineNumber,
              col: step.columnNumber
            });
          })
        })
      });
    }).catch(() => console.error("failed to parse err"));
  });
  var replit = {
    getUser() {
      return fetch("/user").then((res) => res.json()).then((user) => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      });
    },
    auth() {
      return new Promise((resolve, reject) => {
        const authComplete = /* @__PURE__ */ __name((e) => {
          if (e.data !== "auth_complete") {
            resolve(null);
            return;
          }
          window.removeEventListener("message", authComplete);
          authWindow.close();
          this.getUser().then(resolve);
        }, "authComplete");
        window.addEventListener("message", authComplete);
        const w = 320;
        const h = 480;
        const left = screen.width / 2 - w / 2;
        const top = screen.height / 2 - h / 2;
        const authWindow = window.open(`https://repl.it/auth_with_repl_site?domain=${location.host}`, "_blank", `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);
      });
    },
    getUserOrAuth() {
      return new Promise((resolve, reject) => {
        this.getUser().then((user) => {
          if (user) {
            resolve(user);
          } else {
            this.auth().then((user2) => {
              resolve(user2);
            });
          }
        });
      });
    },
    getData(key, def) {
      return fetch(`/db/${key}`).then((res) => res.json()).then((val) => {
        if (val == null && def !== void 0) {
          return this.setData(key, def);
        }
        return Promise.resolve(val);
      });
    },
    setData(key, val) {
      return fetch(`/db/${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(val)
      }).then(() => Promise.resolve(val));
    },
    delData(key) {
      return fetch(`/db/${key}`, {
        method: "DELETE"
      }).then(() => {
      });
    },
    listData() {
      return fetch(`/db`).then((res) => res.json());
    },
    clearData() {
      return fetch(`/db`, {
        method: "DELETE"
      }).then((res) => {
      });
    }
  };
  window.replit = replit;
})();
//# sourceMappingURL=helper.js.map
