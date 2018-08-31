import {baseElapsedToIsoDate, hexToBase64, modelToApiSpan} from 'src/exporters/agent-gateway/api-span-formatter';
import * as apiTypes from 'src/exporters/agent-gateway/api-span-types';
import * as modelTypes from 'src/trace/types';

describe('modelToApiSpan', () => {
  it('converts minimal OpenCensus web span model to grpc-gateway span', () => {
    const modelTrace: modelTypes.Trace = {
      traceId: '69f223f58668171cedf0c9eab06f0d36',
      baseTime: 1535683887001
    };
    const spanContext: modelTypes.SpanContext = {
      trace: modelTrace,
      spanId: 'a56a50b90c653f00',
      isSampled: false,
    };
    const modelSpan:
        modelTypes.Span = {spanContext, name: 'test1', startTime: 2.000001};

    const apiSpan = modelToApiSpan(modelSpan);

    expect(apiSpan).toEqual({
      traceId: 'afIj9YZoFxzt8MnqsG8NNg==',
      spanId: 'pWpQuQxlPwA=',
      tracestate: undefined,
      parentSpanId: undefined,
      name: {value: 'test1'},
      kind: undefined,
      startTime: '2018-08-31T02:51:27.003000001Z',
      endTime: undefined,
      attributes: undefined,
      stackTrace: undefined,
      timeEvents: undefined,
      links: undefined,
      status: undefined,
      childSpanCount: undefined,
    });
  });

  it('converts model span with all fields to grpc-gateway span', () => {
    const modelTrace: modelTypes.Trace = {
      traceId: '69f223f58668171cedf0c9eab06f0d36',
      baseTime: 1535683887001
    };
    const spanContext: modelTypes.SpanContext = {
      trace: modelTrace,
      spanId: 'a56a50b90c653f00',
      isSampled: false,
      tracestate: {'abc': 'def'},
    };
    const modelSpan: modelTypes.Span = {
      spanContext,
      name: 'test2',
      startTime: 2.000001,
      endTime: 4.000001,
      parentSpanId: '0000000000000001',
      kind: modelTypes.SpanKind.Server,
      attributes: {
        'a': 'abc',
        'b': 123,
        'c': false,
        'd': 1.1,
        'e': NaN,
        'f': -5000,
      },
      stackTrace: [
        {
          functionName: 'foo',
          originalFunctionName: 'pkg.foo',
          fileName: 'foo.js',
          lineNumber: 10,
          columnNumber: 4,
          loadModule: {module: 'foo-pack', buildId: 'v1'},
          sourceVersion: '1.0',
        },
        {
          functionName: 'bar',
          originalFunctionName: 'pkg.bar',
          fileName: 'bar.js',
          lineNumber: 12,
          columnNumber: 6,
          loadModule: {module: 'bar-pack', buildId: 'v2'},
          sourceVersion: '2.0',
        }
      ],
      messageEvents: [{
        time: 5.2,
        type: modelTypes.MessageEventType.Received,
        id: 81,
        uncompressedSize: 50,
        compressedSize: 40,
      }],
      annotations:
          [{time: 8.5, description: 'annotation2', attributes: {'xyz': 999}}],
      links: [{
        type: modelTypes.SpanLinkType.Child,
        attributes: {'d': 'def', 'e': 456, 'f': true}
      }],
      status: {
        code: 404,
        message: 'Not found',
      },
      sameProcessAsParentSpan: true,
      childSpanCount: 4,
    };

    const apiSpan = modelToApiSpan(modelSpan);

    const expectedApiSpan: apiTypes.Span = {
      traceId: 'afIj9YZoFxzt8MnqsG8NNg==',
      spanId: 'pWpQuQxlPwA=',
      tracestate: {abc: 'def'},
      parentSpanId: 'AAAAAAAAAAE=',
      name: {value: 'test2'},
      kind: 'SERVER' as apiTypes.SpanKind,
      startTime: '2018-08-31T02:51:27.003000001Z',
      endTime: '2018-08-31T02:51:27.005000001Z',
      attributes: {
        attributeMap: {
          'a': {stringValue: {value: 'abc'}},
          'b': {intValue: '123'},
          'c': {boolValue: false},
          'd': {stringValue: {value: '1.1'}},
          'e': {stringValue: {value: 'NaN'}},
          'f': {intValue: '-5000'},
        }
      },
      stackTrace: {
        stackFrames: {
          frame: [
            {
              functionName: {value: 'foo'},
              originalFunctionName: {value: 'pkg.foo'},
              fileName: {value: 'foo.js'},
              lineNumber: '10',
              columnNumber: '4',
              loadModule: {module: {value: 'foo-pack'}, buildId: {value: 'v1'}},
              sourceVersion: {value: '1.0'},
            },
            {
              functionName: {value: 'bar'},
              originalFunctionName: {value: 'pkg.bar'},
              fileName: {value: 'bar.js'},
              lineNumber: '12',
              columnNumber: '6',
              loadModule: {module: {value: 'bar-pack'}, buildId: {value: 'v2'}},
              sourceVersion: {value: '2.0'},
            }
          ]
        }
      },
      timeEvents: {
        timeEvent: [
          {
            time: '2018-08-31T02:51:27.009500000Z',
            annotation: {
              description: {value: 'annotation2'},
              attributes: {attributeMap: {'xyz': {intValue: '999'}}}
            }
          },
          {
            time: '2018-08-31T02:51:27.006200000Z',
            messageEvent: {
              type: 'RECEIVED' as apiTypes.MessageEventType,
              id: '81',
              uncompressedSize: '50',
              compressedSize: '40'
            }
          }
        ]
      },
      links: {
        link: [{
          type: 'CHILD_LINKED_SPAN' as apiTypes.SpanLinkType,
          attributes: {
            attributeMap: {
              'd': {stringValue: {value: 'def'}},
              'e': {intValue: '456'},
              'f': {boolValue: true},
            }
          }
        }]
      },
      status: {code: 404, message: 'Not found'},
      childSpanCount: 4
    };
    expect(apiSpan).toEqual(expectedApiSpan);
  });
});

describe('hexToBase64', () => {
  it('converts a hex formatting string to base64 formatted string', () => {
    expect(hexToBase64('00')).toEqual('AA==');
    expect(hexToBase64('0001')).toEqual('AAE=');
    expect(hexToBase64('000001')).toEqual('AAAB');
    expect(hexToBase64('ff')).toEqual('/w==');
    expect(hexToBase64('a6b580481008e60df9350de170b7e728'))
        .toEqual('prWASBAI5g35NQ3hcLfnKA==');
  });
});

describe('baseElapsedToIsoDate', () => {
  it('converts base and elapsed ms to ns-precise ISO date string', () => {
    expect(baseElapsedToIsoDate(1535683887000, 0.000001))
        .toEqual('2018-08-31T02:51:27.000000001Z');

    expect(baseElapsedToIsoDate(1535683887001, 0.000001))
        .toEqual('2018-08-31T02:51:27.001000001Z');

    expect(baseElapsedToIsoDate(0, 1535683887441))
        .toEqual('2018-08-31T02:51:27.441000000Z');

    expect(baseElapsedToIsoDate(0.000001, 1535683887441))
        .toEqual('2018-08-31T02:51:27.441000001Z');

    expect(baseElapsedToIsoDate(1535683887441.586, 658867.8000000073))
        .toEqual('2018-08-31T03:02:26.309385938Z');
  });
});
