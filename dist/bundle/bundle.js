/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/src/exporters/agent-gateway/api-span-formatter.js":
/*!*****************************************************************!*\
  !*** ./build/src/exporters/agent-gateway/api-span-formatter.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction modelToApiSpan(modelSpan) {\n    var spanContext = modelSpan.spanContext;\n    var trace = spanContext.trace;\n    var baseTime = trace.baseTime;\n    var apiSpan = {\n        traceId: hexToBase64(trace.traceId),\n        spanId: hexToBase64(spanContext.spanId),\n        tracestate: spanContext.tracestate,\n        parentSpanId: modelSpan.parentSpanId === undefined ?\n            undefined :\n            hexToBase64(modelSpan.parentSpanId),\n        name: truncatableString(modelSpan.name),\n        kind: modelSpan.kind,\n        startTime: baseElapsedToIsoDate(trace.baseTime, modelSpan.startTime),\n        endTime: modelSpan.endTime === undefined ?\n            undefined :\n            baseElapsedToIsoDate(trace.baseTime, modelSpan.endTime),\n        attributes: modelToApiAttributes(modelSpan.attributes),\n        stackTrace: modelSpan.stackTrace && modelToApiStackTrace(modelSpan.stackTrace),\n        timeEvents: modelToApiEvents(modelSpan.annotations || [], modelSpan.messageEvents || [], baseTime),\n        links: modelSpan.links && modelToApiLinks(modelSpan.links),\n        status: modelSpan.status,\n        childSpanCount: modelSpan.childSpanCount,\n    };\n    return apiSpan;\n}\nexports.modelToApiSpan = modelToApiSpan;\nfunction modelToApiStackTrace(frames) {\n    return { stackFrames: { frame: frames.map(modelToApiStackFrame) } };\n}\nfunction modelToApiStackFrame(frame) {\n    return {\n        functionName: truncatableOrUndefined(frame.functionName),\n        originalFunctionName: truncatableOrUndefined(frame.originalFunctionName),\n        fileName: truncatableOrUndefined(frame.fileName),\n        lineNumber: stringOrUndefined(frame.lineNumber),\n        columnNumber: stringOrUndefined(frame.columnNumber),\n        loadModule: frame.loadModule ? modelToApiModule(frame.loadModule) :\n            undefined,\n        sourceVersion: truncatableOrUndefined(frame.sourceVersion)\n    };\n}\nfunction modelToApiModule(module) {\n    return {\n        module: truncatableOrUndefined(module.module),\n        buildId: truncatableOrUndefined(module.buildId)\n    };\n}\nfunction truncatableOrUndefined(str) {\n    if (str === undefined)\n        return undefined;\n    return truncatableString(str);\n}\nfunction modelToApiEvents(annotations, messageEvents, baseTime) {\n    var annotationTimeEvents = annotations.map(function (a) { return modelToApiAnnotation(a, baseTime); });\n    var messageTimeEvents = messageEvents.map(function (m) { return modelToApiMessageEvent(m, baseTime); });\n    if (!annotationTimeEvents.length && !messageTimeEvents.length) {\n        return undefined;\n    }\n    return { timeEvent: annotationTimeEvents.concat(messageTimeEvents) };\n}\nfunction modelToApiMessageEvent(messageEvent, baseTime) {\n    return {\n        time: baseElapsedToIsoDate(baseTime, messageEvent.time),\n        messageEvent: {\n            type: messageEvent.type,\n            id: stringOrUndefined(messageEvent.id),\n            uncompressedSize: stringOrUndefined(messageEvent.uncompressedSize),\n            compressedSize: stringOrUndefined(messageEvent.compressedSize),\n        }\n    };\n}\nfunction stringOrUndefined(num) {\n    return num === undefined ? undefined : String(num);\n}\nfunction modelToApiAnnotation(annotation, baseTime) {\n    return {\n        time: baseElapsedToIsoDate(baseTime, annotation.time),\n        annotation: {\n            description: truncatableString(annotation.description),\n            attributes: modelToApiAttributes(annotation.attributes)\n        }\n    };\n}\nfunction modelToApiLinks(links) {\n    return {\n        link: links.map(function (l) {\n            return ({ type: l.type, attributes: modelToApiAttributes(l.attributes) });\n        })\n    };\n}\nfunction modelToApiAttributes(modelAttributes) {\n    if (modelAttributes === undefined)\n        return undefined;\n    var attributeMap = {};\n    for (var _i = 0, _a = Object.keys(modelAttributes); _i < _a.length; _i++) {\n        var key = _a[_i];\n        attributeMap[key] = modelToApiValue(modelAttributes[key]);\n    }\n    return { attributeMap: attributeMap };\n}\nfunction modelToApiValue(modelValue) {\n    var valType = typeof modelValue;\n    if (valType === 'boolean') {\n        return { boolValue: modelValue };\n    }\n    if (valType === 'number' && modelValue === Math.floor(modelValue)) {\n        return { intValue: String(modelValue) };\n    }\n    // String is the remaining case.\n    return { stringValue: truncatableString(String(modelValue)) };\n}\nfunction truncatableString(str) {\n    return { value: str };\n}\n// Converts a hex-encoded string to a base64-encoded string.\nfunction hexToBase64(hexStr) {\n    var hexStrLen = hexStr.length;\n    var hexAsciiCharsStr = '';\n    for (var i = 0; i < hexStrLen; i += 2) {\n        var hexPair = hexStr.substring(i, i + 2);\n        var hexVal = parseInt(hexPair, 16);\n        hexAsciiCharsStr += String.fromCharCode(hexVal);\n    }\n    return btoa(hexAsciiCharsStr);\n}\nexports.hexToBase64 = hexToBase64;\n// Generates a nanosecond precision ISO date string from a time time in epoch\n// milliseconds and an elapsed time in milliseconds, both of which may have\n// fractional parts.\nfunction baseElapsedToIsoDate(baseEpochMs, elapsedMs) {\n    // Break base and elapsed times into whole and fractional parts.\n    var _a = wholeAndFraction(baseEpochMs), baseWhole = _a[0], baseFrac = _a[1];\n    var _b = wholeAndFraction(elapsedMs), elapsedWhole = _b[0], elapsedFrac = _b[1];\n    // Combine the fractional and whole parts separately to preserve\n    // precision.\n    var totalFrac = baseFrac + elapsedFrac;\n    var _c = wholeAndFraction(totalFrac), extraWholeMs = _c[0], fracMs = _c[1];\n    var wholeMs = baseWhole + elapsedWhole + extraWholeMs;\n    // Use the native Date class to generate an ISO string for the whole\n    // millisecond portion.\n    var dateStrWholeMs = new Date(wholeMs).toISOString();\n    // Append the fractional millisecond portion for the final 6 digits\n    // after the seconds part.\n    var dateStrWithoutZ = dateStrWholeMs.substr(0, dateStrWholeMs.length - 1);\n    var millisFracStr = fracMs.toFixed(6).substring(2);\n    return \"\" + dateStrWithoutZ + millisFracStr + \"Z\";\n}\nexports.baseElapsedToIsoDate = baseElapsedToIsoDate;\n// Splits a number into whole and fractional parts, accurate to 9dp.\nfunction wholeAndFraction(num) {\n    var _a = num.toFixed(9).split('.'), wholeStr = _a[0], fracionStr = _a[1];\n    var whole = Number(wholeStr);\n    var fraction = Number(\"0.\" + fracionStr);\n    return [whole, fraction];\n}\n//# sourceMappingURL=api-span-formatter.js.map\n\n//# sourceURL=webpack:///./build/src/exporters/agent-gateway/api-span-formatter.js?");

/***/ }),

/***/ "./build/src/exporters/agent-gateway/index.js":
/*!****************************************************!*\
  !*** ./build/src/exporters/agent-gateway/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar api_span_formatter_1 = __webpack_require__(/*! ./api-span-formatter */ \"./build/src/exporters/agent-gateway/api-span-formatter.js\");\n// The value of XMLHttpRequest `readyState` property when the request is done.\nvar XHR_READY_STATE_DONE = 4;\nvar HTTP_SUCCESS_STATUS = 200;\nvar AgentGatewayExporter = /** @class */ (function () {\n    function AgentGatewayExporter(endpoint) {\n        this.endpoint = endpoint;\n    }\n    AgentGatewayExporter.prototype.exportSpans = function (spans) {\n        var request = { spans: spans.map(api_span_formatter_1.modelToApiSpan) };\n        var xhr = new XMLHttpRequest();\n        xhr.open('POST', this.endpoint);\n        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');\n        console.log(request);\n        var reqJson = JSON.stringify(request);\n        xhr.send(reqJson);\n        xhr.onreadystatechange = function () {\n            if (xhr.readyState !== XHR_READY_STATE_DONE)\n                return;\n            if (xhr.status !== HTTP_SUCCESS_STATUS) {\n                console.log(\"Error writing trace spans (HTTP status \" + xhr.status + \"):\");\n                console.log(xhr.responseText);\n            }\n        };\n    };\n    return AgentGatewayExporter;\n}());\nexports.AgentGatewayExporter = AgentGatewayExporter;\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./build/src/exporters/agent-gateway/index.js?");

/***/ }),

/***/ "./build/src/index.js":
/*!****************************!*\
  !*** ./build/src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar agent_gateway_1 = __webpack_require__(/*! ./exporters/agent-gateway */ \"./build/src/exporters/agent-gateway/index.js\");\nvar instrumentation_1 = __webpack_require__(/*! ./instrumentation */ \"./build/src/instrumentation/index.js\");\nvar export_1 = __webpack_require__(/*! ./trace/export */ \"./build/src/trace/export.js\");\nfunction startOpenCensusWeb() {\n    var windowWithConfig = window;\n    if (!windowWithConfig.openCensusConfig)\n        return;\n    var config = windowWithConfig.openCensusConfig;\n    if (!config.agentEndpoint)\n        return;\n    console.log('Starting OpenCensus web');\n    export_1.registerExporter(new agent_gateway_1.AgentGatewayExporter(config.agentEndpoint));\n    instrumentation_1.instrumentAll(config.navigationTraceId, config.navigationSpanId);\n}\nexports.startOpenCensusWeb = startOpenCensusWeb;\nstartOpenCensusWeb();\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./build/src/index.js?");

/***/ }),

/***/ "./build/src/instrumentation/index.js":
/*!********************************************!*\
  !*** ./build/src/instrumentation/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar initial_load_1 = __webpack_require__(/*! ./initial-load */ \"./build/src/instrumentation/initial-load/index.js\");\nvar perf_recorder_1 = __webpack_require__(/*! ./perf-recorder */ \"./build/src/instrumentation/perf-recorder.js\");\nfunction instrumentAll(navigationTraceId, navigationSpanId) {\n    perf_recorder_1.recordPerfEntries();\n    initial_load_1.instrumentInitialLoad(navigationTraceId, navigationSpanId);\n}\nexports.instrumentAll = instrumentAll;\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./build/src/instrumentation/index.js?");

/***/ }),

/***/ "./build/src/instrumentation/initial-load/index.js":
/*!*********************************************************!*\
  !*** ./build/src/instrumentation/initial-load/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar export_1 = __webpack_require__(/*! ../../trace/export */ \"./build/src/trace/export.js\");\nvar perf_recorder_1 = __webpack_require__(/*! ../perf-recorder */ \"./build/src/instrumentation/perf-recorder.js\");\nvar initial_load_spans_1 = __webpack_require__(/*! ./initial-load-spans */ \"./build/src/instrumentation/initial-load/initial-load-spans.js\");\n// How long to wait for DOMContentLoaded to create the initial load span.\nvar WAIT_TIME_AFTER_LOAD_MS = 2000;\nfunction instrumentInitialLoad(navigationTraceId, navigationSpanId) {\n    if (document.readyState === 'complete') {\n        exportInitialLoadSpans(navigationTraceId, navigationSpanId);\n    }\n    else {\n        window.addEventListener('load', function () {\n            exportInitialLoadSpans(navigationTraceId, navigationSpanId);\n        });\n    }\n}\nexports.instrumentInitialLoad = instrumentInitialLoad;\nvar initial_load_spans_2 = __webpack_require__(/*! ./initial-load-spans */ \"./build/src/instrumentation/initial-load/initial-load-spans.js\");\nexports.getInitialLoadSpans = initial_load_spans_2.getInitialLoadSpans;\nfunction exportInitialLoadSpans(navigationTraceId, navigationSpanId) {\n    setTimeout(function () {\n        export_1.exportSpans(initial_load_spans_1.getInitialLoadSpans(perf_recorder_1.getPerfEntries(), navigationTraceId, navigationSpanId));\n        perf_recorder_1.clearPerfEntries();\n    }, WAIT_TIME_AFTER_LOAD_MS);\n}\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./build/src/instrumentation/initial-load/index.js?");

/***/ }),

/***/ "./build/src/instrumentation/initial-load/initial-load-spans.js":
/*!**********************************************************************!*\
  !*** ./build/src/instrumentation/initial-load/initial-load-spans.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar types_1 = __webpack_require__(/*! ../../trace/types */ \"./build/src/trace/types.js\");\nvar util_1 = __webpack_require__(/*! ../../trace/util */ \"./build/src/trace/util.js\");\nvar PERFORMANCE_ENTRY_EVENTS = [\n    'fetchStart',\n    'domainLookupStart',\n    'domainLookupEnd',\n    'connectStart',\n    'connectEnd',\n    'secureConnectionStart',\n    'redirectStart',\n    'redirectEnd',\n    'requestStart',\n    'responseStart',\n    'responseEnd',\n];\n// These are properties of PerformanceNavigationTiming that will be turned into\n// span annotations on the navigation span.\nvar NAVIGATION_TIMING_EVENTS = PERFORMANCE_ENTRY_EVENTS.concat([\n    'domLoading',\n    'domInteractive',\n    'domContentLoaded',\n    'domComplete',\n    'loadEventStart',\n    'loadEventEnd',\n    'unloadEventStart',\n    'unloadEventEnd',\n]);\nvar RESOURCE_TIMING_ATTRS = ['decodedBodySize', 'encodedBodySize', 'transferSize', 'nextHopProtocol'];\nvar NAVIGATION_TIMING_ATTRS = RESOURCE_TIMING_ATTRS.concat(['redirectCount', 'type']);\nfunction getInitialLoadSpans(perfEntries, navigationTraceId, navigationSpanId) {\n    console.log(perfEntries);\n    var trace = new types_1.Trace(perfEntries.timeOrigin);\n    var navigationSpan = getNavigationSpan(perfEntries, trace);\n    // TODO:\n    // - initial page load needs to be a separate span\n    // - the sameProcessAsParentSpan should be set to true for everything\n    // - add annotations for the resource timing spans\n    // - add in the mark/measure spans (exclude the Zone ones, but make this\n    //   configurable)\n    // Next big step is deploying it\n    // Create spans for the resource loads\n    var resourceSpans = perfEntries.resourceTimings.map(function (resourceTiming) { return getResourceSpan(resourceTiming, trace, navigationSpan.spanContext.spanId); });\n    // Create spans for the long tasks\n    var longTaskSpans = perfEntries.longTasks.map(function (longTask) {\n        return getLongTaskSpan(longTask, trace, navigationSpan.spanContext.spanId);\n    });\n    var spans = [navigationSpan].concat(resourceSpans, longTaskSpans);\n    console.log(spans);\n    return spans;\n}\nexports.getInitialLoadSpans = getInitialLoadSpans;\nfunction getResourceSpan(resourceTiming, trace, parentSpanId) {\n    var spanContext = { trace: trace, spanId: util_1.randomSpanId(), isSampled: true };\n    var name = getNamePrefix(resourceTiming) + \".\" + resourceTiming.name;\n    var span = new types_1.Span(spanContext, name, resourceTiming.startTime);\n    span.parentSpanId = parentSpanId;\n    span.endTime = resourceTiming.responseEnd;\n    span.attributes = getAttributes(resourceTiming, RESOURCE_TIMING_ATTRS);\n    return span;\n}\nfunction getLongTaskSpan(longTask, trace, parentSpanId) {\n    var spanContext = { trace: trace, spanId: util_1.randomSpanId(), isSampled: true };\n    var name = 'Long JS task';\n    var span = new types_1.Span(spanContext, name, longTask.startTime);\n    span.parentSpanId = parentSpanId;\n    span.endTime = longTask.startTime + longTask.duration;\n    return span;\n}\nfunction getNamePrefix(resourceTiming) {\n    var initiator = resourceTiming.initiatorType;\n    if (initiator === 'xmlhttprequest')\n        return 'Xhr';\n    if (initiator === '')\n        return 'NavRes';\n    return titleCased(initiator);\n}\nfunction titleCased(str) {\n    return str[0].toUpperCase() + str.substring(1);\n}\nfunction getNavigationSpan(perfEntries, trace) {\n    var lastResourceEnd = Math.max.apply(Math, perfEntries.resourceTimings.map(function (t) { return t.responseEnd; }));\n    var spanContext = { trace: trace, spanId: util_1.randomSpanId(), isSampled: true };\n    var navigationName = perfEntries.navigationTiming ?\n        perfEntries.navigationTiming.name :\n        location.href;\n    var navigationSpan = new types_1.Span(spanContext, \"Nav.\" + navigationName, 0);\n    navigationSpan.endTime = lastResourceEnd;\n    navigationSpan.annotations = getNavigationAnnotations(perfEntries);\n    navigationSpan.attributes = getNavigationAttributes(perfEntries);\n    return navigationSpan;\n}\nfunction getNavigationAnnotations(perfEntries) {\n    var navigation = perfEntries.navigationTiming;\n    if (!navigation)\n        return [];\n    var navAnnotations = getAnnotations(navigation, NAVIGATION_TIMING_EVENTS);\n    var firstPaint = perfEntries.firstPaint;\n    if (firstPaint && firstPaint.startTime) {\n        navAnnotations.push({ time: firstPaint.startTime, description: 'firstPaint' });\n    }\n    var firstContentfulPaint = perfEntries.firstContentfulPaint;\n    if (firstContentfulPaint && firstContentfulPaint.startTime) {\n        navAnnotations.push({\n            time: firstContentfulPaint.startTime,\n            description: 'firstContentfulPaint'\n        });\n    }\n    return navAnnotations;\n}\nfunction getAnnotations(perfEntry, annotationsFields) {\n    var annotations = [];\n    for (var _i = 0, NAVIGATION_TIMING_EVENTS_1 = NAVIGATION_TIMING_EVENTS; _i < NAVIGATION_TIMING_EVENTS_1.length; _i++) {\n        var annotationField = NAVIGATION_TIMING_EVENTS_1[_i];\n        var maybeTime = \n        // tslint:disable:no-any Cast to enable index signature\n        perfEntry[annotationField];\n        if (maybeTime) {\n            annotations.push({ time: maybeTime, description: annotationField });\n        }\n    }\n    return annotations;\n}\nfunction getNavigationAttributes(perfEntries) {\n    var navigation = perfEntries.navigationTiming;\n    if (!navigation)\n        return {};\n    return getAttributes(navigation, NAVIGATION_TIMING_ATTRS);\n}\nfunction getAttributes(perfEntry, attrFields) {\n    var attrs = {};\n    for (var _i = 0, attrFields_1 = attrFields; _i < attrFields_1.length; _i++) {\n        var attrField = attrFields_1[_i];\n        // tslint:disable:no-any Cast to enable index signature\n        var maybeValue = (perfEntry[attrField]);\n        if (maybeValue) {\n            attrs[attrField] = maybeValue;\n        }\n    }\n    return attrs;\n}\n//# sourceMappingURL=initial-load-spans.js.map\n\n//# sourceURL=webpack:///./build/src/instrumentation/initial-load/initial-load-spans.js?");

/***/ }),

/***/ "./build/src/instrumentation/perf-recorder.js":
/*!****************************************************!*\
  !*** ./build/src/instrumentation/perf-recorder.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n// Cast `window` to have PerformanceObserver.\nvar windowWithPerformance = window;\n// Store paint/longtask performance entries recorded with PerformanceObserver.\nvar longTasks = [];\n// How big to set the performance timing buffer.\nvar RESOURCE_TIMING_BUFFER_SIZE = 2000;\nfunction recordPerfEntries() {\n    if (!windowWithPerformance.performance)\n        return;\n    if (performance.setResourceTimingBufferSize) {\n        performance.setResourceTimingBufferSize(RESOURCE_TIMING_BUFFER_SIZE);\n    }\n    if (windowWithPerformance.PerformanceObserver) {\n        var longTaskObserver = new windowWithPerformance.PerformanceObserver(onLongTasks);\n        longTaskObserver.observe({ entryTypes: ['longtask'] });\n    }\n}\nexports.recordPerfEntries = recordPerfEntries;\nfunction onLongTasks(entryList) {\n    // These must be PerformanceLongTaskTiming objects because we only observe\n    // 'longtask' above.\n    longTasks.push.apply(longTasks, entryList.getEntries());\n}\nfunction getPerfEntries() {\n    if (!windowWithPerformance.performance) {\n        return {\n            timeOrigin: 0,\n            resourceTimings: [],\n            longTasks: [],\n            marks: [],\n            measures: []\n        };\n    }\n    var perf = windowWithPerformance.performance;\n    var entries = {\n        timeOrigin: getTimeOrigin(perf),\n        resourceTimings: perf.getEntriesByType('resource'),\n        marks: perf.getEntriesByType('mark'),\n        measures: perf.getEntriesByType('measure'),\n        longTasks: longTasks.slice(),\n    };\n    var navEntries = perf.getEntriesByType('navigation');\n    if (navEntries.length)\n        entries.navigationTiming = navEntries[0];\n    var paintEntries = perf.getEntriesByType('paint');\n    for (var _i = 0, paintEntries_1 = paintEntries; _i < paintEntries_1.length; _i++) {\n        var paintEntry = paintEntries_1[_i];\n        if (paintEntry.name === 'first-paint') {\n            entries.firstPaint = paintEntry;\n        }\n        else if (paintEntry.name === 'first-contentful-paint') {\n            entries.firstContentfulPaint = paintEntry;\n        }\n    }\n    return entries;\n}\nexports.getPerfEntries = getPerfEntries;\nfunction clearPerfEntries() {\n    if (!windowWithPerformance.performance)\n        return;\n    longTasks.length = 0;\n    windowWithPerformance.performance.clearResourceTimings();\n    windowWithPerformance.performance.clearMarks();\n    windowWithPerformance.performance.clearMeasures();\n}\nexports.clearPerfEntries = clearPerfEntries;\nfunction getTimeOrigin(perf) {\n    if (perf.timeOrigin)\n        return perf.timeOrigin;\n    return new Date().getTime() - perf.now();\n}\nexports.getTimeOrigin = getTimeOrigin;\n//# sourceMappingURL=perf-recorder.js.map\n\n//# sourceURL=webpack:///./build/src/instrumentation/perf-recorder.js?");

/***/ }),

/***/ "./build/src/trace/export.js":
/*!***********************************!*\
  !*** ./build/src/trace/export.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar exporters = [];\nfunction registerExporter(exporter) {\n    exporters.push(exporter);\n}\nexports.registerExporter = registerExporter;\nfunction unregisterExporter(exporter) {\n    var index = exporters.indexOf(exporter);\n    if (index > 0)\n        exporters.splice(index, 1);\n}\nexports.unregisterExporter = unregisterExporter;\nfunction exportSpans(spans) {\n    for (var _i = 0, exporters_1 = exporters; _i < exporters_1.length; _i++) {\n        var exporter = exporters_1[_i];\n        exporter.exportSpans(spans);\n    }\n}\nexports.exportSpans = exportSpans;\n//# sourceMappingURL=export.js.map\n\n//# sourceURL=webpack:///./build/src/trace/export.js?");

/***/ }),

/***/ "./build/src/trace/types.js":
/*!**********************************!*\
  !*** ./build/src/trace/types.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar util_1 = __webpack_require__(/*! ./util */ \"./build/src/trace/util.js\");\nvar Trace = /** @class */ (function () {\n    /**\n     * @param {baseTime} Base timestamp of the trace. This is in milliseconds\n     *     since Unix epoch.\n     * @param {traceId} A unique identifier for a trace. All spans from the same\n     *    trace share the same `trace_id`. The ID is a 16-byte array encoded as a\n     * hex string. This field is required.\n     */\n    function Trace(baseTime, traceId) {\n        if (traceId === void 0) { traceId = util_1.randomTraceId(); }\n        this.baseTime = baseTime;\n        this.traceId = traceId;\n    }\n    return Trace;\n}());\nexports.Trace = Trace;\n/**\n * A span represents a single operation within a trace. Spans can be nested to\n * form a trace tree. Often, a trace contains a root span that describes the\n * end-to-end latency, and one or more subspans for its sub-operations. A trace\n * can also contain multiple root spans, or none at all. Spans do not need to be\n * contiguous - there may be gaps or overlaps between spans in a trace.\n */\nvar Span = /** @class */ (function () {\n    /**\n     * @param {name} A description of the span's operation.  For example, the name\n     *     can be a qualified method name or a file name and a line number where\n     *     the operation is called. A best practice is to use the same display\n     *     name at the same call point in an application. This makes it easier to\n     *     correlate spans in different traces.  This field is required.\n     * @param {startTime} The start time of the span. On the client side, this is\n     *     the time kept by the local machine where the span execution starts. On\n     *     the server side, this is the time when the server's application handler\n     *     starts running. This is in milliseconds since the `baseTime` of the\n     *     associated Trace.\n     */\n    function Span(spanContext, name, startTime) {\n        this.spanContext = spanContext;\n        this.name = name;\n        this.startTime = startTime;\n    }\n    return Span;\n}());\nexports.Span = Span;\n/**\n * The relationship of the current span relative to the linked span: child,\n * parent, or unspecified.   - TYPE_UNSPECIFIED: The relationship of the two\n * spans is unknown, or known but other than parent-child.  - CHILD_LINKED_SPAN:\n * The linked span is a child of the current span.  - PARENT_LINKED_SPAN: The\n * linked span is a parent of the current span.\n */\nvar SpanLinkType;\n(function (SpanLinkType) {\n    SpanLinkType[\"Unspecified\"] = \"TYPE_UNSPECIFIED\";\n    SpanLinkType[\"Child\"] = \"CHILD_LINKED_SPAN\";\n    SpanLinkType[\"Parent\"] = \"PARENT_LINKED_SPAN\";\n})(SpanLinkType = exports.SpanLinkType || (exports.SpanLinkType = {}));\n/**\n * Type of span. Can be used to specify additional relationships between spans\n * in addition to a parent/child relationship.   - SPAN_KIND_UNSPECIFIED:\n * Unspecified.  - SERVER: Indicates that the span covers server-side handling\n * of an RPC or other remote network request.  - CLIENT: Indicates that the span\n * covers the client-side wrapper around an RPC or other remote request.\n */\nvar SpanKind;\n(function (SpanKind) {\n    SpanKind[\"Unspecified\"] = \"SPAN_KIND_UNSPECIFIED\";\n    SpanKind[\"Server\"] = \"SERVER\";\n    SpanKind[\"Client\"] = \"CLIENT\";\n})(SpanKind = exports.SpanKind || (exports.SpanKind = {}));\n/**\n * Indicates whether the message was sent or received.   - TYPE_UNSPECIFIED:\n * Unknown event type.  - SENT: Indicates a sent message.  - RECEIVED: Indicates\n * a received message.\n */\nvar MessageEventType;\n(function (MessageEventType) {\n    MessageEventType[\"Unspecified\"] = \"TYPE_UNSPECIFIED\";\n    MessageEventType[\"Sent\"] = \"SENT\";\n    MessageEventType[\"Received\"] = \"RECEIVED\";\n})(MessageEventType = exports.MessageEventType || (exports.MessageEventType = {}));\n//# sourceMappingURL=types.js.map\n\n//# sourceURL=webpack:///./build/src/trace/types.js?");

/***/ }),

/***/ "./build/src/trace/util.js":
/*!*********************************!*\
  !*** ./build/src/trace/util.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar SPAN_ID_BYTES = 8;\nfunction randomTraceId() {\n    return randomSpanId() + randomSpanId();\n}\nexports.randomTraceId = randomTraceId;\nfunction randomSpanId() {\n    var crypto = window.crypto || window.msCrypto;\n    if (crypto) {\n        var spanId = '';\n        var randomBytes = new Uint8Array(SPAN_ID_BYTES);\n        crypto.getRandomValues(randomBytes);\n        for (var i = 0; i < SPAN_ID_BYTES; i++) {\n            spanId += zeroPad(randomBytes[i].toString(16), 2);\n        }\n        return spanId;\n    }\n    else {\n        return mathRand32Hex() + mathRand32Hex();\n    }\n}\nexports.randomSpanId = randomSpanId;\nfunction mathRand32Hex() {\n    return zeroPad(((1 << 30) * Math.random()).toString(16), 8);\n}\nexports.mathRand32Hex = mathRand32Hex;\nfunction zeroPad(str, targetLen) {\n    var padLen = targetLen - str.length;\n    var padding = '';\n    for (var i = 0; i < padLen; i++) {\n        padding += '0';\n    }\n    return padding + str;\n}\nexports.zeroPad = zeroPad;\n//# sourceMappingURL=util.js.map\n\n//# sourceURL=webpack:///./build/src/trace/util.js?");

/***/ })

/******/ });