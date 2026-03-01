////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/* eslint-disable import/no-cycle */
/*
 * Recursion-chain note:
 *
 * copyProperties() is a recursive bridge used by multiple cloneXxx modules.
 * It calls cloneImpl() for each property value so that nested structures are
 * cloned consistently with the same option set and cache.
 *
 * This file participates in intentional static cycles such as:
 * clone-impl -> clone-object-impl -> clone-array/map/set -> copy-properties -> clone-impl
 *
 * The cycle is required by algorithm design (deep recursive traversal) and is
 * evaluated at runtime through function calls, not via top-level eager code.
 */
import cloneImpl from './clone-impl';
import getTargetKey from './get-target-key';
import isEmpty from './is-empty';

/**
 * Copies the properties of the source object to the target object.
 *
 * **NOTE:** In order to support the reactivity of Vue.js, we only copy the
 * enumerable properties of the object, and do not consider the getters and
 * setters of the object. We directly take out the property value from the
 * source object (possibly by calling the getter), recursively deep-clone it
 * and copy it to the target object (possibly by calling the setter). Therefore,
 * the `includeAccessor` and `includeNonEnumerable` parameters of options should
 * not be set or should be set to `false`.
 *
 * For the reactivity of Vue.js, see:
 * <a href="https://v2.vuejs.org/v2/guide/reactivity.html">Reactivity</a>
 *
 * @param {object} source
 *     The source object.
 * @param {object} target
 *     The target object.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @see https://v2.vuejs.org/v2/guide/reactivity.html
 * @author Haixing Hu
 */
function copyProperties(source, target, depth, options, cache) {
  const sourceKeys = Reflect.ownKeys(source);
  for (const sourceKey of sourceKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(source, sourceKey);
    if ((!options.includeNonConfigurable) && (!descriptor.configurable)) {
      continue; // ignore non-configurable properties, such as string[0]
    }
    if ((!options.includeNonEnumerable) && (!descriptor.enumerable)) {
      continue; // ignore non-enumerable properties
    }
    if ((options.excludeReadonly) && (descriptor.writable === false)) {
      continue; // ignore readonly properties
    }
    const targetKey = getTargetKey(sourceKey, options);
    if (options.includeAccessor && (descriptor.get || descriptor.set)) {
      Object.defineProperty(target, targetKey, descriptor);
      continue;
    }
    // use [] to get property value instead of descriptor.value, since if
    // the property has getter/setter, descriptor.value do not exist, and
    // use [] will invoke the getter, which is just what we want.
    const value = source[sourceKey];

    if (options.removeEmptyFields && isEmpty(value)) {
      continue;
    }
    target[targetKey] = cloneImpl(value, sourceKey, depth + 1, options, cache); // recursive call
  }
}

export default copyProperties;
