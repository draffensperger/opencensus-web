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

function apiSpanForModel(modelSpan: modelTypes.Span): apiTypes.Span {
  const apiSpan: apiTypes.Span = {};
  return apiSpan;
}

function hexToBase64(hexStr: string): string {
  return '';
}

function perfTimeDateStr(time: number) {
  const originMillisWhole = Math.floor(performance.timeOrigin);
  const originMillisFrac = performance.timeOrigin - originMillisWhole;
  const timeMillisWhole = Math.floor(time);
  const timeMillisFrac = time - timeMillisWhole;
  let combinedMillisWhole = originMillisWhole + timeMillisWhole;
  let combinedMillisFrac = timeMillisFrac + originMillisFrac;
  combinedMillisWhole += Math.floor(combinedMillisFrac);
  combinedMillisFrac -= Math.floor(combinedMillisFrac);
  const wholeMillisDateStr = new Date(combinedMillisWhole).toISOString();
  const wholeMillisDateStrWithoutZ =
      wholeMillisDateStr.substr(0, wholeMillisDateStr.length - 1);
  const millisFracStr = String(combinedMillisFrac).substr(2, 3);
  return `${wholeMillisDateStrWithoutZ}${millisFracStr}Z`;
}
