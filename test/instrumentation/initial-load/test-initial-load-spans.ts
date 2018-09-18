import {getInitialLoadSpans} from 'src/instrumentation/initial-load';
import {GroupedPerfEntries} from 'src/instrumentation/perf-recorder';

describe('getInitialLoadSpans', () => {
  it('creates a parent span for overall load and child spans', () => {
    const perfEntries: GroupedPerfEntries = {
      timeOrigin: 1537281715830.2,
      resourceTimings: [],
      'marks': [
        {
          'name': 'Zone',
          'entryType': 'mark',
          'startTime': 1498.5000000015134,
          'duration': 0,
          toJSON: () => '',
        },
      ],
      'measures': [
        {
          'name': 'Zone',
          'entryType': 'measure',
          'startTime': 1498.5000000015134,
          'duration': 1.8999999992956873,
          toJSON: () => '',
        },
      ],
      'longTasks': [
        {
          'name': 'self',
          'entryType': 'longtask',
          'startTime': 11870.39999999979,
          'duration': 1063.7000000024273,
          'attribution': [{
            'name': 'script',
            'entryType': 'taskattribution',
            'startTime': 0,
            'duration': 0,
            'containerType': 'iframe',
            'containerSrc': '',
            'containerId': '',
            'containerName': ''
          }],
          toJSON: () => '',
        },
      ],
      'navigationTiming': {
        'name': 'http://localhost:4200/',
        'entryType': 'navigation',
        'startTime': 0,
        'duration': 20985.30000000028,
        'initiatorType': 'navigation',
        'nextHopProtocol': 'http/1.1',
        'workerStart': 0,
        'redirectStart': 0,
        'redirectEnd': 0,
        'fetchStart': 25.100000002566958,
        'domainLookupStart': 28.09999999954016,
        'domainLookupEnd': 28.09999999954016,
        'connectStart': 28.09999999954016,
        'connectEnd': 28.300000001763692,
        'secureConnectionStart': 0,
        'requestStart': 28.500000000349246,
        'responseStart': 384.6000000012282,
        'responseEnd': 394.20000000245636,
        'transferSize': 4667,
        'encodedBodySize': 4404,
        'decodedBodySize': 4404,
        'serverTiming': [],
        'unloadEventStart': 0,
        'unloadEventEnd': 0,
        'domInteractive': 12126.70000000071,
        'domContentLoadedEventStart': 12126.70000000071,
        'domContentLoadedEventEnd': 12933.80000000252,
        'domComplete': 20967.70000000106,
        'loadEventStart': 20967.899999999645,
        'loadEventEnd': 20985.30000000028,
        'type': 'navigate',
        'redirectCount': 0,
        toJSON: () => '',
      },
      'firstPaint': {
        'name': 'first-paint',
        'entryType': 'paint',
        'startTime': 606.9000000024971,
        'duration': 0,
        toJSON: () => '',
      },
      'firstContentfulPaint': {
        'name': 'first-contentful-paint',
        'entryType': 'paint',
        'startTime': 606.9000000024971,
        'duration': 0,
        toJSON: () => '',
      }
    };

    const spans = getInitialLoadSpans(perfEntries);

    expect(spans).toEqual([]);
  });
});
