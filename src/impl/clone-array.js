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
 * Clones a specified array.
 *
 * @param {Array} source
 *     The source array.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     Options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @returns {Array}
 *     The target array.
 * @private
 * @author Haixing Hu
 */
function cloneArray(source, depth, options, cache) {
  const result = [];
  cache.set(source, result);
  const keys = Reflect.ownKeys(source);
  // We'll assume the array is well-behaved (dense and not monkey-patched)
  // If that turns out to be false, we'll fall back to generic code
  wellBehaved: {                  // eslint-disable-line no-labels
    let i;
    for (i = 0; i < source.length; i++) {
      if (i in source) {
        result.push(cloneImpl(source[i], String(i), depth + 1, options, cache));
      } else {  // Array is sparse
        break wellBehaved;        // eslint-disable-line no-labels
      }
    }
    if (i !== keys.length - 1) {  // Array is monkeypatched
      break wellBehaved;          // eslint-disable-line no-labels
    }
    return result;
  }
  // Generic fallback
  result.length = 0;
  copyProperties(source, result, depth, options, cache);
  return result;
}

export default cloneArray;
