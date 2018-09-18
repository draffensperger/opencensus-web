import {PerformanceLongTaskTiming, PerformanceNavigationTimingExtended, PerformanceObserverEntryList, PerformancePaintTiming, WindowWithPerformance} from './perf-types';

// Cast `window` to have PerformanceObserver.
const windowWithPerformance = window as WindowWithPerformance;

// Store paint/longtask performance entries recorded with PerformanceObserver.
const longTasks: PerformanceLongTaskTiming[] = [];

// How big to set the performance timing buffer.
const RESOURCE_TIMING_BUFFER_SIZE = 2000;

export interface GroupedPerfEntries {
  timeOrigin: number;
  navigationTiming?: PerformanceNavigationTimingExtended;
  firstPaint?: PerformancePaintTiming;
  firstContentfulPaint?: PerformancePaintTiming;
  resourceTimings: PerformanceResourceTiming[];
  marks: PerformanceMark[];
  measures: PerformanceMeasure[];
  longTasks: PerformanceLongTaskTiming[];
}

export function recordPerfEntries() {
  if (!windowWithPerformance.performance) return;

  if (performance.setResourceTimingBufferSize) {
    performance.setResourceTimingBufferSize(RESOURCE_TIMING_BUFFER_SIZE);
  }

  if (windowWithPerformance.PerformanceObserver) {
    const longTaskObserver =
        new windowWithPerformance.PerformanceObserver(onLongTasks);
    longTaskObserver.observe({entryTypes: ['longtask']});
  }
}

function onLongTasks(entryList: PerformanceObserverEntryList) {
  // These must be PerformanceLongTaskTiming objects because we only observe
  // 'longtask' above.
  longTasks.push(...(entryList.getEntries() as PerformanceLongTaskTiming[]));
}

export function getPerfEntries(): GroupedPerfEntries {
  if (!windowWithPerformance.performance) {
    return {
      timeOrigin: 0,
      resourceTimings: [],
      longTasks: [],
      marks: [],
      measures: []
    };
  }

  const perf = windowWithPerformance.performance;

  const entries: GroupedPerfEntries = {
    timeOrigin: getTimeOrigin(perf),
    resourceTimings: perf.getEntriesByType('resource'),
    marks: perf.getEntriesByType('mark'),
    measures: perf.getEntriesByType('measure'),
    longTasks: longTasks.slice(),
  };

  const navEntries = perf.getEntriesByType('navigation');
  if (navEntries.length) entries.navigationTiming = navEntries[0];

  const paintEntries = perf.getEntriesByType('paint');
  for (const paintEntry of paintEntries) {
    if (paintEntry.name === 'first-paint') {
      entries.firstPaint = paintEntry;
    } else if (paintEntry.name === 'first-contentful-paint') {
      entries.firstContentfulPaint = paintEntry;
    }
  }

  return entries;
}

export function clearPerfEntries() {
  if (!windowWithPerformance.performance) return;
  longTasks.length = 0;
  windowWithPerformance.performance.clearResourceTimings();
  windowWithPerformance.performance.clearMarks();
  windowWithPerformance.performance.clearMeasures();
}

export function getTimeOrigin(perf: Performance): number {
  if (perf.timeOrigin) return perf.timeOrigin;
  return new Date().getTime() - perf.now();
}
