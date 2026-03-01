////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isEmpty from '../src/impl/is-empty';

describe('isEmpty', () => {
  test('null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  test('string', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(' ')).toBe(false);
    expect(isEmpty('abc')).toBe(false);
    // test String object to see if it reaches the switch case 'string'
    expect(isEmpty(new String(''))).toBe(true);
    expect(isEmpty(new String('abc'))).toBe(false);
  });

  test('array', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  test('typed-array', () => {
    expect(isEmpty(new Int8Array(0))).toBe(true);
    expect(isEmpty(new Int8Array(1))).toBe(false);
  });

  test('set', () => {
    expect(isEmpty(new Set())).toBe(true);
    const s = new Set();
    s.add(1);
    expect(isEmpty(s)).toBe(false);
  });

  test('map', () => {
    expect(isEmpty(new Map())).toBe(true);
    const m = new Map();
    m.set('a', 1);
    expect(isEmpty(m)).toBe(false);
  });

  test('object and other things (default case)', () => {
    expect(isEmpty({})).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(123)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});
