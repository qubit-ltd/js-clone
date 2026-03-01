////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/* eslint-disable import/no-cycle */
import cloneBuffer from './clone-buffer';
import copyProperties from './copy-properties';

/**
 * Clones a specified `DataView`.
 *
 * @param {DataView} source
 *     The source `DataView` object.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @returns {DataView}
 *     The cloned `DataView` object.
 * @private
 * @author Haixing Hu
 */
function cloneDataView(source, depth, options, cache) {
  const buffer = cloneBuffer(source.buffer, depth + 1, options, cache);

  const result = new DataView(buffer, source.byteOffset, source.byteLength);
  // add to the cache to avoid circular references
  cache.set(source, result);
  // copy other monkey patched properties
  copyProperties(source, result, depth, options, cache);
  return result;
}

export default cloneDataView;
