////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Gets the key of the target object from the corresponding key of the source
 * object.
 *
 * @param {string} sourceKey
 *     The key of the source object.
 * @param {object} options
 *     The options of the cloning algorithm.
 * @return {string}
 *     The corresponding key of the target object.
 * @private
 * @author Haixing Hu
 */
function getTargetKey(sourceKey, options) {
  if (options && options.convertNaming) {
    const { sourceNamingStyle, targetNamingStyle } = options;
    if (sourceNamingStyle && targetNamingStyle) {
      return sourceNamingStyle.to(targetNamingStyle, sourceKey);
    }
  }
  return sourceKey;
}

export default getTargetKey;
