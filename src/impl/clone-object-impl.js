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
 * cloneObjectImpl() is a dispatcher:
 * - it selects a concrete cloneXxx implementation by type category;
 * - selected cloneXxx implementations recursively call cloneImpl() for nested
 *   values (array elements, map keys/values, set items, monkey-patched fields).
 *
 * Therefore this module is the middle node of intentional cycles:
 * clone-impl <-> clone-object-impl <-> cloneXxx
 */
import cloneArray from './clone-array';
import cloneBuffer from './clone-buffer';
import cloneCopyConstructableObject from './clone-copy-constructable-object';
import cloneDataView from './clone-data-view';
import cloneError from './clone-error';
import cloneMap from './clone-map';
import cloneCustomizedObject from './clone-customized-object';
import clonePrimitiveWrapperObject from './clone-primitive-wrapper-object';
import clonePromise from './clone-promise';
import cloneSet from './clone-set';
import cloneTypedArray from './clone-typed-array';

/**
 * The implementation of the `clone` function to clone a general object.
 *
 * @param {Object} info
 *     The type information about the object to be cloned.
 * @param {any} source
 *     The source object to be cloned.
 * @param {number} depth
 *     The current depth of the source object in the cloning process.
 *     The depth of the root object is 0.
 * @param {Object} options
 *     The options of the cloning algorithm.
 * @param {WeakMap} cache
 *     The object cache used to prevent circular references.
 * @return {any}
 *     The deep clone of the specified object.
 * @private
 * @author Haixing Hu
 */
function cloneObjectImpl(info, source, depth, options, cache) {
  switch (info.category) {
    case 'string':
    case 'boolean':
    case 'numeric':
      return clonePrimitiveWrapperObject(source, depth, options, cache);
    case 'date':                    // drop down
    case 'regexp':
      return cloneCopyConstructableObject(source, depth, options, cache);
    case 'map':
      return cloneMap(source, depth, options, cache);
    case 'set':
      return cloneSet(source, depth, options, cache);
    case 'array':
      return cloneArray(source, depth, options, cache);
    case 'typed-array':
      return cloneTypedArray(source, depth, options, cache);
    case 'buffer':
      return cloneBuffer(source, depth, options, cache);
    case 'data-view':
      return cloneDataView(source, depth, options, cache);
    case 'promise':
      return clonePromise(source, depth, options, cache);
    case 'error':
      return cloneError(source, depth, options, cache);
    case 'weak':                    // weak referenced cannot be cloned :(
    case 'intl':                    // Intl objects are immutable and cannot be cloned
    case 'iterator':                // iterators cannot be cloned :(
    case 'finalization-registry':   // FinalizationRegistry cannot be cloned :(
    case 'arguments':               // arguments cannot be cloned :(
    case 'generator':               // generators cannot be cloned :(
    case 'global':                  // global object cannot be cloned :(
    case 'DOM':                     // DOM object cannot be cloned :(
    case 'CSSOM':                   // CSSOM object cannot be cloned :(
    case 'event':                   // Event object cannot be cloned :(
    case 'console':                 // window.console cannot be cloned :(
    case 'file':                    // File API object cannot be cloned :(
      return source;
    case 'object':                  // drop down
    case 'class':                   // drop down
    default:
      // clone all other objects, including user defined objects
      return cloneCustomizedObject(source, depth, options, cache);
  }
}

export default cloneObjectImpl;
