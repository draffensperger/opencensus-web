import {Annotation, Attributes, Span, SpanId, Trace} from '../../trace/types';
import {randomSpanId} from '../../trace/util';
import {GroupedPerfEntries} from '../perf-recorder';
import {PerformanceEntryIndex} from '../perf-types';

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

const NAVIAGATION_TIMING_ATTRS: string[] = [
  'decodedBodySize', 'encodedBodySize', 'nextHopProtocol', 'redirectCount',
  'type'
];


export function getInitialLoadSpans(perfEntries: GroupedPerfEntries): Span[] {
  const trace = new Trace(perfEntries.timeOrigin);

  const navigationSpan = getNavigationSpan(perfEntries, trace);

  // Create spans for the resource loads
  const resourceSpans = perfEntries.resourceTimings.map(
      (resourceTiming) => getResourceSpan(
          resourceTiming, trace, navigationSpan.spanContext.spanId));

  // Create spans for the long tasks

  return [navigationSpan, ...resourceSpans];
}

function getResourceSpan(
    resourceTiming: PerformanceResourceTiming, trace: Trace,
    parentSpanId: SpanId): Span {
  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const name = `${getNamePrefix(resourceTiming)}.${resourceTiming.name}`;
  const span = new Span(spanContext, name, resourceTiming.startTime);
  span.parentSpanId = parentSpanId;
  span.endTime = resourceTiming.responseEnd;
  return span;
}

function getNamePrefix(resourceTiming: PerformanceResourceTiming): string {
  if (resourceTiming.initiatorType === 'xmlhttprequest') return 'Xhr';
  return titleCased(resourceTiming.initiatorType);
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
        // tslint:disable:no-any
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

  const navigationAttrs: Attributes = {};
  for (const attrField of NAVIAGATION_TIMING_ATTRS) {
    const maybeValue = (navigation[attrField]) as string | number;
    if (maybeValue) {
      navigationAttrs[attrField] = maybeValue;
    }
  }
  return navigationAttrs;
}
