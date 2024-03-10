import { codes, hideStackFrames } from './errors.js';
import {
  ArrayIsArray,
  NumberIsNaN,
  ObjectPrototypeHasOwnProperty,
} from './primordials.js';

const {
  ERR_INVALID_ARG_TYPE: { HideStackFramesError: ERR_INVALID_ARG_TYPE },
  ERR_INVALID_ARG_VALUE: { HideStackFramesError: ERR_INVALID_ARG_VALUE },
} = codes;

/**
 * @callback validateNumber
 * @param {*} value
 * @param {string} name
 * @param {number} [min]
 * @param {number} [max]
 * @returns {asserts value is number}
 */

/** @type {validateNumber} */
export const validateNumber = hideStackFrames(
  (value, name, min = undefined, max) => {
    if (typeof value !== 'number')
      throw new ERR_INVALID_ARG_TYPE(name, 'number', value);

    if (
      (min != null && value < min) ||
      (max != null && value > max) ||
      ((min != null || max != null) && NumberIsNaN(value))
    ) {
      throw new ERR_INVALID_ARG_TYPE(
        name,
        `${min != null ? `>= ${min}` : ''}${min != null && max != null ? ' && ' : ''}${max != null ? `<= ${max}` : ''}`,
        value,
      );
    }
  },
);

/**
 * @callback validateArray
 * @param {*} value
 * @param {string} name
 * @param {number} [minLength]
 * @returns {asserts value is any[]}
 */

/** @type {validateArray} */
export const validateArray = hideStackFrames((value, name, minLength = 0) => {
  if (!ArrayIsArray(value)) {
    throw new ERR_INVALID_ARG_TYPE(name, 'Array', value);
  }
  if (value.length < minLength) {
    const reason = `must be longer than ${minLength}`;
    throw new ERR_INVALID_ARG_VALUE(name, value, reason);
  }
});

/**
 * @callback validateAbortSignal
 * @param {*} signal
 * @param {string} name
 */

/** @type {validateAbortSignal} */
export const validateAbortSignal = hideStackFrames((signal, name) => {
  if (
    signal !== undefined &&
    (signal === null || typeof signal !== 'object' || !('aborted' in signal))
  ) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal);
  }
});

export const kValidateObjectNone = 0;
export const kValidateObjectAllowNullable = 1 << 0;
export const kValidateObjectAllowArray = 1 << 1;
export const kValidateObjectAllowFunction = 1 << 2;
export const kValidateObjectAllowObjects =
  kValidateObjectAllowArray | kValidateObjectAllowFunction;
export const kValidateObjectAllowObjectsAndNull =
  kValidateObjectAllowNullable |
  kValidateObjectAllowArray |
  kValidateObjectAllowFunction;

/**
 * @callback validateObject
 * @param {*} value
 * @param {string} name
 * @param {number} [options]
 */

/** @type {validateObject} */
export const validateObject = hideStackFrames(
  (value, name, options = kValidateObjectNone) => {
    if (options === kValidateObjectNone) {
      if (value === null || ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      if (typeof value !== 'object') {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }
    } else {
      const throwOnNullable = (kValidateObjectAllowNullable & options) === 0;

      if (throwOnNullable && value === null) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      const throwOnArray = (kValidateObjectAllowArray & options) === 0;

      if (throwOnArray && ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      const throwOnFunction = (kValidateObjectAllowFunction & options) === 0;
      const typeofValue = typeof value;

      if (
        typeofValue !== 'object' &&
        (throwOnFunction || typeofValue !== 'function')
      ) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }
    }
  },
);

/**
 * @callback validateString
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is string}
 */

/** @type {validateString} */
export const validateString = hideStackFrames((value, name) => {
  if (typeof value !== 'string')
    throw new codes.ERR_INVALID_ARG_TYPE(name, 'string', value);
});

export const validateInternalField = hideStackFrames(
  (object, fieldKey, className) => {
    if (
      typeof object !== 'object' ||
      object === null ||
      !ObjectPrototypeHasOwnProperty(object, fieldKey)
    ) {
      throw new ERR_INVALID_ARG_TYPE('this', className, object);
    }
  },
);
