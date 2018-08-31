import {SpanExporter} from '../../trace/export';
import * as modelTypes from '../../trace/types';
import * as apiTypes from './api-span-types';

// The value of XMLHttpRequest `readyState` property when the request is done.
const XHR_READY_STATE_DONE = 4;

const HTTP_SUCCESS_STATUS = 200;

class AgentGatewayExporter implements SpanExporter {
  constructor(private readonly endpoint: string) {}

  exportSpans(spans: modelTypes.Span[]) {}

  private postToEndpoint(request: apiTypes.ExportSpansRequest) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(request));
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XHR_READY_STATE_DONE) return;
      if (xhr.status !== HTTP_SUCCESS_STATUS) {
        console.log(`Error writing trace spans (HTTP status ${xhr.status}):`);
        console.log(xhr.responseText);
      }
    };
  }
}
