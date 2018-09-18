import {SpanId, TraceId} from './types';

export declare type WindowWithMsCrypto = Window & {
  msCrypto?: Crypto;
};

const SPAN_ID_BYTES = 8;

export function randomTraceId(): TraceId {
  return randomSpanId() + randomSpanId();
}

export function randomSpanId(): SpanId {
  const crypto = window.crypto || (window as WindowWithMsCrypto).msCrypto;
  if (crypto) {
    let spanId = '';
    const randomBytes = new Uint8Array(SPAN_ID_BYTES);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < SPAN_ID_BYTES; i++) {
      spanId += zeroPad(randomBytes[i].toString(16), 2);
    }
    return spanId;
  } else {
    return mathRand32Hex() + mathRand32Hex();
  }
}

export function mathRand32Hex(): string {
  return zeroPad(((1 << 30) * Math.random()).toString(16), 8);
}

export function zeroPad(str: string, targetLen: number): string {
  const padLen = targetLen - str.length;
  let padding = '';
  for (let i = 0; i < padLen; i++) {
    padding += '0';
  }
  return padding + str;
}
