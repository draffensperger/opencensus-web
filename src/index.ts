import {AgentGatewayExporter} from './exporters/agent-gateway';
import {exportSpans, registerExporter} from './trace/export';
import {MessageEventType, Span, SpanContext, SpanKind, SpanLinkType, Trace} from './trace/types';

export function startOpenCensusWeb(agentGatewayEndpoint: string) {
  console.log('Starting OpenCensus web');

  const trace: Trace = {
    traceId: '69f223f58668171cedf0c9eab06f0d36',
    baseTime: 1535683887001
  };
  const spanContext: SpanContext = {
    trace,
    spanId: 'a56a50b90c653f00',
    isSampled: false,
    tracestate: {'abc': 'def'},
  };
  const span: Span = {
    spanContext,
    name: 'test2',
    startTime: 2.000001,
    endTime: 4.000001,
    parentSpanId: '0000000000000001',
    kind: SpanKind.Server,
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
      type: MessageEventType.Received,
      id: 81,
      uncompressedSize: 50,
      compressedSize: 40,
    }],
    annotations:
        [{time: 8.5, description: 'annotation2', attributes: {'xyz': 999}}],
    links: [
      {type: SpanLinkType.Child, attributes: {'d': 'def', 'e': 456, 'f': true}}
    ],
    status: {
      code: 404,
      message: 'Not found',
    },
    sameProcessAsParentSpan: true,
    childSpanCount: 4,
  };

  const exporter = new AgentGatewayExporter(agentGatewayEndpoint);
  registerExporter(exporter);
  exportSpans([span]);
}
