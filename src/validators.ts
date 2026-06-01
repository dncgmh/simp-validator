import { MESSAGES } from './messages';
import type { Validator, Rule, ValidationResult, Schema, SchemaValidationResult } from './interface';
import { m, toResult } from './utils';

const regexCache = new Map<string, RegExp>();

const validateBase = (value: unknown, rule: Rule): ValidationResult => {
  if (!rule.optional && (value === undefined || value === null)) {
    return { success: false, message: m(MESSAGES.required, rule.name) };
  }

  const r = rule as any;
  if (r.valid) {
    if (!Array.isArray(r.valid)) {
      return { success: false, message: m(MESSAGES.schema.invalidValidType, rule.name, r.valid) };
    }
    if (rule.type === 'array') {
      return { success: true, data: value };
    }
    if (!r.valid.includes(value)) {
      return { success: false, message: m(MESSAGES.valid, rule.name, r.valid.join(', ')) };
    }
  }
  return { success: true, data: value };
};

const validateString: Validator<string> = (value, rule) => {
  if (typeof value !== 'string') {
    return { success: false, message: m(MESSAGES.type, rule.name, 'string') };
  }
  if (rule.min && value.length < rule.min) {
    return { success: false, message: m(MESSAGES.string.min, rule.name, rule.min) };
  }
  if (rule.max !== undefined && value.length > rule.max) {
    return { success: false, message: m(MESSAGES.string.max, rule.name, rule.max) };
  }
  if (rule.len !== undefined && value.length !== rule.len) {
    return { success: false, message: m(MESSAGES.string.len, rule.name, rule.len) };
  }
  if (rule.pattern) {
    let re = regexCache.get(rule.pattern);
    if (!re) {
      re = new RegExp(rule.pattern);
      regexCache.set(rule.pattern, re);
    }
    if (!re.test(value)) {
      return { success: false, message: m(MESSAGES.string.pattern, rule.name, rule.pattern) };
    }
  }
  return { success: true, data: value };
};

const validateNumber: Validator<number> = (value, rule) => {
  if (typeof value !== 'number') {
    return { success: false, message: m(MESSAGES.type, rule.name, 'number') };
  }
  if (rule.integer && !Number.isInteger(value)) {
    return { success: false, message: m(MESSAGES.number.integer, rule.name) };
  }
  if (rule.min !== undefined && value < rule.min) {
    return { success: false, message: m(MESSAGES.number.min, rule.name, rule.min) };
  }
  if (rule.max !== undefined && value > rule.max) {
    return { success: false, message: m(MESSAGES.number.max, rule.name, rule.max) };
  }
  return { success: true, data: value };
};

const validateBoolean: Validator<boolean> = (value, rule) => {
  if (typeof value !== 'boolean') {
    return { success: false, message: m(MESSAGES.type, rule.name, 'boolean') };
  }
  return { success: true, data: value };
};

const validateArray: Validator<any[]> = (value, rule) => {
  if (!Array.isArray(value)) {
    return { success: false, message: m(MESSAGES.type, rule.name, 'array') };
  }
  if (rule.min !== undefined && value.length < rule.min) {
    return { success: false, message: m(MESSAGES.array.min, rule.name, rule.min) };
  }
  if (rule.max !== undefined && value.length > rule.max) {
    return { success: false, message: m(MESSAGES.array.max, rule.name, rule.max) };
  }
  if (rule.len !== undefined && value.length !== rule.len) {
    return { success: false, message: m(MESSAGES.array.len, rule.name, rule.len) };
  }
  if (Array.isArray(rule.valid)) {
    const valid = rule.valid;
    if (value.some((item) => !valid.includes(item)))
      return { success: false, message: m(MESSAGES.valid, rule.name, rule.valid.join(', ')) };
  }
  if (!rule.items) {
    return { success: true, data: value };
  }
  const items = rule.items;
  const arrayErrors = value.map((item) => {
    const baseResult = validateBase(item, items as any);
    if (!baseResult.success) {
      return baseResult;
    }
    if (!items.type) {
      return { success: true, data: item };
    }
    const validator = validators[items.type];
    if (!validator) {
      return { success: false, message: m(MESSAGES.schema.invalidRuleItemsType, rule.name, items.type) };
    }
    return validator(item, items as any);
  });
  const firstError = arrayErrors.find((error) => !error?.success);
  if (firstError) {
    const message = firstError.message;
    return {
      success: false,
      message: m(MESSAGES.array.items, rule.name, message),
    };
  }
  return { success: true, data: value };
};

const validateDate: Validator<Date> = (value: unknown, rule: Rule<Date>) => {
  const dateValue = new Date(value as any);
  if (Number.isNaN(dateValue.getTime())) {
    return { success: false, message: m(MESSAGES.type, rule.name, rule.type) };
  }
  if (rule.min !== undefined && dateValue.getTime() < rule.min) {
    return { success: false, message: m(MESSAGES.date.min, rule.name, new Date(rule.min).toISOString()) };
  }
  if (rule.max !== undefined && dateValue.getTime() > rule.max) {
    return { success: false, message: m(MESSAGES.date.max, rule.name, new Date(rule.max).toISOString()) };
  }
  return { success: true, data: dateValue };
};

const validateObject: Validator<object> = (value, rule) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { success: false, message: m(MESSAGES.type, rule.name, 'object') };
  }
  const objValue = value;
  if (!rule.schema) {
    return { success: true, data: objValue };
  }
  const result = schemaValidate(objValue, rule.schema);
  if (!result.success) {
    return {
      success: false,
      message: result.message ?? (result.details ? JSON.stringify(result.details) : 'Validation failed'),
      data: result.data as object,
    };
  }
  return { success: true, data: result.data as object };
};

const validators: Record<string, Validator<any>> = {
  string: validateString,
  number: validateNumber,
  boolean: validateBoolean,
  array: validateArray,
  date: validateDate,
  object: validateObject,
};

/**
 * Validates a value against a given rule.
 * @param value The value to validate.
 * @param rule The rule to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
export const validate = (value: unknown, rule: Rule): ValidationResult => {
  const message = rule.message;
  const name = rule.name;
  if (!rule.type) {
    return toResult({ success: false, message: m(MESSAGES.invalidType, name) }, { customMessage: message });
  }

  const baseResult = validateBase(value, rule);
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

/**
 * Validates a value against a given schema.
 * @param object The object to validate.
 * @param  schema The schema to validate against.
 * @returns Returns an object with success status, message and parsed data.
 */
export const schemaValidate = <T>(object: unknown, schema: Schema): SchemaValidationResult<T> => {
  if (typeof object !== 'object' || object === null || Array.isArray(object)) {
    return { success: false, message: m(MESSAGES.schema.invalidObject) };
  }
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    return { success: false, message: m(MESSAGES.schema.invalid) };
  }
  const errors: Record<string, string> = {};
  const data: Record<string, any> = {};
  const obj = object as Record<string, unknown>;

  Object.entries(schema).forEach(([name, rules]) => {
    const result = validate(obj[name], { name, ...rules });
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
 * Registers a new validator for a given type.
 * @param type The type to register the validator for.
 * @param validator The validator function.
 */
export const registerValidator = (type: string, validator: Validator<any>) => {
  validators[type] = validator;
};

export default {
  base: validateBase,
  ...validators,
};
