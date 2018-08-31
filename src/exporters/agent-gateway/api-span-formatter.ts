import * as modelTypes from '../../trace/types';
import * as apiTypes from './api-span-types';

export function modelToApiSpan(modelSpan: modelTypes.Span): apiTypes.Span {
  const spanContext = modelSpan.spanContext;
  const trace = spanContext.trace;
  const baseTime = trace.baseTime;

  const apiSpan: apiTypes.Span = {
    traceId: hexToBase64(trace.traceId),
    spanId: hexToBase64(spanContext.spanId),
    tracestate: spanContext.tracestate,
    parentSpanId: modelSpan.parentSpanId === undefined ?
        undefined :
        hexToBase64(modelSpan.parentSpanId),
    name: truncatableString(modelSpan.name),
    kind: modelSpan.kind,
    startTime: baseElapsedToIsoDate(trace.baseTime, modelSpan.startTime),
    endTime: modelSpan.endTime === undefined ?
        undefined :
        baseElapsedToIsoDate(trace.baseTime, modelSpan.endTime),
    attributes: modelToApiAttributes(modelSpan.attributes),
    stackTrace:
        modelSpan.stackTrace && modelToApiStackTrace(modelSpan.stackTrace),
    timeEvents: modelToApiEvents(
        modelSpan.annotations || [], modelSpan.messageEvents || [], baseTime),
    links: modelSpan.links && modelToApiLinks(modelSpan.links),
    status: modelSpan.status,
    childSpanCount: modelSpan.childSpanCount,
  };
  return apiSpan;
}

function modelToApiStackTrace(frames: modelTypes.StackFrame[]):
    apiTypes.StackTrace {
  return {stackFrames: {frame: frames.map(modelToApiStackFrame)}};
}

function modelToApiStackFrame(frame: modelTypes.StackFrame):
    apiTypes.StackFrame {
  return {
    functionName: truncatableOrUndefined(frame.functionName),
    originalFunctionName: truncatableOrUndefined(frame.originalFunctionName),
    fileName: truncatableOrUndefined(frame.fileName),
    lineNumber: stringOrUndefined(frame.lineNumber),
    columnNumber: stringOrUndefined(frame.columnNumber),
    loadModule: frame.loadModule ? modelToApiModule(frame.loadModule) :
                                   undefined,
    sourceVersion: truncatableOrUndefined(frame.sourceVersion)
  };
}

function modelToApiModule(module: modelTypes.Module): apiTypes.Module {
  return {
    module: truncatableOrUndefined(module.module),
    buildId: truncatableOrUndefined(module.buildId)
  };
}

function truncatableOrUndefined(str: string|undefined):
    apiTypes.TruncatableString|undefined {
  if (str === undefined) return undefined;
  return truncatableString(str);
}

function modelToApiEvents(
    annotations: modelTypes.Annotation[],
    messageEvents: modelTypes.MessageEvent[],
    baseTime: number): apiTypes.TimeEvents|undefined {
  const annotationTimeEvents: apiTypes.TimeEvent[] =
      annotations.map((a) => modelToApiAnnotation(a, baseTime));
  const messageTimeEvents: apiTypes.TimeEvent[] =
      messageEvents.map((m) => modelToApiMessageEvent(m, baseTime));
  if (!annotationTimeEvents.length && !messageTimeEvents.length) {
    return undefined;
  }
  return {timeEvent: annotationTimeEvents.concat(messageTimeEvents)};
}

function modelToApiMessageEvent(
    messageEvent: modelTypes.MessageEvent,
    baseTime: number): apiTypes.TimeEvent {
  return {
    time: baseElapsedToIsoDate(baseTime, messageEvent.time),
    messageEvent: {
      type: messageEvent.type,
      id: stringOrUndefined(messageEvent.id),
      uncompressedSize: stringOrUndefined(messageEvent.uncompressedSize),
      compressedSize: stringOrUndefined(messageEvent.compressedSize),
    }
  };
}

function stringOrUndefined(num: number|undefined): string|undefined {
  return num === undefined ? undefined : String(num);
}

function modelToApiAnnotation(
    annotation: modelTypes.Annotation, baseTime: number): apiTypes.TimeEvent {
  return {
    time: baseElapsedToIsoDate(baseTime, annotation.time),
    annotation: {
      description: truncatableString(annotation.description),
      attributes: modelToApiAttributes(annotation.attributes)
    }
  };
}

function modelToApiLinks(links: modelTypes.SpanLink[]): apiTypes.SpanLinks {
  return {
    link: links.map(
        (l) =>
            ({type: l.type, attributes: modelToApiAttributes(l.attributes)} as
             apiTypes.SpanLink))
  };
}

function modelToApiAttributes(modelAttributes: modelTypes.Attributes|
                              undefined): apiTypes.Attributes|undefined {
  if (modelAttributes === undefined) return undefined;
  const attributeMap: apiTypes.AttributeMap = {};
  for (const key of Object.keys(modelAttributes)) {
    attributeMap[key] = modelToApiValue(modelAttributes[key]);
  }
  return {attributeMap};
}

function modelToApiValue(modelValue: boolean|string|
                         number): apiTypes.AttributeValue {
  const valType = typeof modelValue;
  if (valType === 'boolean') {
    return {boolValue: modelValue as boolean};
  }
  if (valType === 'number' && modelValue === Math.floor(modelValue as number)) {
    return {intValue: String(modelValue)};
  }
  // String is the remaining case.
  return {stringValue: truncatableString(String(modelValue))};
}

function truncatableString(str: string): apiTypes.TruncatableString {
  return {value: str};
}

// Converts a hex-encoded string to a base64-encoded string.
export function hexToBase64(hexStr: string): string {
  const hexStrLen = hexStr.length;
  let hexAsciiCharsStr = '';
  for (let i = 0; i < hexStrLen; i += 2) {
    const hexPair = hexStr.substring(i, i + 2);
    const hexVal = parseInt(hexPair, 16);
    hexAsciiCharsStr += String.fromCharCode(hexVal);
  }
  return btoa(hexAsciiCharsStr);
}

// Generates a nanosecond precision ISO date string from a time time in epoch
// milliseconds and an elapsed time in milliseconds, both of which may have
// fractional parts.
export function baseElapsedToIsoDate(
    baseEpochMs: number, elapsedMs: number): string {
  // Break base and elapsed times into whole and fractional parts.
  const [baseWhole, baseFrac] = wholeAndFraction(baseEpochMs);
  const [elapsedWhole, elapsedFrac] = wholeAndFraction(elapsedMs);

  // Combine the fractional and whole parts separately to preserve
  // precision.
  const totalFrac = baseFrac + elapsedFrac;
  const [extraWholeMs, fracMs] = wholeAndFraction(totalFrac);
  const wholeMs = baseWhole + elapsedWhole + extraWholeMs;

  // Use the native Date class to generate an ISO string for the whole
  // millisecond portion.
  const dateStrWholeMs = new Date(wholeMs).toISOString();

  // Append the fractional millisecond portion for the final 6 digits
  // after the seconds part.
  const dateStrWithoutZ = dateStrWholeMs.substr(0, dateStrWholeMs.length - 1);
  const millisFracStr = fracMs.toFixed(6).substring(2);
  return `${dateStrWithoutZ}${millisFracStr}Z`;
}

// Splits a number into whole and fractional parts, accurate to 9dp.
function wholeAndFraction(num: number): [number, number] {
  const [wholeStr, fracionStr] = num.toFixed(9).split('.');
  const whole = Number(wholeStr);
  const fraction = Number(`0.${fracionStr}`);
  return [whole, fraction];
}
