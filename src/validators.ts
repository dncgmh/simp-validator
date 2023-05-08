import { MESSAGES, m } from './messages';
import type { Validator, Rule, ValidationResult } from './interface';

const validateBase = (value: any, rule: Rule): ValidationResult | undefined => {
  if (rule.required && (value === undefined || value === null)) {
    return { success: false, message: m(MESSAGES.required, rule.name) };
  }
  if (rule.valid && !rule.valid.includes(value)) {
    return { success: false, message: m(MESSAGES.valid, rule.name, rule.valid.join(', ')) };
  }
};

const validateString: Validator<string> = (value, rule) => {
  if (typeof value !== 'string') {
    return { success: false, message: m(MESSAGES.type, rule.name, 'string') };
  }
  if (rule.valid && !rule.valid.includes(value)) {
    return { success: false, message: m(MESSAGES.valid, rule.name, rule.valid.join(', ')) };
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
  if (rule.required && value === undefined) {
    return { success: false, message: m(MESSAGES.required, rule.name) };
  }
  if (typeof value !== 'number') {
    return { success: false, message: m(MESSAGES.type, rule.name, 'number') };
  }
  if (rule.valid && !rule.valid.includes(value)) {
    return { success: false, message: m(MESSAGES.valid, rule.name, rule.valid.join(', ')) };
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
    const validator = validators[rule.items.type];
    if (!validator) {
      throw new Error(`Unknown item type: ${items.type}`);
    }
    return validator(item, items as any);
  });
  const firstError = arrayErrors.find((error) => !error.success);
  if (firstError) {
    const message = firstError.message ?? 'unknown error';
    return {
      success: false,
      message: m(MESSAGES.array.items, rule.name, message),
    };
  }
  return { success: true, data: value };
};

const validateDate: Validator<Date> = (value: any, rule: Rule<Date>) => {
  if (typeof value === 'string' || typeof value === 'number') {
    value = new Date(value);
  }
  if (!(value instanceof Date)) {
    return { success: false, message: m(MESSAGES.type, rule.name, 'date') };
  }
  if (Number.isNaN(value.getTime())) {
    return { success: false, message: 'Invalid date format' };
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
