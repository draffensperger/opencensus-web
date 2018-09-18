// Types taken from:
// https://github.com/Microsoft/TypeScript/blame/cca2631a90fb414f7c830f2d2895a3b5f0db896f/lib/lib.webworker.d.ts#L1741httpf://github.com/Microsoft/TypeScript/blame/cca2631a90fb414f7c830f2d2895a3b5f0db896f/lib/lib.webworker.d.ts#L1741
// See: https://github.com/Microsoft/TypeScript/issues/19816

export type PerformanceEntryList = PerformanceEntry[];
export type DOMHighResTimeStamp = number;

export interface PerformanceServerTiming {
  readonly description: string;
  readonly duration: number;
  readonly name: string;
}

export interface PerformanceNavigationTimingExtended {
  readonly initiatorType: 'navigation';
  readonly nextHopProtocol?: string;
  readonly secureConnectionStart?: DOMHighResTimeStamp;
  readonly transferSize?: number;
  readonly encodedBodySize?: number;
  readonly decodedBodySize?: number;
  readonly serverTiming?: PerformanceServerTiming[];
  readonly name?: string;
  readonly entryType: undefined|'navigation';

  readonly startTime: number;
  readonly duration: number;

  /** @deprecated */
  readonly connectEnd: number;
  /** @deprecated */
  readonly connectStart: number;
  readonly domComplete: number;
  readonly domContentLoadedEventEnd: number;
  readonly domContentLoadedEventStart: number;
  readonly domInteractive: number;
  /** @deprecated */
  readonly domLoading?: number;
  /** @deprecated */
  readonly domainLookupEnd: number;
  /** @deprecated */
  readonly domainLookupStart: number;
  /** @deprecated */
  readonly fetchStart: number;
  readonly loadEventEnd: number;
  readonly loadEventStart: number;
  /** @deprecated */
  readonly navigationStart?: number;
  readonly redirectCount: number;
  /** @deprecated */
  readonly redirectEnd: number;
  /** @deprecated */
  readonly redirectStart: number;
  /** @deprecated */
  readonly requestStart: number;
  /** @deprecated */
  readonly responseEnd: number;
  /** @deprecated */
  readonly responseStart: number;
  readonly type: NavigationType;
  readonly unloadEventEnd: number;
  readonly unloadEventStart: number;
  readonly workerStart: number;
}

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
  readonly buffered?: boolean;
  readonly entryTypes: PerformanceObserverEntryType[];
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
  readonly name: string;
  readonly entryType: 'taskattribution';
  readonly startTime: number;
  readonly duration: number;
}

export interface PerformanceLongTaskTiming extends PerformanceEntry {
  readonly entryType: 'longtask';
  readonly attribution: TaskAttributionTiming[];
}

export declare type WindowWithPerformance = Window & {
  readonly PerformanceObserver: PerformanceObserver;
};
