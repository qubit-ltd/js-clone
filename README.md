# @qubit-ltd/clone

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/clone.svg)](https://npmjs.com/package/@qubit-ltd/clone)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/qubit-ltd/js-clone/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/qubit-ltd/js-clone/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/qubit-ltd/js-clone/badge.svg?branch=master)](https://coveralls.io/github/qubit-ltd/js-clone?branch=master)

[clone] is a JavaScript library for deeply cloning JavaScript objects. It 
retains the prototype of the object and all its properties, and supports custom 
clone hook functions, allowing for specialized clone algorithms for specific
types. 

This library has the following features which is not supported by the built-in
[structuredClone()] function:

- **Deep Cloning**: Capable of deeply cloning any JavaScript object, including 
  but not limited to simple objects, instances of custom classes, `Array`, `Map`, 
  `Set`, `Date`, `RegExp`, `Error`, `Promise`, etc.
- **Prototype Retention**: The cloned object maintains the prototype of the 
  original object.
- **Cycle Reference Detection**: Capable of detecting cyclic references and 
  preventing infinite recursion.
- **Support for Custom Attributes on Built-in Objects**: Given JavaScript's 
  flexibility, users can set custom attributes on built-in objects, e.g., 
  `const str = 'hello'; str.x = 123;`. This library can clone these custom 
  attributes.
- **Customizable Cloning Parameters**: Supports custom cloning parameters, 
  allowing for customization of the cloning algorithm.
- **Customizable Naming Conversion Rule**: Supports specifying naming conversion 
  rule, allowing for converting naming styles of properties of cloned objects. 
- **Customizable Cloning Algorithm**: Supports the customization of the cloning
  algorithm through the registration of hook functions.
- **Vue.js Reactivity Support**: Compatible with the reactivity system of 
  Vue.js, cloning only enumerable properties.
- **100% Test Coverage**: Every line of code, every branch, and every function in this library is fully tested, ensuring reliable behavior across different use cases.

## <span id="contents">Table of Contents</span>

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api)
    - [clone(source, [options])](#clone)
    - [registerCloneHook(hook)](#register-clone-hook)
    - [unregisterCloneHook(hook)](#unregister-clone-hook)
    - [cloneImpl(source, depth, options, cache)](#clone-impl)
    - [copyProperties(source, target, depth options, cache)](#copy-properties)
- [Examples](#examples)
    - [Deep Cloning Objects](#clone-object)
    - [Cloning with Options](#clone-with-options)
    - [Cloning with Naming Conversion](#clone-with-naming-conversion)
    - [Customizing Clone Behavior](#customize-clone-behavior)
    - [Cloning Complex Structures with Circular References](#clone-circular)
    - [Using with Vue.js](#clone-vue)
- [Test Coverage](#test-coverage)
- [License](#license)
- [Contributing](#contributing)
- [Contributors](#contributors)

## <span id="installation">Installation</span>

This library depends on the [naming-style], [type-detect] and [typeinfo] libraries, 
so it is necessary to install them first.

Install via npm:
```bash
npm install @babel/runtime @qubit-ltd/naming-style @qubit-ltd/type-detect @qubit-ltd/typeinfo @qubit-ltd/clone
```
Or install via `yarn`:
```bash
yarn add @babel/runtime @qubit-ltd/naming-style @qubit-ltd/type-detect @qubit-ltd/typeinfo @qubit-ltd/clone
```

## <span id="usage">Usage</span>

```js
class Credential {
  type = '';
  number = '';
}
class Person {
  name = '';
  age = 0;
  credential = new Credential();
}
const obj2 = new Person();
obj2.name = 'Bill Gates';
obj2.age = 30;
obj2.credential.type = 'PASSWORD';
obj2.credential.number = '111111';
const copy2 = clone(obj2);
expect(copy2).toEqual(obj2);
expect(copy2).not.toBe(obj2);
expect(copy2).toBeInstanceOf(Person);
expect(copy2.credential).toBeInstanceOf(Credential);
```

## <span id="project-structure">Project Structure</span>

The project is organized as follows:

- `src/`: Contains the source code
  - `clone.js`: The main function for deep cloning objects
  - `default-clone-options.js`: Default options for the cloning algorithm
  - `register-clone-hook.js`: Functions for registering custom clone hooks
  - `unregister-clone-hook.js`: Functions for unregistering custom clone hooks
  - `impl/`: Implementation of cloning algorithms for different types
    - `clone-array.js`: Implementation for cloning arrays
    - `clone-buffer.js`: Implementation for cloning buffer objects
    - `clone-copy-constructable-object.js`: Implementation for cloning objects with copy constructors
    - `clone-customized-object.js`: Implementation for cloning custom objects
    - `clone-data-view.js`: Implementation for cloning DataView objects
    - `clone-error.js`: Implementation for cloning Error objects
    - `clone-hooks.js`: Management of clone hooks
    - `clone-impl.js`: Core implementation of the cloning algorithm
    - `clone-map.js`: Implementation for cloning Map objects
    - `clone-object-impl.js`: Implementation for cloning plain objects
    - `clone-primitive-wrapper-object.js`: Implementation for cloning primitive wrapper objects
    - `clone-promise.js`: Implementation for cloning Promise objects
    - `clone-set.js`: Implementation for cloning Set objects
    - `clone-typed-array.js`: Implementation for cloning TypedArray objects
    - `copy-properties.js`: Utility function for copying properties between objects
    - `get-target-key.js`: Utility function for getting target keys when renaming properties
    - `is-empty.js`: Utility function for checking if a value is empty
- `test/`: Contains comprehensive test suites for all functionalities
- `dist/`: Contains the built distribution files

## <span id="api">API Documentation</span>

### <span id="clone">clone(source, [options])</span>

Deep clones a value or object.

- `source: any` - The value or object to be cloned.
- `options: object` - Options for the cloning algorithm. Possible options include:
    - `includeAccessor: boolean`: If `true`, clones the property's accessors 
      (getters and setters). Defaults to `false`.
    - `excludeReadonly: boolean`: If `true`, does not clone readonly properties.
      Defaults to `false`.
    - `includeNonEnumerable: boolean`: If `true`, clones non-enumerable 
      properties. Defaults to `false`.
    - `includeNonConfigurable: boolean`: If `true`, clones non-configurable 
      properties. Defaults to `false`.
    - `convertNaming: boolean` - If `true`, the cloning algorithm will convert 
      the names of the properties of the target object according to the
      specified naming styles. The default value of this option is `false`.
    - `sourceNamingStyle: string | NamingStyle`, the naming style of the source
      object. This option is only effective when the `convertNaming` option is
      set to `true`. The value of this options can be either a string representing
      the name of the naming style, or a `NamingStyle` instance. The default 
      value is `LOWER_CAMEL`.
    - `targetNamingStyle: string | NamingStyle`, the naming style of the target
      object, i.e., the cloned object. This option is only effective when the
      `convertNaming` option is set to `true`. The value of this options can be 
      either a string representing the name of the naming style, or a 
      `NamingStyle` instance. The default value is `LOWER_CAMEL`.
    - `pojo: boolean` - If this options is set to `true`, the cloning algorithm
      will convert the source object to a plain old JavaScript object (POJO).
      The default value of this option is `false`.
    - `removeEmptyFields: boolean` - If this options is set to `true`, the cloning
      algorithm will recursively remove the empty fields of the source object
      before cloning. An empty field refers to a field with a value of `null`,
      `undefined`, an empty string, an empty array, or an empty set. The default
      value of this option is `false`.
    - `disableHooks: boolean` - If this options is set to `true`, the cloning
      algorithm will disable the cloning hooks. The default value of this option
      is `false`.
    - `useToJSON: boolean` - If this options is set to `true`, and the source object
      has a `toJSON()` method, the cloning algorithm will use the `toJSON()` method
      of the source object as the result of the cloning. The default value of this
      option is `false`.
    - `skipRootToJSON: boolean` - If this options and the option `useToJSON` are 
      both set to `true`, and the source object has a `toJSON()` method, the 
      cloning algorithm will use the result of the `toJSON()` method as the
      result of the cloning if and only if the source object is not the root
      object of the cloning process. This option is very useful when implementing
      the `toJSON()` method of a class or a object using the `clone()` function,
      since it could avoid infinite recursion. The default value of this option
      is `false`.

The clone function supports cloning customized objects as well as JavaScript 
built-in values and objects, including but not limited to primitive types, 
arrays, `Map`, `Set`, etc. The specific support is as follows:

- Primitive types `undefined`, `null`, `boolean`, `number`, `string`, `symbol`, 
  `bigint`: Returns the original value directly.
- Function type: Fully implementing `clone` for functions brings many technical 
  troubles, so this function does not clone function types and returns the 
  original function directly.
- Object types: Divided into JavaScript built-in objects and user objects:
    - Ordinary non-container built-in objects: Returns a new object identical 
      to the original, including custom attributes added by the user on the 
      original object, which will also be deeply cloned.
    - Built-in container objects, including `Array`, `Map`, `Set`, `Int8Array`,
      `BigUint64Array`, etc.: Clones the container object itself and deeply 
      clones the elements within the container object.
    - Weak reference objects, including `WeakMap`, `WeakSet`, `WeakRef`, etc.: 
      Cannot be cloned, returns the object itself.
    - `Buffer` objects, including `ArrayBuffer`, `SharedArrayBuffer`, etc.: 
      Clones the container object itself and clones the data within the 
      container object.
    - `Promise` objects: Clones a new `Promise` object, including custom 
      attributes added by the user on the original object.
    - [Intl] built-in object's sub-objects, including `Intl.Collator`, 
      `Intl.DateTimeFormat`, etc.: Cannot be cloned, returns the object itself.
    - `Iterator` objects, including `ArrayIterator`, `MapIterator`, 
      `SetIterator`, etc.: Cannot be cloned, returns the object itself.
    - [arguments] object representing function parameters: Cannot be cloned, 
      returns the object itself.
    - `FinalizationRegistry` object: Cannot be cloned, returns the object itself.
    - Generator objects, including `Generator`, `AsyncGenerator`: Cannot be 
      cloned, thus returns the object itself.
    - [Global object]: Cannot be cloned, returns the object itself.
    - Other user-defined objects: Deeply clones all properties of the object and
      maintains the prototype of the cloned object. Whether to clone readonly, 
      non-enumerable, non-configurable, accessor properties, etc., depends on 
      the second argument provided to the `clone()` function.

### <span id="register-clone-hook">registerCloneHook(hook)</span>

Registers a custom object cloning hook function.

- `hook: function` - The hook function, which should be in the form of:
  ```js
  function cloneHook(info, obj, options) {};
  ```
  Where:
    - `info: object`: Type information of the object to be cloned, provided by
      [typeInfo()] function.
    - `obj: object`: The object to be cloned, guaranteed non-null.
    - `options: object`: Options for the cloning algorithm.

### <span id="unregister-clone-hook">unregisterCloneHook(hook)</span>

Unregisters a custom object cloning hook function.

- `hook: function` - The hook function to unregister, in the same form and
  parameters as [registerCloneHook()](#register-clone-hook).

### <span id="clone-impl">cloneImpl(source, depth, options, cache)</span>

Implements the specific `clone` algorithm. This is an internal used function that 
can be used to implement custom clone hook functions.

- `source: any` - The object to be cloned.
- `depth: number` - The current depth of the cloning algorithm. The depth of the
  root object is 0.
- `options: object` - Options for the cloning algorithm.
- `cache: WeakMap` - Object cache used to prevent circular references.

### <span id="copy-properties">copyProperties(source, target, depth, options, cache)</span>

Copies properties from the source object to the target object. This is an
internal used function that can be used to implement custom clone hook functions.

- `source: any` - The source object.
- `target: any` - The target object.
- `depth: number` - The current depth of the cloning algorithm. The depth of the
  root object is 0.
- `options: object` - Options for the cloning algorithm.
- `cache: WeakMap` - Object cache used to prevent circular references.

## <span id="examples">Examples</span>

### <span id="clone">Deep Cloning Objects</span>

The following code example demonstrates how to deeply clone an object, which can
be a simple object or an instance of a custom class.
```js
import clone from '@qubit-ltd/clone';

const obj1 = { a: 1, b: { c: 2 } };
const copy1 = clone(obj1);
expect(copy1).toEqual(obj1);
expect(copy1).not.toBe(obj1);

class Credential {
  type = '';
  number = '';
}
class Person {
  name = '';
  age = 0;
  credential = new Credential();
}
const obj2 = new Person();
obj2.name = 'Bill Gates';
obj2.age = 30;
obj2.credential.type = 'PASSWORD';
obj2.credential.number = '111111';
const copy2 = clone(obj2);
expect(copy2).toEqual(obj2);
expect(copy2).not.toBe(obj2);
expect(copy2).toBeInstanceOf(Person);
expect(copy2.credential).toBeInstanceOf(Credential);
```

### <span id="clone-with-options">Cloning with Options</span>

The following code example demonstrates how to use custom cloning algorithm 
options. For specific options, refer to the [API Documentation](#api).

```js
const obj = {
  x: 1,
  y: 2,
  _name: 'obj',
  get z() {
    return this.x + this.y;
  },
  get name() {
    return this._name;
  },
  set name(s) {
    this._name = s;
  },
};
Object.defineProperties(obj, {
  r: {
    value: 'readonly',
    writable: false,
    configurable: true,
    enumerable: true,
  },
});
Object.defineProperties(obj, {
  nc: {
    value: 'non-configurable',
    writable: true,
    configurable: false,
    enumerable: true,
  },
});
Object.defineProperties(obj, {
  ne: {
    value: 'non-enumerable',
    writable: true,
    configurable: true,
    enumerable: false,
  },
});

// clone with default options
const copy1 = clone(obj);
expect(copy1.x).toBe(1);
expect(copy1.y).toBe(2);
expect(copy1.r).toBe('readonly');
expect(copy1.z).toBe(3);
expect(typeof copy1.z).toBe('number');
expect(copy1.name).toBe('obj');
expect(typeof copy1.name).toBe('string');
expect(copy1._name).toBe('obj');
expect(typeof copy1._name).toBe('string');
expect('nc' in copy1).toBe(false);
expect('ne' in copy1).toBe(false);

// clone with customized options
const options = {
  includeAccessor: true,
  excludeReadonly: true,
  includeNonEnumerable: true,
  includeNonConfigurable: false,
};
const copy2 = clone(obj, options);
expect(copy2.x).toBe(1);
expect(copy2.y).toBe(2);
expect('r' in copy2).toBe(false);
expect(copy2.z).toBe(3);
expect(copy2._name).toBe('obj');
expect(copy2.name).toBe('obj');
const zd = Object.getOwnPropertyDescriptor(copy2, 'z');
expect(typeof zd.get).toBe('function');
expect(typeof zd.set).toBe('undefined');
expect('value' in zd).toBe(false);
const nd = Object.getOwnPropertyDescriptor(copy2, 'name');
expect(typeof nd.get).toBe('function');
expect(typeof nd.set).toBe('function');
expect('value' in nd).toBe(false);
copy2.name = 'xxx';
expect(copy2.name).toBe('xxx');
expect(copy2._name).toBe('xxx');
expect('ne' in copy2).toBe(true);
expect(copy2.ne).toBe('non-enumerable');
expect('nc' in copy2).toBe(false);
```

### <span id="clone-with-naming-conversion">Cloning with Naming Conversion</span>

The following code example demonstrates how to clone with custom naming 
conversion rules. For specific options, refer to the [API Documentation](#api).

```js
import clone from '@qubit-ltd/clone';

class Credential {
  type = '';
  number = '';
}
class Person {
  name = '';
  age = 0;
  credential = new Credential();
}
const person = new Person();
person.name = 'Bill Gates';
person.age = 30;
person.credential.type = 'PASSWORD';
person.credential.number = '111111';
const copy2 = clone(person);
expect(copy2).toEqual(person);
expect(copy2).not.toBe(person);
expect(copy2).toBeInstanceOf(Person);
expect(copy2.credential).toBeInstanceOf(Credential);

const obj = {
  first_field: 'first-field',
  second_field: {
    first_child_field: 'first-child-field',
    second_child_field: {
      the_person: person,
    },
  }
};
const copy = clone(obj, {
  convertNaming: true,
  sourceNamingStyle: 'lower-underscore',
  targetNamingStyle: 'lower_camel',
});
expect(copy).toBeInstanceOf(Object);
expect(copy.firstField).toBe(obj.first_field);
expect(copy.secondField).toBeInstanceOf(Object);
expect(copy.secondField.firstChildField).toBe(obj.second_field.first_child_field);
expect(copy.secondField.secondChildField).toBeInstanceOf(Object);
expect(copy.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
expect(copy.secondField.secondChildField.thePerson).toEqual(person);
expect(copy.secondField.secondChildField.thePerson).not.toBe(person);
```

Note that the naming conversion styles can be specified either by a string
or by a `NamingStyle` instance. If it is specified by a string, the string
is compared case-insensitively and the characters `'-'` and `'_'` are treated as
the same. See `NamingStyle.of()` function for more details.

### <span id="customize-clone-hook">Customizing Clone Behavior</span>

```js
import { registerCloneHook, clone } from '@qubit-ltd/clone';

function customCloneHook(info, obj, options) {
  if (info.constructor === MyCustomClass) {
    const result = new MyCustomClass();
    // Implements the customized clone algorithm
    return result;
  }
  return null;
}

registerCloneHook(customCloneHook);

const original = {
  name: 'original',
  data: new MyCustomClass(),
};
const cloned = clone(original);

unregisterCloneHook(customCloneHook);
```

### <span id="clone-circular">Cloning Complex Structures with Circular References</span>

The clone function can handle complex objects with circular references, preventing infinite recursion:

```js
import clone from '@qubit-ltd/clone';

// Create an object with circular reference
const original = {
  name: 'original',
  nested: {
    data: 42
  }
};
// Create circular reference
original.self = original;
original.nested.parent = original;

// Clone it safely
const cloned = clone(original);

// Verify circular references are maintained
expect(cloned.self).toBe(cloned); // Not original, but points to cloned
expect(cloned.nested.parent).toBe(cloned);
expect(cloned).not.toBe(original);
expect(cloned.nested).not.toBe(original.nested);
```

### <span id="clone-vue">Using with Vue.js</span>

The clone function is compatible with Vue.js reactivity system:

```js
import { reactive } from 'vue';
import clone from '@qubit-ltd/clone';

// Create a reactive object
const original = reactive({
  count: 0,
  items: [1, 2, 3],
  nested: {
    value: 'test'
  }
});

// Clone it
const cloned = clone(original);

// The cloned object isn't reactive, but has all the same values
console.log(cloned.count); // 0
console.log(cloned.items); // [1, 2, 3]
console.log(cloned.nested.value); // 'test'

// You can make the clone reactive again if needed
const reactiveClone = reactive(cloned);
```

## <span id="test-coverage">Test Coverage</span>

This library has 100% test coverage across all metrics:

- **Statements**: 100% (135/135)
- **Branches**: 100% (98/98)
- **Functions**: 100% (20/20)
- **Lines**: 100% (135/135)

The test suite includes over 34 test suites with 347 individual test cases covering all aspects of the library's functionality, including edge cases, different object types, and various configuration options.

To run the tests and check coverage:

```bash
yarn test --coverage
```

## <span id="license">License</span>

[clone] is distributed under the Apache 2.0 License. For more details, please 
refer to the [LICENSE](LICENSE) file.

## <span id="contributing">Contributing</span>

If you encounter any issues or have suggestions for improvements, feel free to 
open an issue or submit a pull request in the [GitHub repository].

When contributing to this project, please ensure:
1. All tests pass with 100% coverage
2. New features or changes are properly documented
3. Code follows the existing style conventions
4. Commit messages are clear and descriptive

## <span id="contributor">Contributors</span>

- [Haixing Hu](https://github.com/haixing-hu)

[naming-style]: https://npmjs.com/package/@qubit-ltd/naming-style
[type-detect]: https://npmjs.com/package/@qubit-ltd/type-detect
[typeinfo]: https://npmjs.com/package/@qubit-ltd/typeinfo
[typeInfo()]: https://npmjs.com/package/@qubit-ltd/typeinfo
[clone]: https://npmjs.com/package/@qubit-ltd/clone
[structuredClone()]: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
[arguments]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[Global object]: https://developer.mozilla.org/en-US/docs/Glossary/Global_object
[GitHub repository]: https://github.com/qubit-ltd/js-clone
