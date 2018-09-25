import {NavigationConfig} from '..';

import {instrumentInitialLoad} from './initial-load';
import {recordPerfEntries} from './perf-recorder';

export function instrumentAll(navigationConfig: NavigationConfig|undefined) {
  recordPerfEntries();
  instrumentInitialLoad(navigationConfig);
}
