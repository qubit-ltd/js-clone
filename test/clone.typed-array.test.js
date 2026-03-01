////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import testTypedArray from './utils/test-typed-array';

/**
 * Unit test the `clone()` function to clone typed arrays.
 *
 * @author Haixing Hu
 */
describe('clone typed arrays et al', () => {
  describe('typed arrays', () => {
    testTypedArray(Int8Array, 12);
    testTypedArray(Uint8Array, 12);
    testTypedArray(Uint8ClampedArray, 12);
    testTypedArray(Int16Array, 12);
    testTypedArray(Uint16Array, 12);
    testTypedArray(Int32Array, 12);
    testTypedArray(Uint32Array, 12);
    testTypedArray(BigInt64Array, 12n);
    testTypedArray(BigUint64Array, 12n);
    testTypedArray(Float32Array, 3.14);
    testTypedArray(Float64Array, 3.14);
  });
});
