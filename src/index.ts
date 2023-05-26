import { MESSAGES, m } from './messages';
import type { Rule, Schema, ValidationResult } from './interface';
import validators from './validators';

/**
 * convert array of rules to schema object
 * @param rules The array of rules.
 * @returns The schema object.
 */
const toSchema = (rules: Rule[] = []): { schema: Schema | null; message?: string } => {
  if (!Array.isArray(rules)) {
    return { schema: null, message: m(MESSAGES.schema.invalidRule) };
  }
  const schema: Schema = {};
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (!rule.name) {
      return { schema: null, message: m(MESSAGES.schema.missingName, '', i) };
    }
    schema[rule.name] = rule;
  }
  return { schema };
};

/**
 * Validates a value against a given schema.
 * @param object The object to validate.
 * @param  schema The schema to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
const schemaValidate = (object: any, schema: Schema): ValidationResult => {
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
  return { success: true, data };
};

/**
 * Validates a value against a given rule.
 * @param value The value to validate.
 * @param rule The rule to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
const validate = (value: any, rule: Rule): ValidationResult => {
  const name = rule.name;
  if (!rule.type) {
    return { success: false, message: m(MESSAGES.invalidType, name) };
  }

  const baseResult = validators.base(value, rule);
  if (baseResult && !baseResult.success) {
    return baseResult;
  }
  // if value is undefined and not required, skip other checks
  if (value === undefined) {
    return { success: true, data: value };
  }

  const validator = validators[rule.type];
  if (!validator) {
    return { success: false, message: m(MESSAGES.invalidType, rule.name, rule.type) };
  }

  return validator(value, rule as never);
};

export default {
  toSchema,
  schemaValidate,
  validate,
};

export { toSchema, schemaValidate, validate, type Schema, type Rule };
