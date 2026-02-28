////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '../src';
import expectAlike from './utils/expect-alike';
import testMonkeyPatched from './utils/test-monkey-patched';
import testMonkeyPatchedSelfReference from './utils/test-monkey-patched-self-reference';

/**
 * Unit test the `clone()` function to clone plain objects.
 *
 * @author Haixing Hu
 */
describe('clone plain objects', () => {
  describe('empty', () => {
    test('simple case', () => {
      const empty = {};
      expectAlike(clone(empty), empty);
    });
    testMonkeyPatched({});
    testMonkeyPatchedSelfReference({});
  });
  describe('nonempty', () => {
    test('simple case', () => {
      const nonempty = { left: 'right', up: 'down', red: 'blue' };
      expectAlike(clone(nonempty), nonempty);
    });
    const nonempty1 = { left: 'right', up: 'down', red: 'blue' };
    testMonkeyPatched(nonempty1);
    const nonempty2 = { left: 'right', up: 'down', red: 'blue' };
    testMonkeyPatchedSelfReference(nonempty2);
  });
  describe('nested', () => {
    test('simple case', () => {
      const nested = { child: { val: 'val!' } };
      expectAlike(clone(nested), nested);
    });
    const nested1 = { child: { val: 'val!' } };
    testMonkeyPatched(nested1);
    const nested2 = { child: { val: 'val!' } };
    testMonkeyPatchedSelfReference(nested2);
  });
  describe('cyclic', () => {
    test('simple case', () => {
      const cyclic = {};
      cyclic.self = cyclic;
      const cloned = clone(cyclic);
      expect(cloned).not.toBe(cyclic);
      expect(cloned.self).toBe(cloned);
    });
    const cyclic1 = {};
    cyclic1.self = cyclic1;
    testMonkeyPatched(cyclic1);
    const cyclic2 = {};
    cyclic2.self = cyclic2;
    testMonkeyPatchedSelfReference(cyclic2);
  });
  describe('diamond', () => {
    test('simple case', () => {
      const child = { i_am: 'child' };
      const parent = { left: child, right: child };
      const cloned = clone(parent);
      expectAlike(cloned, parent);
      expect(cloned.left).toBe(cloned.right);
    });
    const child1 = { i_am: 'child1' };
    const parent1 = { left: child1, right: child1 };
    testMonkeyPatched(parent1);
    const child2 = { i_am: 'child2' };
    const parent2 = { left: child2, right: child2 };
    testMonkeyPatchedSelfReference(parent2);
  });
  describe('with non-string keys', () => {
    test('simple case', () => {
      const key = Symbol('key');
      const nonempty = { [key]: 'val' };
      expectAlike(clone(nonempty), nonempty);
    });
    const key1 = Symbol('key1');
    const nonempty1 = { [key1]: 'val1' };
    testMonkeyPatched(nonempty1);
    const key2 = Symbol('key2');
    const nonempty2 = { [key2]: 'val2' };
    testMonkeyPatchedSelfReference(nonempty2);
  });
  describe('function prototype instances with no hierarchy', () => {
    function Pair(left, right) {
      this.left = left;
      this.right = right;
    }
    test('simple case', () => {
      const pair = new Pair(3, 4);
      expectAlike(clone(pair), pair);
    });
    const pair1 = new Pair(3, 4);
    testMonkeyPatched(pair1);
    const pair2 = new Pair(3, 4);
    testMonkeyPatchedSelfReference(pair2);
  });
  describe('with prototype from Object.create', () => {
    const proto = {
      delimiter: ', ',
      toString() {
        return this.items.join(this.delimiter);
      },
    };
    test('simple case', () => {
      const object = Object.create(proto);
      object.items = [1, 2, 3];
      expectAlike(clone(object), object);
    });
    const object1 = Object.create(proto);
    object1.items = [1, 2, 3];
    testMonkeyPatched(object1);
    const object2 = Object.create(proto);
    object2.items = [1, 2, 3];
    testMonkeyPatchedSelfReference(object2);
  });
  describe('with prototype from Object.create(null)', () => {
    test('simple case', () => {
      const object = Object.create(null);
      object.items = [1, 2, 3];
      expect(Object.getPrototypeOf(object)).toBeNull();
      expectAlike(clone(object), object);
    });
    const object1 = Object.create(null);
    object1.items = [1, 2, 3];
    testMonkeyPatched(object1);
    const object2 = Object.create(null);
    object2.items = [1, 2, 3];
    testMonkeyPatchedSelfReference(object2);
  });
  describe('ES6 class instances with no hierarchy', () => {
    class Pair {
      constructor(left, right) {
        this.left = left;
        this.right = right;
      }
    }
    test('simple case', () => {
      const pair = new Pair(3, 4);
      expectAlike(clone(pair), pair);
    });
    const pair1 = new Pair(3, 4);
    testMonkeyPatched(pair1);
    const pair2 = new Pair(3, 4);
    testMonkeyPatchedSelfReference(pair2);
  });
  describe('ES6 classes with hierarchy', () => {
    class Parent {
      constructor(pValue) {
        this.pValue = pValue;
      }
    }
    class Child extends Parent {
      constructor(pValue, cValue) {
        super(pValue);
        this.cValue = cValue;
      }
    }
    test('simple case', () => {
      const child = new Child('pValue', 'cValue');
      expectAlike(clone(child), child);
    });
    const child1 = new Child('pValue', 'cValue');
    testMonkeyPatched(child1);
    const child2 = new Child('pValue', 'cValue');
    testMonkeyPatchedSelfReference(child2);
  });
  describe('with getters, include accessor, include non enumerable', () => {
    const cloneOptions = {
      includeAccessor: true,
      includeNonEnumerable: true,
    };
    const getterOptions = {
      configurable: true,
      get() { return this.val; },
    };
    test('simple case', () => {
      const object = { val: 'got' };
      Object.defineProperty(object, 'getter', getterOptions);
      const cloned = clone(object, cloneOptions);
      expectAlike(cloned, object);
      cloned.val = 'not';
      expect(cloned.getter).toBe('not');
    });
    const object1 = { val: 'got' };
    Object.defineProperty(object1, 'getter', getterOptions);
    testMonkeyPatched(object1, cloneOptions);
    const object2 = { val: 'got' };
    Object.defineProperty(object2, 'getter', getterOptions);
    testMonkeyPatchedSelfReference(object2, cloneOptions);
  });
  describe('with getters, default options', () => {
    const getterOptions = {
      configurable: true,
      enumerable: true,
      get() { return this.val; },
    };
    test('simple case', () => {
      const object = { val: 'got' };
      Object.defineProperty(object, 'getter', getterOptions);
      const cloned = clone(object);
      expectAlike(cloned, object);
      cloned.val = 'not';
      expect(cloned.getter).toBe('got');
    });
    const object1 = { val: 'got' };
    Object.defineProperty(object1, 'getter', getterOptions);
    testMonkeyPatched(object1);
    const object2 = { val: 'got' };
    Object.defineProperty(object2, 'getter', getterOptions);
    testMonkeyPatchedSelfReference(object2);
  });
  describe('with removeEmptyFields option', () => {
    test('should remove empty fields if removeEmptyFields is true', () => {
      const obj = {
        a: 1,
        b: '',
        c: null,
        d: undefined,
        e: [],
        f: new Set(),
        g: new Map(),
        h: new Int8Array(0),
      };
      const options = { removeEmptyFields: true };
      const result = clone(obj, options);
      expect(result).toEqual({ a: 1 });
    });
    test('should not remove empty fields if removeEmptyFields is false', () => {
      const obj = {
        a: 1,
        b: '',
        c: null,
        d: undefined,
        e: [],
        f: new Set(),
        g: new Map(),
        h: new Int8Array(0),
      };
      const options = { removeEmptyFields: false };
      const result = clone(obj, options);
      expect(result).toEqual(obj);
    });
  });
});
