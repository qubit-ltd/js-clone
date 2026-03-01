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
 * Clones a specified map.
 *
 * @param {Map} source
 *     The source map.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @returns {Map}
 *     The cloned map.
 * @private
 * @author Haixing Hu
 */
function cloneMap(source, depth, options, cache) {
  const result = new Map();
  // add to the cache to avoid circular references
  cache.set(source, result);
  // copy other monkey patched properties
  copyProperties(source, result, depth, options, cache);
  // copy all entries in the map
  for (const [key, value] of source.entries()) {
    const newKey = cloneImpl(key, '', depth + 1, options, cache);
    const newValue = cloneImpl(value, '', depth + 1, options, cache);
    result.set(newKey, newValue);
  }
  return result;
}

export default cloneMap;
