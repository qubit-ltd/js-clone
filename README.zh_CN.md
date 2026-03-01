# @qubit-ltd/clone

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/clone.svg)](https://npmjs.com/package/@qubit-ltd/clone)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/文档-中文版-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/qubit-ltd/js-clone/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/qubit-ltd/js-clone/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/qubit-ltd/js-clone/badge.svg?branch=master)](https://coveralls.io/github/qubit-ltd/js-clone?branch=master)

[clone] 是一个 JavaScript 库，用于深度克隆 JavaScript 对象。它保持对象及其所有属性的原型，
并支持自定义克隆钩子函数，允许对指定类型执行特殊的克隆算法。

不同于内置的 [structuredClone()] 函数，此开源库具有以下特性：

- **深度克隆**：能够深度克隆任意 JavaScript 对象，包括但不限于简单对象、自定义类的实例、
  `Array`、`Map`、`Set`、`Date`、`RegExp`、`Error`、`Promise` 等。
- **保持原型**：克隆的对象保持原有对象的原型。
- **循环引用检测**：能够检测循环引用，并防止无限递归。
- **支持内置对象的自定义属性**：由于 JavaScript 语言的灵活性，对于内置对象，用户可以在该对象
  上任意设置自定义属性，例如`const str = 'hello'; str.x = 123;`，本函数库能够克隆这些自定
  义属性。
- **可自定义的克隆算法参数**：支持自定义克隆算法参数，通过参数定制克隆算法。
- **可自定义的命名转换规则**：支持自定义命名转换规则，允许转换克隆结果对象属性的命名风格。
- **可自定义的克隆算法**：支持自定义克隆算法，通过注册钩子函数定制对特定类型的克隆算法。
- **Vue.js 反应性支持**：兼容 Vue.js 的反应性系统，只克隆可枚举属性。
- **100% 测试覆盖率**：该库的每一行代码、每个分支和每个函数都经过全面测试，确保在不同使用场景下的可靠行为。

## <span id="contents">目录</span>

- [安装](#installation)
- [使用方法](#usage)
- [项目结构](#project-structure)
- [API 文档](#api)
  - [clone(source, [options])](#clone)
  - [registerCloneHook(hook)](#register-clone-hook)
  - [unregisterCloneHook(hook)](#unregister-clone-hook)
  - [cloneImpl(source, depth, options, cache)](#clone-impl)
  - [copyProperties(source, target, depth, options, cache)](#copy-properties)
- [示例](#examples)
  - [深度克隆对象](#clone)
  - [克隆算法选项](#clone-with-options)
  - [带命名转换的克隆](#clone-with-naming-conversion)
  - [定制克隆行为](#customize-clone-hook)
  - [克隆带循环引用的复杂结构](#clone-circular)
  - [与 Vue.js 一起使用](#clone-vue)
- [测试覆盖率](#test-coverage)
- [许可证](#license)
- [贡献方式](#contributing)
- [贡献者](#contributor)

## <span id="installation">安装</span>

此函数库依赖[naming-style]、[type-detect]和[typeinfo]函数库，因此需要先安装它们。

通过 npm 安装：
```bash
npm install @babel/runtime @qubit-ltd/naming-style @qubit-ltd/type-detect @qubit-ltd/typeinfo @qubit-ltd/clone
```
或者通过 `yarn` 安装
```bash
yarn add @babel/runtime @qubit-ltd/naming-style @qubit-ltd/type-detect @qubit-ltd/typeinfo @qubit-ltd/clone
```

## <span id="usage">使用方法</span>

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
obj2.credential.number = '111111'
const copy2 = clone(obj2);
expect(copy2).toEqual(obj2);
expect(copy2).not.toBe(obj2);
expect(copy2).toBeInstanceOf(Person);
expect(copy2.credential).toBeInstanceOf(Credential);
```

## <span id="project-structure">项目结构</span>

项目的组织结构如下：

- `src/`：包含源代码
  - `clone.js`：深度克隆对象的主函数
  - `default-clone-options.js`：克隆算法的默认选项
  - `register-clone-hook.js`：注册自定义克隆钩子的函数
  - `unregister-clone-hook.js`：注销自定义克隆钩子的函数
  - `impl/`：不同类型克隆算法的实现
    - `clone-array.js`：克隆数组的实现
    - `clone-buffer.js`：克隆缓冲区对象的实现
    - `clone-copy-constructable-object.js`：克隆具有复制构造函数的对象的实现
    - `clone-customized-object.js`：克隆自定义对象的实现
    - `clone-data-view.js`：克隆 DataView 对象的实现
    - `clone-error.js`：克隆 Error 对象的实现
    - `clone-hooks.js`：克隆钩子的管理
    - `clone-impl.js`：克隆算法的核心实现
    - `clone-map.js`：克隆 Map 对象的实现
    - `clone-object-impl.js`：克隆普通对象的实现
    - `clone-primitive-wrapper-object.js`：克隆原始包装对象的实现
    - `clone-promise.js`：克隆 Promise 对象的实现
    - `clone-set.js`：克隆 Set 对象的实现
    - `clone-typed-array.js`：克隆 TypedArray 对象的实现
    - `copy-properties.js`：用于在对象之间复制属性的工具函数
    - `get-target-key.js`：重命名属性时获取目标键的工具函数
    - `is-empty.js`：检查值是否为空的工具函数
- `test/`：包含所有功能的综合测试套件
- `dist/`：包含构建的分发文件

## <span id="api">API 文档</span>

### <span id="clone">clone(source, [options])</span>

深度克隆一个值或对象。

- `source: any` - 要克隆的值或对象。
- `options: object` - 克隆算法的选项对象。可能的选项包括：
  - `includeAccessor: boolean`：若为 `true`，将克隆属性的访问器（即 getter 和 setter）。
    默认为 `false`。
  - `excludeReadonly: boolean`：若为 `true`，将不克隆只读属性。默认为 `false`。
  - `includeNonEnumerable: boolean`：若为 `true`，将克隆非枚举属性。默认为 `false`。
  - `includeNonConfigurable: boolean`：若为 `true`，将克隆非可配置属性。默认为 `false`。
  - `autoIncludeNonConfigurableForFrozen: boolean`：若为 `true`，且
    `includeNonConfigurable` 为 `false`，当当前源对象为 frozen 对象时，
    克隆算法会自动包含其 non-configurable 属性。默认为 `true`。该默认值
    用于避免克隆冻结业务对象时意外丢失数据字段。
  - `convertNaming: boolean` - 若为 `true`，克隆算法将根据指定的命名风格转换目标对象的属性名称。
    此选项的默认值为 `false`。
  - `sourceNamingStyle: string | NamingStyle`, 源对象的命名样式。该选项仅在 `convertNaming` 
    选项设置为 `true` 时有效。该选项的值可以是表示命名样式名称的字符串，也可以是一个
    `NamingStyle` 实例。默认值为 `LOWER_CAMEL`。
  - `targetNamingStyle: string | NamingStyle`, 目标对象（即克隆结果对象）的命名样式。
    该选项仅在 `convertNaming` 选项设置为 `true` 时有效。该选项的值可以是表示命名样式名称
    的字符串，也可以是一个`NamingStyle` 实例。默认值为 `LOWER_CAMEL`。
  - `pojo: boolean` - 如果此选项设置为 `true`，克隆算法将把源对象转换为普通的 JavaScript 
    对象 (POJO)。此选项的默认值为`false`。
  - `removeEmptyFields: boolean` - 如果此选项设置为 `true`，克隆算法将在克隆之前递归地移
    除源对象的空字段。所谓空字段，是指值为`null`，`undefined`，空字符串，空数组，空集合的字段。
    此选项的默认值为`false`。
  - `disableHooks: boolean` - 如果此选项设置为 `true`，克隆算法将禁用克隆钩子函数。
    此选项的默认值为 `false`。
  - `useToJSON: boolean` - 如果该选项设置为 `true`，并且源对象具有 `toJSON()` 方法，
    克隆算法将使用源对象的 `toJSON()` 方法作为克隆的结果。此选项的默认值为 `false`。
  - `skipRootToJSON: boolean` - 如果该选项和 `useToJSON` 选项都设置为 `true`，并且源
    对象具有 `toJSON()` 方法，克隆算法只有在源对象不是克隆过程的根对象时，才会使用 `toJSON()`
    方法的结果作为克隆结果。当使用 `clone()` 函数实现类或对象的 `toJSON()` 方法时，该选项
    非常有用，因为它可以避免无限递归。此选项的默认值为 `false`。

克隆函数支持对 JavaScript 内置对象的克隆，包括但不限于 primitive 类型、数组、`Map`、`Set`等。
具体的支持如下：

- primitive 类型 `undefined`、`null`、`boolean`、`number`、`string`、`symbol`、`bigint`：直接返回原始值；
- 函数类型：要完整实现对函数的 `clone` 会带来很多技术上的麻烦，因此本函数对函数类型的值不做克隆，直接返回原始函数；
- 对象类型：分为 JavaScript 内置对象和用户对象两种情况：
  - 普通非容器型内置对象：会返回一个新的对象，和原始对象完全一致，包括用户增加在原始对象上的自定义属性，
    也会一起被深度克隆；
  - 内置容器对象，包括`Array`、`Map`、`Set`、`Int8Array`、`BigUint64Array`等：会克隆容器对象
    本身，同时深度克隆容器对象中的元素；
  - 弱引用对象，包括：`WeakMap`、`WeakSet`、`WeakRef`等：不可被克隆，直接返回该对象本身；
  - `Buffer`对象，包括 `ArrayBuffer`、`SharedArrayBuffer`等：会克隆容器对象本身，同时克隆容器对象中的数据；
  - `Promise`对象：会克隆一个新的 `Promise` 对象，包括用户增加在原始对象上的自定义属性；
  - [Intl] 内置对象的子对象，包括`Intl.Collator`、`Intl.DateTimeFormat`等：不可被克隆，直接返回该对象本身；
  - `Iterator` 对象，包括`ArrayIterator`、`MapIterator`、`SetIterator`等：不可被克隆，直接返回该对象本身；
  - 表示函数参数的 [arguments] 对象：不可被克隆，直接返回该对象本身；
  - `FinalizationRegistry` 对象：不可被克隆，直接返回该对象本身；
  - 生成器对象，包括 `Generator`、`AsyncGenerator`：不可被克隆，因此直接返回该对象本身；
  - [全局对象]：不可被克隆，直接返回该对象本身；
  - 其他用户自定义对象：深度克隆该对象所有属性，并保持被克隆对象的原型。是否克隆只读属性、不可枚举属性、不可配置属性、
    访问器属性等，取决于调用 `clone()` 函数的第二个克隆算法选项参数。

### <span id="register-clone-hook">registerCloneHook(hook)</span>

注册一个自定义对象克隆的钩子函数。

- `hook: function` - 钩子函数，其形式应为：
  ```js
  function cloneHook(info, obj, options) {};
  ```
  其中：
    - `info: object`：待克隆对象的类型信息，由 [typeInfo()] 函数提供。
    - `obj: object`：待克隆的对象，保证非空。
    - `options: object`：克隆算法的选项。

### <span id="unregister-clone-hook">unregisterCloneHook(hook)</span>

注销一个自定义对象克隆的钩子函数。

- `hook: function` - 要注销的钩子函数，其形式和参数与 [registerCloneHook()](#register-clone-hook) 相同。

### <span id="clone-impl">cloneImpl(source, depth, options, cache)</span>

实现了具体的`clone` 算法。这是一个内部函数，可用于实现自定义的克隆钩子函数。

- `source: any` - 待克隆的对象。
- `depth: number` - 当前克隆的深度。根对象的深度为 0。
- `options: object` - 克隆算法的选项。
- `cache: WeakMap` - 用于防止循环引用的对象缓存。

### <span id="copy-properties">copyProperties(source, target, depth, options, cache)</span>

将源对象的属性复制到目标对象。这是一个内部函数，可用于实现自定义的克隆钩子函数。

- `source: any` - 源对象。
- `target: any` - 目标对象。
- `depth: number` - 当前克隆的深度。根对象的深度为 0。
- `options: object` - 克隆算法的选项。
- `cache: WeakMap` - 用于防止循环引用的对象缓存。

## <span id="examples">示例</span>

### <span id="clone">深度克隆对象</span>

下面的代码例子展示了如何深度克隆一个对象，可以是简单对象，也可以是自定义类的实例。
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
obj2.credential.number = '111111'
const copy2 = clone(obj2);
expect(copy2).toEqual(obj2);
expect(copy2).not.toBe(obj2);
expect(copy2).toBeInstanceOf(Person);
expect(copy2.credential).toBeInstanceOf(Credential);
```

### <span id="clone-with-options">克隆算法选项</span>

下面的代码例子展示了如何使用自定义的克隆算法选项。具体的选项请参考[API 文档](#api)。
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
  autoIncludeNonConfigurableForFrozen: true,
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

### <span id="clone-with-naming-conversion">带命名转换的克隆</span>

以下代码示例演示了如何使用自定义命名转换规则进行克隆。具体选项请参考 [API 文档](#api)。

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

请注意，命名转换样式可以通过字符串或 `NamingStyle` 实例指定。如果通过字符串指定，则字符串不
区分大小写，并且字符 `'-'` 和 `'_'`; 被视为相同。有关更多详细信息，请参阅 
`NamingStyle.of()` 函数。

### <span id="customize-clone-hook">定制克隆行为</span>

```js
import { registerCloneHook, clone } from '@qubit-ltd/clone';

function customCloneHook(info, obj, options) {
  if (info.constructor === MyCustomClass) {
    const result = new MyCustomClass();
    // implements the customized clone algorithm
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

### <span id="clone-circular">克隆带循环引用的复杂结构</span>

克隆函数可以处理带有循环引用的复杂对象，防止无限递归：

```js
import clone from '@qubit-ltd/clone';

// 创建一个带有循环引用的对象
const original = {
  name: 'original',
  nested: {
    data: 42
  }
};
// 创建循环引用
original.self = original;
original.nested.parent = original;

// 安全地克隆
const cloned = clone(original);

// 验证循环引用被正确维护
expect(cloned.self).toBe(cloned); // 不是指向原始对象，而是指向克隆对象
expect(cloned.nested.parent).toBe(cloned);
expect(cloned).not.toBe(original);
expect(cloned.nested).not.toBe(original.nested);
```

### <span id="clone-vue">与 Vue.js 一起使用</span>

克隆函数与 Vue.js 的反应性系统兼容：

```js
import { reactive } from 'vue';
import clone from '@qubit-ltd/clone';

// 创建一个响应式对象
const original = reactive({
  count: 0,
  items: [1, 2, 3],
  nested: {
    value: 'test'
  }
});

// 克隆它
const cloned = clone(original);

// 克隆对象不是响应式的，但具有所有相同的值
console.log(cloned.count); // 0
console.log(cloned.items); // [1, 2, 3]
console.log(cloned.nested.value); // 'test'

// 如果需要，可以将克隆对象再次转为响应式
const reactiveClone = reactive(cloned);
```

## <span id="test-coverage">测试覆盖率</span>

本库具有100%的测试覆盖率，涵盖所有指标：

- **语句覆盖率**: 100% (135/135)
- **分支覆盖率**: 100% (98/98)
- **函数覆盖率**: 100% (20/20)
- **行覆盖率**: 100% (135/135)

测试套件包含超过34个测试套件，共347个独立测试用例，覆盖了库的所有功能，包括边缘情况、不同对象类型和各种配置选项。

要运行测试并检查覆盖率：

```bash
yarn test --coverage
```

## <span id="license">许可证</span>

[clone] 在 Apache 2.0 许可下分发。有关更多详情，请参阅 [LICENSE](LICENSE) 文件。

## <span id="contributing">贡献方式</span>

如果您发现任何问题或有改进建议，请随时在[GitHub仓库]中提出问题或提交拉取请求。

在贡献此项目时，请确保：
1. 所有测试都通过，并保持100%的覆盖率
2. 新功能或变更都有适当的文档
3. 代码遵循现有的风格约定
4. 提交消息清晰且具有描述性

## <span id="contributor">贡献者</span>

- [Haixing Hu](https://github.com/haixing-hu)


[naming-style]: https://npmjs.com/package/@qubit-ltd/naming-style
[type-detect]: https://npmjs.com/package/@qubit-ltd/type-detect
[typeinfo]: https://npmjs.com/package/@qubit-ltd/typeinfo
[typeInfo()]: https://npmjs.com/package/@qubit-ltd/typeinfo
[clone]: https://npmjs.com/package/@qubit-ltd/clone
[structuredClone()]: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
[arguments]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[全局对象]: https://developer.mozilla.org/en-US/docs/Glossary/Global_object
[GitHub仓库]: https://github.com/qubit-ltd/js-clone
