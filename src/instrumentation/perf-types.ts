// Types taken from:
// https://github.com/Microsoft/TypeScript/blame/cca2631a90fb414f7c830f2d2895a3b5f0db896f/lib/lib.webworker.d.ts#L1741
// See: https://github.com/Microsoft/TypeScript/issues/19816

export type PerformanceEntryList = PerformanceEntry[];
export type DOMHighResTimeStamp = number;

export interface PerformanceObserverCallback {
  (entries: PerformanceObserverEntryList, observer: PerformanceObserver): void;
}

export interface PerformanceObserver {
  new(callback: PerformanceObserverCallback): PerformanceObserver;
  disconnect(): void;
  observe(options: PerformanceObserverInit): void;
  takeRecords(): PerformanceEntryList;
}

export type PerformanceObserverEntryType =
    'frame'|'navigation'|'resource'|'mark'|'measure'|'paint'|'longtask';

export interface PerformanceObserverInit {
  buffered?: boolean;
  entryTypes: PerformanceObserverEntryType[];
}

export interface PerformanceObserverEntryList {
  getEntries(): PerformanceEntry[];
  getEntriesByName(name: string, type?: string): PerformanceEntryList;
  getEntriesByType(type: string): PerformanceEntryList;
}

export interface PerformanceFrameTiming extends PerformanceEntry {
  readonly entryType: 'frame';
}

export interface PerformancePaintTiming extends PerformanceEntry {
  readonly entryType: 'paint';
  readonly name: 'first-paint'|'first-contentful-paint';
}

export type TaskAttributionContainerType = 'iframe'|'embed'|'object';

export interface TaskAttributionTiming {
  readonly containerType: TaskAttributionContainerType;
  readonly containerSrc: string;
  readonly containerId: string;
  readonly containerName: string;
}

export interface PerformanceLongTaskTiming extends PerformanceEntry {
  readonly entryType: 'longtask';
  readonly attribution: TaskAttributionTiming[];
}

export declare type WindowWithPerformance = Window & {
  PerformanceObserver: PerformanceObserver;
};
