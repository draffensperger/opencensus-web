import {isoDateFromBaseAndElapsed} from 'src/exporters/agent-gateway/api-span-formatter';

describe('isoDateFromBaseAndElapsed', () => {
  it('converts base and elapsed time to high-res ISO date string', () => {
    expect(isoDateFromBaseAndElapsed(1535683887000, 0.000001))
        .toBe('2018-08-31T02:51:27.000000001Z');

    expect(isoDateFromBaseAndElapsed(1535683887001, 0.000001))
        .toBe('2018-08-31T02:51:27.001000001Z');

    expect(isoDateFromBaseAndElapsed(0, 1535683887441))
        .toBe('2018-08-31T02:51:27.441000000Z');

    expect(isoDateFromBaseAndElapsed(0.000001, 1535683887441))
        .toBe('2018-08-31T02:51:27.441000001Z');

    expect(isoDateFromBaseAndElapsed(1535683887441.586, 658867.8000000073))
        .toBe('2018-08-31T03:02:26.309385938Z');
  });
});
