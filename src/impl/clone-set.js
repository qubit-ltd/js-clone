////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/* eslint-disable import/no-cycle */
import cloneImpl from './clone-impl';
import copyProperties from './copy-properties';

/**
 * Clones a specified set.
 *
 * @param {Set} source
 *     The source set.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @returns {Set}
 *     The cloned set.
 * @private
 * @author Haixing Hu
 */
function cloneSet(source, depth, options, cache) {
  const result = new Set();
  // add to the cache to avoid circular references
  cache.set(source, result);
  // copy other monkey patched properties
  copyProperties(source, result, depth, options, cache);
  // copy all items in the set
  for (const value of source) {
    const newValue = cloneImpl(value, '', depth + 1, options, cache);
    result.add(newValue);
  }
  return result;
}

export default cloneSet;
