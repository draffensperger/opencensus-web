import {exportSpans} from '../../trace/export';

import {clearPerfEntries, getPerfEntries} from '../perf-recorder';

import {getInitialLoadSpans} from './initial-load-spans';

// How long to wait for DOMContentLoaded to create the initial load span.
const WAIT_TIME_AFTER_LOAD_MS = 2000;

export function instrumentInitialLoad(
    navigationTraceId: string|undefined, navigationSpanId: string|undefined) {
  if (document.readyState === 'complete') {
    exportInitialLoadSpans(navigationTraceId, navigationSpanId);
  } else {
    window.addEventListener('load', () => {
      exportInitialLoadSpans(navigationTraceId, navigationSpanId);
    });
  }
}

export {getInitialLoadSpans} from './initial-load-spans';

function exportInitialLoadSpans(
    navigationTraceId: string|undefined, navigationSpanId: string|undefined) {
  setTimeout(() => {
    exportSpans(getInitialLoadSpans(
        getPerfEntries(), navigationTraceId, navigationSpanId));
    clearPerfEntries();
  }, WAIT_TIME_AFTER_LOAD_MS);
}
