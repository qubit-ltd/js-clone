////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import typeInfo from '@qubit-ltd/typeinfo';
import { NamingStyle } from '@qubit-ltd/naming-style';
import cloneImpl from './impl/clone-impl';
import DEFAULT_CLONE_OPTIONS from './default-clone-options';

/**
 * Deep clones a value or an object.
 *
 * **NOTE:** In order to support the reactivity of Vue.js, we only copy the
 * enumerable properties of the object, and do not consider the getters and
 * setters of the object. We directly take out the property value from the
 * source object (possibly by calling the getter), recursively deep-clone it
 * and copy it to the target object (possibly by calling the setter).
 *
 * The cloning algorithm have the following options:
 *
 * - `includeAccessor: boolean` - If this options is set to `true`, the cloning
 *   algorithm will clone the accessors of the properties (i.e. getters and
 *   setters) from the source object. The default value of this option is `false`.
 * - `excludeReadonly: boolean` - If this options is set to `true`, the cloning
 *   algorithm will **NOT** clone the readonly attributes from the source object.
 *   The default value of this option is `false`.
 * - `includeNonEnumerable: boolean` - If this options is set to `true`, the
 *   cloning algorithm will clone the non-enumerable attributes from the source
 *   object. The default value of this option is `false`.
 * - `includeNonConfigurable: boolean` - If this options is set to `true`, the
 *   cloning algorithm will clone the non-configurable attributes from the source
 *   object. The default value of this option is `false`.
 * - `convertNaming: boolean` - If this options is set to `true`, the cloning
 *   algorithm will convert the names of the properties of the target object
 *   according to the specified naming styles. The default value of this
 *   option is `false`.
 * - `sourceNamingStyle: string | NamingStyle`, the naming style of the source
 *   object. This option is only effective when the `convertNaming` option is
 *   set to `true`. The value of this options can be either a string representing
 *   the name of the naming style, or a `NamingStyle` instance. The default
 *   value is `LOWER_CAMEL`.
 * - `targetNamingStyle: string | NamingStyle`, the naming style of the target
 *   object. This option is only effective when the `convertNaming` option is
 *   set to `true`. The value of this options can be either a string representing
 *   the name of the naming style, or a `NamingStyle` instance. The default
 *   value is `LOWER_CAMEL`.
 * - `pojo: boolean` - If this options is set to `true`, the cloning algorithm
 *   will convert the source object to a plain old JavaScript object (POJO).
 *   The default value of this option is `false`.
 * - `removeEmptyFields: boolean` - If this options is set to `true`, the cloning
 *   algorithm will recursively remove the empty fields of the source object
 *   before cloning. An empty field refers to a field with a value of `null`,
 *   `undefined`, an empty string, an empty array, or an empty set. The default
 *   value of this option is `false`.
 * - `disableHooks: boolean` - If this options is set to `true`, the cloning
 *   algorithm will disable the cloning hooks. The default value of this option
 *   is `false`.
 * - `useToJSON: boolean` - If this options is set to `true`, and the source object
 *   has a `toJSON()` method, the cloning algorithm will use the `toJSON()` method
 *   of the source object to generate the target object. The default value of this
 *   option is `false`.
 * - `skipRootToJSON: boolean` - If this options and the option `useToJSON` are
 *   both set to `true`, and the source object has a `toJSON()` method, the
 *   cloning algorithm will use the result of the `toJSON()` method as the result
 *   of the cloning if and only if the source object is not the root object of
 *   the cloning process. This option is very useful when implementing the
 *   `toJSON()` method of a class with the `clone()` function, since it could
 *   avoid infinite recursion. The default value of this option is `false`.
 *
 * Usage examples:
 * ```js
 * const source = {
 *  firstName: 'Haixing',
 *  lastName: 'Hu',
 *  age: 40,
 *
 * ```
 *
 * @param {any} source
 *     The value or object to be cloned.
 * @param {Object} options
 *     Optional argument, representing the options of the cloning algorithm.
 *     The default value is `{}`.
 * @return {any}
 *     The deep clone of the specified value or object.
 * @see NamingStyle
 * @author Haixing Hu
 */
function clone(source, options = {}) {
  // We want to preserve correct structure in objects with tricky references,
  // e.g. cyclic structures or structures with two references to the same object.
  // To do this, we'll cache the results of this function during this invocation,
  // and return from this cache when possible.
  // Note that we only store certain values, like Arrays or plain object.
  const cache = new WeakMap();
  options = { ...DEFAULT_CLONE_OPTIONS, ...options };
  if (options.convertNaming) {
    if (options.sourceNamingStyle) {
      options.sourceNamingStyle = NamingStyle.of(options.sourceNamingStyle);
    }
    if (options.targetNamingStyle) {
      options.targetNamingStyle = NamingStyle.of(options.targetNamingStyle);
    }
  }
  return cloneImpl(source, '', 0, options, cache);
}

export default clone;
