import { MESSAGES } from './messages';
import type { Rule, Schema, SchemaValidationResult, ValidationResult } from './interface';
import validators from './validators';
import { m, toResult, toSchema } from './utils';

/**
 * Validates a value against a given schema.
 * @param object The object to validate.
 * @param  schema The schema to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
const schemaValidate = <T>(object: any, schema: Schema): SchemaValidationResult<T> => {
  if (typeof object !== 'object' || object === null || Array.isArray(object)) {
    return { success: false, message: m(MESSAGES.schema.invalidObject) };
  }
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    return { success: false, message: m(MESSAGES.schema.invalid) };
  }
  const errors: Record<string, string> = {};
  const data: Record<string, any> = {};
  Object.entries(schema).forEach(([name, rules]) => {
    const result = validate(object[name], { name, ...rules });
    if (!result.success) {
      if (result.message) errors[name] = result.message;
    } else {
      data[name] = result.data;
    }
  });

  if (Object.keys(errors).length > 0) {
    return { success: false, details: errors };
  }
  return { success: true, data: data as T };
};

/**
 * Validates a value against a given rule.
 * @param value The value to validate.
 * @param rule The rule to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
const validate = (value: any, rule: Rule): ValidationResult => {
  const message = rule.message;
  const name = rule.name;
  if (!rule.type) {
    return toResult({ success: false, message: m(MESSAGES.invalidType, name) }, { customMessage: message });
  }

  const baseResult = validators.base(value, rule);
  if (baseResult && !baseResult.success) {
    return toResult(baseResult, { customMessage: message });
  }
  // if value is undefined and not required, skip other checks
  if (value === undefined) {
    return { success: true, data: value };
  }

  const validator = validators[rule.type];
  if (!validator) {
    return toResult({ success: false, message: m(MESSAGES.invalidType, name, rule.type) }, { customMessage: message });
  }
  return toResult(validator(value, rule as never), { customMessage: message });
};

export default {
  toSchema,
  schemaValidate,
  validate,
};

export { toSchema, schemaValidate, validate, type Schema, type Rule };
