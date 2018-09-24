import {instrumentInitialLoad} from './initial-load';
import {recordPerfEntries} from './perf-recorder';

export function instrumentAll(
    navigationTraceId: string|undefined, navigationSpanId: string|undefined) {
  recordPerfEntries();
  instrumentInitialLoad(navigationTraceId, navigationSpanId);
}
