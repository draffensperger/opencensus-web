import {Annotation, Attributes, Span, Trace} from '../../trace/types';
import {randomSpanId} from '../../trace/util';
import {GroupedPerfEntries} from '../perf-recorder';

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
  const navigationSpan = getNavigationSpan(perfEntries);

  return [navigationSpan];
}

function getNavigationSpan(perfEntries: GroupedPerfEntries): Span {
  const lastResourceEnd =
      Math.max(...perfEntries.resourceTimings.map((t) => t.responseEnd));

  const trace = new Trace(perfEntries.timeOrigin);

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

  const navAnnotations = [];
  for (const annotationField of NAVIGATION_TIMING_EVENTS) {
    const maybeTime = navigation[annotationField] as number | undefined;
    if (maybeTime) {
      navAnnotations.push({time: maybeTime, description: annotationField});
    }
  }

  return navAnnotations;
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
