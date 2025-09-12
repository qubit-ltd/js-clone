////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { BIGINT_EXISTS } from '@qubit-ltd/type-detect/src/feature-detect';
import clone from '../src';

/**
 * Unit test the `clone()` function to clone immutable primitive values.
 *
 * @author Haixing Hu
 */
describe('clone immutable primitives', () => {
  test('clone(undefined)', () => {
    expect(clone(undefined)).toBeUndefined();
  });
  test('clone(null)', () => {
    expect(clone(null)).toBeNull();
  });
  test('clone(boolean)', () => {
    expect(clone(false)).toBe(false);
    expect(clone(true)).toBe(true);
  });
  test('clone(number)', () => {
    expect(clone(1)).toBe(1);
    expect(clone(-1)).toBe(-1);
    expect(clone(+0)).toBe(+0);
    expect(clone(-0)).toBe(-0);
    expect(clone(Number.INFINITY)).toBe(Number.INFINITY);
    expect(clone(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
    expect(clone(Number.NaN)).toBeNaN();
    expect(typeof clone(1)).toBe('number');
  });
  test('clone(string)', () => {
    expect(clone('')).toBe('');
    expect(clone('abc')).toBe('abc');
  });
  test('clone(symbol)', () => {
    const symbol = Symbol('symbol');
    expect(clone(symbol)).toBe(symbol);
  });
  if (BIGINT_EXISTS) {
    /* eslint-disable no-undef */
    test('clone(bigint)', () => {
      expect(clone(0n)).toBe(0n);
      expect(clone(100n)).toBe(100n);
      expect(clone(-100n)).toBe(-100n);
      expect(clone(BigInt(0))).toBe(0n);
      expect(clone(BigInt(100))).toBe(100n);
      expect(clone(BigInt(-100))).toBe(-100n);
    });
  }
});
