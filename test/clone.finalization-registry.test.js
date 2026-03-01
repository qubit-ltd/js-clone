////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '../src';

/**
 * Unit test the `clone()` function to clone FinalizationRegistry.
 *
 * @author Haixing Hu
 */
describe('clone FinalizationRegistry', () => {
  it('should not clone FinalizationRegistry', () => {
    const registry = new FinalizationRegistry((value) => {
      console.log('FinalizationRegistry callback: ', value);
    });
    expect(clone(registry)).toBe(registry);
  });
});
