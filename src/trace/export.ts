import {Span} from './types';

export interface SpanExporter {
  exportSpans(spans: Span[]): void;
}

const exporters: SpanExporter[] = [];

export function registerExporter(exporter: SpanExporter) {
  exporters.push(exporter);
}

export function unregisterExporter(exporter: SpanExporter) {
  const index = exporters.indexOf(exporter);
  if (index > 0) exporters.splice(index, 1);
}

export function exportSpans(spans: Span[]) {
  for (const exporter of exporters) {
    exporter.exportSpans(spans);
  }
}
