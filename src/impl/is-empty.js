////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import typeInfo from '@qubit-ltd/typeinfo';

/**
 * Tests whether a value is empty.
 *
 * @param {any} value
 *     The value to be tested.
 * @return {boolean}
 *     Returns `true` if the value is empty, otherwise returns `false`.
 */
function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.length === 0;
  }
  const info = typeInfo(value);
  switch (info.category) {
    case 'undefined':       // fall down
    case 'null':
      return true;
    case 'string':          // fall down
    case 'array':           // fall down
    case 'typed-array':
      return (value.length === 0);
    case 'set':             // fall down
    case 'map':             // fall down
      return (value.size === 0);
    default:
      return false;
  }
}

export default isEmpty;
