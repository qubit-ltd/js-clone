////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/* eslint-disable import/no-cycle */
/*
 * Recursion-chain note:
 *
 * This module is the central recursive entry of the cloning algorithm.
 * The following static import cycles are intentional and reflect runtime
 * recursion requirements instead of a module-initialization bug:
 *
 * 1) clone-impl -> clone-object-impl -> clone-array -> clone-impl
 * 2) clone-impl -> clone-object-impl -> clone-map   -> clone-impl
 * 3) clone-impl -> clone-object-impl -> clone-set   -> clone-impl
 * 4) clone-impl -> clone-object-impl -> clone-array -> copy-properties -> clone-impl
 * 5) clone-impl -> clone-object-impl -> clone-map   -> copy-properties -> clone-impl
 * 6) clone-impl -> clone-object-impl -> clone-set   -> copy-properties -> clone-impl
 *
 * Runtime recursion path:
 * cloneImpl() -> cloneObjectImpl() -> cloneXxx() -> cloneImpl()/copyProperties()
 *
 * Why this is safe:
 * - modules export function declarations only;
 * - no top-level eager invocation of imported clone functions;
 * - recursion happens at call time with cache-based cycle protection.
 */
import typeInfo from '@qubit-ltd/typeinfo';
import CLONE_HOOKS from './clone-hooks';
import cloneObjectImpl from './clone-object-impl';

/**
 * Determines whether the `toJSON()` method should be used to clone the source
 * object.
 *
 * @param {any} source
 *     The source value to be cloned.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {object} options
 *     The options of the cloning algorithm.
 * @return {boolean}
 *     `true` if the `toJSON()` method should be used to clone the source object;
 *     `false` otherwise.
 * @private
 * @author Haixing Hu
 */
function shouldUseToJSON(source, depth, options) {
  return options.useToJSON
    && (typeof source?.toJSON === 'function')
    && (depth !== 0 || !options.skipRootToJSON);
}

/**
 * The implementation of the `clone` function.
 *
 * @param {any} source
 *     The source value to be cloned.
 * @param {string} key
 *     The key of the source object in its parent object.
 *     This parameter is used to support the `toJSON()` method.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @return {any}
 *     The deep clone of the specified object.
 * @author Haixing Hu
 */
function cloneImpl(source, key, depth, options, cache) {
  if (shouldUseToJSON(source, depth, options)) {
    return source.toJSON(key, options);
  }
  const info = typeInfo(source);
  switch (info.type) {
    case 'undefined':               // drop down
    case 'null':                    // drop down
    case 'boolean':                 // drop down
    case 'number':                  // drop down
    case 'string':                  // drop down
    case 'symbol':                  // drop down
    case 'bigint':                  // drop down
      return source;                // don't need to clone immutable primitives
    case 'function':
      return source;                // we do NOT clone functions, since it could cause too much troubles
    case 'object':                  // drop down
    default:
      break;
  }
  // return early on cache hit
  if (cache.has(source)) {
    return cache.get(source);
  }
  // deal with cloning hooks
  if (!options.disableHooks) {
    for (const hook of CLONE_HOOKS) {
      const result = hook(info, source, options);
      if (result !== undefined && result !== null) {
        cache.set(source, result);
        return result;
      }
    }
  }
  // clone the general object
  return cloneObjectImpl(info, source, depth, options, cache);
}

export default cloneImpl;
