import {AgentGatewayExporter} from './exporters/agent-gateway';
import {instrumentAll} from './instrumentation';
import {exportSpans, registerExporter} from './trace/export';
import {MessageEventType, Span, SpanContext, SpanKind, SpanLinkType, Trace} from './trace/types';

export function startOpenCensusWeb(agentGatewayEndpoint: string) {
  console.log('Starting OpenCensus web');
  registerExporter(new AgentGatewayExporter(agentGatewayEndpoint));
  instrumentAll();
}
