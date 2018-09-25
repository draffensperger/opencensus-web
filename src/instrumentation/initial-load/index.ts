import {NavigationConfig} from '../..';
import {exportSpans} from '../../trace/export';
import {clearPerfEntries, getPerfEntries} from '../perf-recorder';

import {getInitialLoadSpans} from './initial-load-spans';

// How long to wait for DOMContentLoaded to create the initial load span.
const WAIT_TIME_AFTER_LOAD_MS = 2000;

export function instrumentInitialLoad(navigationConfig: NavigationConfig|
                                      undefined) {
  if (document.readyState === 'complete') {
    exportInitialLoadSpans(navigationConfig);
  } else {
    window.addEventListener('load', () => {
      exportInitialLoadSpans(navigationConfig);
    });
  }
}

export {getInitialLoadSpans} from './initial-load-spans';

function exportInitialLoadSpans(navigationConfig: NavigationConfig|undefined) {
  setTimeout(() => {
    exportSpans(getInitialLoadSpans(getPerfEntries(), navigationConfig));
    clearPerfEntries();
  }, WAIT_TIME_AFTER_LOAD_MS);
}
