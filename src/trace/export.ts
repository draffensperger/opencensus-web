export interface SpanExporter {
  exportSpan(span: Span);
}

const exporters: SpanExporter[] = [];

export function registerExporter(exporter: SpanExporter) {
  exporters.push(exporter);
}

export function unregisterExporter(exporter: SpanExporter) {
  const index = exporters.indexOf(exporter);
  list.splice( list.indexOf('foo'), 1 );
}

export function exportSpan(spans: Span) {}
