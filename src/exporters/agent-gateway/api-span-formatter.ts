import * as modelTypes from '../../trace/types';
import * as apiTypes from './api-span-types';

export function modelToApiSpan(modelSpan: modelTypes.Span): apiTypes.Span {
  const spanContext = modelSpan.spanContext;
  const trace = spanContext.trace;

  const apiSpan: apiTypes.Span = {};
  return apiSpan;
}

// Converts a hex-encoded string to a base64-encoded string.
export function hexToBase64(hexStr: string): string {
  const hexStrLen = hexStr.length;
  let hexAsciiCharsStr = '';
  for (let i = 0; i < hexStrLen; i += 2) {
    const hexPair = hexStr.substring(i, i + 2);
    const hexVal = parseInt(hexPair, 16);
    hexAsciiCharsStr += String.fromCharCode(hexVal);
  }
  return btoa(hexAsciiCharsStr);
}

// Generates a nanosecond precision ISO date string from a time time in epoch
// milliseconds and an elapsed time in milliseconds, both of which may have
// fractional parts.
export function isoDateFromBaseAndElapsed(
    baseEpochMs: number, elapsedMs: number): string {
  // Break base and elapsed times into whole and fractional parts.
  const [baseWhole, baseFrac] = wholeAndFraction(baseEpochMs);
  const [elapsedWhole, elapsedFrac] = wholeAndFraction(elapsedMs);

  // Combine the fractional and whole parts separately to preserve
  // precision.
  const totalFrac = baseFrac + elapsedFrac;
  const [extraWholeMs, fracMs] = wholeAndFraction(totalFrac);
  const wholeMs = baseWhole + elapsedWhole + extraWholeMs;

  // Use the native Date class to generate an ISO string for the whole
  // millisecond portion.
  const dateStrWholeMs = new Date(wholeMs).toISOString();

  // Append the fractional millisecond portion for the final 6 digits
  // after the seconds part.
  const dateStrWithoutZ = dateStrWholeMs.substr(0, dateStrWholeMs.length - 1);
  const millisFracStr = fracMs.toFixed(6).substring(2);
  return `${dateStrWithoutZ}${millisFracStr}Z`;
}

// Splits a number into whole and fractional parts, accurate to 9dp.
function wholeAndFraction(num: number): [number, number] {
  const [wholeStr, fracionStr] = num.toFixed(9).split('.');
  const whole = Number(wholeStr);
  const fraction = Number(`0.${fracionStr}`);
  return [whole, fraction];
}
