import {AgentGatewayExporter} from './exporters/agent-gateway';
import {instrumentAll} from './instrumentation';
import {registerExporter} from './trace/export';
import {MessageEventType, Span, SpanContext, SpanKind, SpanLinkType, Trace} from './trace/types';

export interface NavigationConfig {
  traceId?: string;
  parentSpanId?: string;
  start?: number;
  elapsed?: number;
}

export interface OpenCensusConfig {
  agentEndpoint?: string;
  navigation?: NavigationConfig;
}

export declare type WindowWithOpenCensusConfig = Window & {
  openCensusConfig?: OpenCensusConfig;
};

export function startOpenCensusWeb() {
  const windowWithConfig = window as WindowWithOpenCensusConfig;
  if (!windowWithConfig.openCensusConfig) return;
  const config = windowWithConfig.openCensusConfig;
  if (!config.agentEndpoint) return;
  console.log('Starting OpenCensus web');

  registerExporter(new AgentGatewayExporter(config.agentEndpoint));
  instrumentAll(config.navigation);
}

startOpenCensusWeb();
