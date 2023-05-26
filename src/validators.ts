import { MESSAGES, m } from './messages';
import type { Validator, Rule, ValidationResult } from './interface';

const validateBase = (value: any, rule: Rule): ValidationResult => {
  if (rule.required && (value === undefined || value === null)) {
    return { success: false, message: m(MESSAGES.required, rule.name) };
  }

  if (rule.valid) {
    if (!Array.isArray(rule.valid)) {
      return { success: false, message: m(MESSAGES.schema.invalidValidType, rule.name, rule.valid) };
    }
    if (rule.type === 'array') {
      return { success: true, data: value };
    }
    if (!rule.valid.includes(value)) {
      return { success: false, message: m(MESSAGES.valid, rule.name, rule.valid.join(', ')) };
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
  if (rule.max && value.length > rule.max) {
    return { success: false, message: m(MESSAGES.string.max, rule.name, rule.max) };
  }
  if (rule.len && value.length !== rule.len) {
    return { success: false, message: m(MESSAGES.string.len, rule.name, rule.len) };
  }
  if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
    return { success: false, message: m(MESSAGES.string.pattern, rule.name, rule.pattern) };
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

const validateDate: Validator<Date> = (value: any, rule: Rule<Date>) => {
  value = new Date(value);
  if (Number.isNaN(value.getTime())) {
    return { success: false, message: m(MESSAGES.type, rule.name, rule.type) };
  }
  if (rule.min && value.getTime() < rule.min) {
    return { success: false, message: m(MESSAGES.date.min, rule.name, rule.min) };
  }
  if (rule.max && value.getTime() > rule.max) {
    return { success: false, message: m(MESSAGES.date.max, rule.name, rule.max) };
  }
  return { success: true, data: value };
};

const validators = {
  base: validateBase,
  string: validateString,
  number: validateNumber,
  boolean: validateBoolean,
  array: validateArray,
  date: validateDate,
};

export default validators;
