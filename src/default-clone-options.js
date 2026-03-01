////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The default options of the cloning algorithm.
 *
 * @type {object}
 */
const DEFAULT_CLONE_OPTIONS = {
  /**
   * If this options is set to `true`, the cloning algorithm will clone the
   * accessors of the properties (i.e. getters and setters) from the source object.
   *
   * The default value of this option is `false`.
   */
  includeAccessor: false,

  /**
   * If this options is set to `true`, the cloning algorithm will **NOT** clone
   * the readonly attributes from the source object.
   *
   * The default value of this option is `false`.
   */
  excludeReadonly: false,

  /**
   * If this options is set to `true`, the cloning algorithm will clone the
   * non-enumerable attributes from the source object.
   *
   * The default value of this option is `false`.
   */
  includeNonEnumerable: false,

  /**
   * If this options is set to `true`, the cloning algorithm will clone the
   * non-configurable attributes from the source object.
   *
   * The default value of this option is `false`.
   */
  includeNonConfigurable: false,

  /**
   * If this option is set to `true`, and `includeNonConfigurable` is `false`,
   * the cloning algorithm will automatically include non-configurable
   * properties when the current source object is frozen.
   *
   * This option helps avoid losing important data fields on business objects
   * that are frozen intentionally (e.g. shared constants or immutable models).
   *
   * The default value of this option is `true`.
   */
  autoIncludeNonConfigurableForFrozen: true,

  /**
   * If this options is set to `true`, the cloning algorithm will convert the
   * names of the properties of the target object according to the specified
   * naming styles.
   *
   * The default value of this option is `false`.
   */
  convertNaming: false,

  /**
   * The naming style of the source object.
   *
   * This option is only effective when the `convertNaming` option is set to `true`.
   *
   * The value of this options can be either a string representing the name of
   * the naming style, or a `NamingStyle` instance.
   *
   * The default value is `LOWER_CAMEL`.
   */
  sourceNamingStyle: 'LOWER_CAMEL',

  /**
   * The naming style of the target object.
   *
   * This option is only effective when the `convertNaming` option is set to `true`.
   *
   * The value of this options can be either a string representing the name of
   * the naming style, or a `NamingStyle` instance.
   *
   * The default value is `LOWER_CAMEL`.
   */
  targetNamingStyle: 'LOWER_CAMEL',

  /**
   * If this options is set to `true`, the cloning algorithm will convert the
   * source object to a plain old JavaScript object (POJO).
   *
   * The default value of this option is `false`.
   */
  pojo: false,

  /**
   * If this options is set to `true`, the cloning algorithm will recursively
   * remove the empty fields of the source object before cloning.
   *
   * An empty field refers to a field with a value of `null`, `undefined`, an
   * empty string, an empty array, or an empty set.
   *
   * The default value of this option is `false`.
   */
  removeEmptyFields: false,

  /**
   * If this options is set to `true`, the cloning algorithm will disable the
   * cloning hooks.
   *
   * The default value of this option is `false`.
   */
  disableHooks: false,

  /**
   * If this options is set to `true`, and the source object has a `toJSON()`
   * method, the cloning algorithm will use the result of the `toJSON()` method
   * as the result of the cloning.
   *
   * The default value of this option is `false`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   */
  useToJSON: false,

  /**
   * If this options and the option `useToJSON` are both set to `true`, and the
   * source object has a `toJSON()` method, the cloning algorithm will use the
   * result of the `toJSON()` method as the result of the cloning if and only if
   * the source object is not the root object of the cloning process.
   *
   * This option is very useful when implementing the `toJSON()` method of a
   * class with the `clone()` function, since it could avoid infinite recursion.
   *
   * The default value of this option is `false`.
   */
  skipRootToJSON: false,
};

export default DEFAULT_CLONE_OPTIONS;
