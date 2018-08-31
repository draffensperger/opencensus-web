import {hexToBase64, isoDateFromBaseAndElapsed, modelToApiSpan} from 'src/exporters/agent-gateway/api-span-formatter';
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

    expect(apiSpan).toEqual({});
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

describe('isoDateFromBaseAndElapsed', () => {
  it('converts base and elapsed time to high-res ISO date string', () => {
    expect(isoDateFromBaseAndElapsed(1535683887000, 0.000001))
        .toEqual('2018-08-31T02:51:27.000000001Z');

    expect(isoDateFromBaseAndElapsed(1535683887001, 0.000001))
        .toEqual('2018-08-31T02:51:27.001000001Z');

    expect(isoDateFromBaseAndElapsed(0, 1535683887441))
        .toEqual('2018-08-31T02:51:27.441000000Z');

    expect(isoDateFromBaseAndElapsed(0.000001, 1535683887441))
        .toEqual('2018-08-31T02:51:27.441000001Z');

    expect(isoDateFromBaseAndElapsed(1535683887441.586, 658867.8000000073))
        .toEqual('2018-08-31T03:02:26.309385938Z');
  });
});
