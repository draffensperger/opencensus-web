import {NavigationConfig} from '../..';
import {Annotation, Attributes, Span, SpanId, Trace, TraceId} from '../../trace/types';
import {randomSpanId} from '../../trace/util';
import {GroupedPerfEntries} from '../perf-recorder';
import {PerformanceEntryIndex, PerformanceLongTaskTiming, PerformanceNavigationTimingExtended} from '../perf-types';

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
    perfEntries: GroupedPerfEntries,
    navigationConfig: NavigationConfig|undefined): Span[] {
  console.log(perfEntries);

  const timeOrigin = calcTimeOrigin(
      perfEntries.timeOrigin, perfEntries.navigationTiming, navigationConfig);
  const trace = new Trace(timeOrigin);
  if (navigationConfig && navigationConfig.traceId) {
    trace.traceId = navigationConfig.traceId as TraceId;
  }

  const navigationParentSpanId =
      navigationConfig && navigationConfig.parentSpanId ?
      navigationConfig.parentSpanId :
      undefined;
  const navigationSpans =
      getNavigationSpans(perfEntries, trace, navigationParentSpanId);

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
          resourceTiming, trace, navigationSpans[0].spanContext.spanId));

  // Create spans for the long tasks
  const longTaskSpans = perfEntries.longTasks.map(
      (longTask) => getLongTaskSpan(
          longTask, trace, navigationSpans[0].spanContext.spanId));

  const spans = [...navigationSpans, ...resourceSpans, ...longTaskSpans];
  console.log(spans);
  return spans;
}

function calcTimeOrigin(
    perfTimeOrigin: number,
    navigationTiming: PerformanceNavigationTimingExtended|undefined,
    navigationConfig: NavigationConfig|undefined): number {
  if (!navigationConfig || !navigationConfig.start ||
      !navigationConfig.elapsed || !navigationTiming ||
      !navigationTiming.requestStart || !navigationTiming.responseStart) {
    // Not enough data, so just use perf time origin.
    console.log('Not enough navigation timing to calc origin');
    return perfTimeOrigin;
  }

  const clientStart = navigationTiming.requestStart;
  const clientEnd = navigationTiming.responseStart;

  const serverElapsed = navigationConfig.elapsed;
  const clientElapsed = clientEnd - clientStart;

  if (serverElapsed > clientElapsed) {
    // Server time is more than client time, which we don't expect, so just use
    // default time origin.
    console.log('Server time is more than client time');
    return perfTimeOrigin;
  }

  const networkTime = clientElapsed - serverElapsed;
  console.log(`Network time: ${networkTime}`);
  const halfNetworkTime = networkTime / 2;

  const clientStartInServerTime = navigationConfig.start - halfNetworkTime;

  const perfTimeOriginInServerTime = clientStartInServerTime - clientStart;
  return perfTimeOriginInServerTime;
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

function getNavigationSpans(
    perfEntries: GroupedPerfEntries, trace: Trace,
    navigationParentSpanId: string|undefined): Span[] {
  const lastResourceEnd =
      Math.max(...perfEntries.resourceTimings.map((t) => t.responseEnd));
  const navigationTiming = perfEntries.navigationTiming;
  if (!navigationTiming) return [];
  const loadEventEnd =
      navigationTiming.loadEventEnd ? navigationTiming.loadEventEnd : 0;
  const overallNavigationEnd = Math.max(lastResourceEnd, loadEventEnd);

  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const navigationName = perfEntries.navigationTiming ?
      perfEntries.navigationTiming.name :
      location.href;
  const overallNavigationSpan =
      new Span(spanContext, `Nav.${navigationName}`, 0);
  overallNavigationSpan.endTime = overallNavigationEnd;
  overallNavigationSpan.annotations = getNavigationAnnotations(perfEntries);
  overallNavigationSpan.attributes = getNavigationAttributes(perfEntries);

  const initialLoadSpanContext = {
    trace,
    spanId: randomSpanId(),
    isSampled: true
  };
  if (navigationParentSpanId) {
    initialLoadSpanContext.spanId = navigationParentSpanId;
  }
  const initialLoadSpan = new Span(
      initialLoadSpanContext, `Load.${navigationName}`,
      navigationTiming.fetchStart);
  initialLoadSpan.endTime = navigationTiming.responseEnd;
  initialLoadSpan.parentSpanId = overallNavigationSpan.spanContext.spanId;
  initialLoadSpan.attributes =
      getAttributes(navigationTiming, RESOURCE_TIMING_ATTRS);
  initialLoadSpan.annotations =
      getAnnotations(navigationTiming, PERFORMANCE_ENTRY_EVENTS);

  return [overallNavigationSpan, initialLoadSpan];
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
  for (const annotationField of annotationsFields) {
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
