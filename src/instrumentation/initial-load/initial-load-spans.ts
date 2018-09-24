import {Annotation, Attributes, Span, SpanId, Trace} from '../../trace/types';
import {randomSpanId} from '../../trace/util';
import {GroupedPerfEntries} from '../perf-recorder';
import {PerformanceEntryIndex, PerformanceLongTaskTiming} from '../perf-types';

const PERFORMANCE_ENTRY_EVENTS: string[] = [
  'fetchStart',
  'domainLookupStart',
  'domainLookupEnd',
  'connectStart',
  'connectEnd',
  'secureConnectionStart',
  'redirectStart',
  'redirectEnd',
  'requestStart',
  'responseStart',
  'responseEnd',
];

// These are properties of PerformanceNavigationTiming that will be turned into
// span annotations on the navigation span.
const NAVIGATION_TIMING_EVENTS: string[] = [
  ...PERFORMANCE_ENTRY_EVENTS,
  'domLoading',
  'domInteractive',
  'domContentLoaded',
  'domComplete',
  'loadEventStart',
  'loadEventEnd',
  'unloadEventStart',
  'unloadEventEnd',
];

const RESOURCE_TIMING_ATTRS: string[] =
    ['decodedBodySize', 'encodedBodySize', 'transferSize', 'nextHopProtocol'];

const NAVIGATION_TIMING_ATTRS: string[] =
    [...RESOURCE_TIMING_ATTRS, 'redirectCount', 'type'];

export function getInitialLoadSpans(
    perfEntries: GroupedPerfEntries, navigationTraceId: string|undefined,
    navigationSpanId: string|undefined): Span[] {
  console.log(perfEntries);
  const trace = new Trace(perfEntries.timeOrigin);

  const navigationSpan = getNavigationSpan(perfEntries, trace);

  // TODO:
  // - initial page load needs to be a separate span
  // - the sameProcessAsParentSpan should be set to true for everything
  // - add annotations for the resource timing spans
  // - add in the mark/measure spans (exclude the Zone ones, but make this
  //   configurable)


  // Next big step is deploying it

  // Create spans for the resource loads
  const resourceSpans = perfEntries.resourceTimings.map(
      (resourceTiming) => getResourceSpan(
          resourceTiming, trace, navigationSpan.spanContext.spanId));

  // Create spans for the long tasks
  const longTaskSpans = perfEntries.longTasks.map(
      (longTask) =>
          getLongTaskSpan(longTask, trace, navigationSpan.spanContext.spanId));

  const spans = [navigationSpan, ...resourceSpans, ...longTaskSpans];
  console.log(spans);
  return spans;
}

function getResourceSpan(
    resourceTiming: PerformanceResourceTiming, trace: Trace,
    parentSpanId: SpanId): Span {
  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const name = `${getNamePrefix(resourceTiming)}.${resourceTiming.name}`;
  const span = new Span(spanContext, name, resourceTiming.startTime);
  span.parentSpanId = parentSpanId;
  span.endTime = resourceTiming.responseEnd;
  span.attributes = getAttributes(resourceTiming, RESOURCE_TIMING_ATTRS);
  return span;
}

function getLongTaskSpan(
    longTask: PerformanceLongTaskTiming, trace: Trace,
    parentSpanId: SpanId): Span {
  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const name = 'Long JS task';
  const span = new Span(spanContext, name, longTask.startTime);
  span.parentSpanId = parentSpanId;
  span.endTime = longTask.startTime + longTask.duration;
  return span;
}

function getNamePrefix(resourceTiming: PerformanceResourceTiming): string {
  const initiator = resourceTiming.initiatorType;
  if (initiator === 'xmlhttprequest') return 'Xhr';
  if (initiator === '') return 'NavRes';
  return titleCased(initiator);
}

function titleCased(str: string): string {
  return str[0].toUpperCase() + str.substring(1);
}

function getNavigationSpan(
    perfEntries: GroupedPerfEntries, trace: Trace): Span {
  const lastResourceEnd =
      Math.max(...perfEntries.resourceTimings.map((t) => t.responseEnd));

  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const navigationName = perfEntries.navigationTiming ?
      perfEntries.navigationTiming.name :
      location.href;
  const navigationSpan = new Span(spanContext, `Nav.${navigationName}`, 0);
  navigationSpan.endTime = lastResourceEnd;
  navigationSpan.annotations = getNavigationAnnotations(perfEntries);
  navigationSpan.attributes = getNavigationAttributes(perfEntries);

  return navigationSpan;
}

function getNavigationAnnotations(perfEntries: GroupedPerfEntries):
    Annotation[] {
  const navigation = perfEntries.navigationTiming;
  if (!navigation) return [];

  const navAnnotations = getAnnotations(navigation, NAVIGATION_TIMING_EVENTS);

  const firstPaint = perfEntries.firstPaint;
  if (firstPaint && firstPaint.startTime) {
    navAnnotations.push(
        {time: firstPaint.startTime, description: 'firstPaint'});
  }
  const firstContentfulPaint = perfEntries.firstContentfulPaint;
  if (firstContentfulPaint && firstContentfulPaint.startTime) {
    navAnnotations.push({
      time: firstContentfulPaint.startTime,
      description: 'firstContentfulPaint'
    });
  }

  return navAnnotations;
}

function getAnnotations(
    perfEntry: PerformanceEntry, annotationsFields: string[]): Annotation[] {
  const annotations: Annotation[] = [];
  for (const annotationField of NAVIGATION_TIMING_EVENTS) {
    const maybeTime =
        // tslint:disable:no-any Cast to enable index signature
        (perfEntry as any as PerformanceEntryIndex)[annotationField] as number |
        undefined;
    if (maybeTime) {
      annotations.push({time: maybeTime, description: annotationField});
    }
  }
  return annotations;
}

function getNavigationAttributes(perfEntries: GroupedPerfEntries): Attributes {
  const navigation = perfEntries.navigationTiming;
  if (!navigation) return {};
  return getAttributes(navigation, NAVIGATION_TIMING_ATTRS);
}

function getAttributes(
    perfEntry: PerformanceEntry, attrFields: string[]): Attributes {
  const attrs: Attributes = {};
  for (const attrField of attrFields) {
    // tslint:disable:no-any Cast to enable index signature
    const maybeValue =
        ((perfEntry as any as PerformanceEntryIndex)[attrField]) as string |
        number | undefined;
    if (maybeValue) {
      attrs[attrField] = maybeValue;
    }
  }
  return attrs;
}
