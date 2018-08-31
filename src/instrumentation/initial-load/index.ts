import {exportSpans} from '../../trace/export';

import {clearPerfEntries, getPerfEntries} from '../perf-recorder';

import {getInitialLoadSpans} from './initial-load-spans';

// How long to wait for DOMContentLoaded to create the initial load span.
const WAIT_TIME_AFTER_LOAD_MS = 10000;

export function instrumentInitialLoad() {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      exportSpans(getInitialLoadSpans(getPerfEntries()));
      clearPerfEntries();
    }, WAIT_TIME_AFTER_LOAD_MS);
  });
}
