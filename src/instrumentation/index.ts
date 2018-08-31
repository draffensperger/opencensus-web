import {instrumentInitialLoad} from './initial-load';
import {recordPerfEntries} from './perf-recorder';

export function instrumentAll() {
  recordPerfEntries();
  instrumentInitialLoad();
}
