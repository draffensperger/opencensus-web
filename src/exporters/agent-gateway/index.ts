import {SpanExporter} from '../../trace/export';

class AgentGatewayExporter implements SpanExporter {
  constructor(private readonly endpoint: string) {}

  exportSpans(spans: Span[]) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(
        JSON.stringify(data));
  }

  private postToEndpoint(data)
}
