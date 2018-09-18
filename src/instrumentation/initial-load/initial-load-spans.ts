import {Span, Trace} from '../../trace/types';
import {randomSpanId} from '../../trace/util';

import {GroupedPerfEntries} from '../perf-recorder';

export function getInitialLoadSpans(perfEntries: GroupedPerfEntries): Span[] {
  const lastResourceEnd =
      Math.max(...perfEntries.resourceTimings.map((t) => t.responseEnd));

  const trace = new Trace(perfEntries.timeOrigin);

  const spans: Span[] = [];

  const spanContext = {trace, spanId: randomSpanId(), isSampled: true};
  const navigationName = perfEntries.navigationTiming ?
      perfEntries.navigationTiming.name :
      location.href;
  const allResourcesSpan = new Span(spanContext, `Nav.${navigationName}`, 0);
  allResourcesSpan.endTime = lastResourceEnd;
  spans.push(allResourcesSpan);

  return spans;
}
