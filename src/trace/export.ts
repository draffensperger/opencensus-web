import {Span} from './span';

export interface SpanExporter {
  exportSpan(span: Span): void;
}

const exporters: SpanExporter[] = [];

export function registerExporter(exporter: SpanExporter) {
  exporters.push(exporter);
}

export function unregisterExporter(exporter: SpanExporter) {
  const index = exporters.indexOf(exporter);
  if (index > 0) exporters.splice(index, 1);
}

export function exportSpan(spans: Span) {}
