import { type ValidationResult, type Rule, type Schema } from './interface';
import { MESSAGES } from './messages';

/**
 * replace all occurrences of %s in a string with the provided arguments.
 * @param text The string to format.
 * @param args The arguments to replace %s with.
 * @returns The formatted string.
 */
const format = (text: string, ...args: any[]): string => {
  return text.replace(/%s/g, () => {
    return args.shift();
  });
};

/**
 * return a formatted string with the given arguments.
 * @param text The string to format.
 * @param fieldName The name of the field to include in the formatted string.
 * @param args The arguments to include in the formatted string.
 * @returns The formatted string.
 */
export const m = (text: string, fieldName: string = 'value', ...args: any[]): string => {
  if (!fieldName) return format(text, ...args);
  return format(text, fieldName, ...args);
};

/**
 * convert a validation result to a result object.
 * @param validationResult The validation result to convert.
 * @param customMessage The custom message to use if the validation result is not successful.
 * @returns The result object.
 */
export const toResult = (
  validationResult: ValidationResult,
  { customMessage }: { customMessage?: string },
): ValidationResult => {
  if (validationResult.success) {
    return { success: validationResult.success, data: validationResult.data };
  }
  return {
    success: validationResult.success,
    message: customMessage ?? validationResult.message,
    data: validationResult.data,
  };
};

/**
 * convert array of rules to schema object
 * @param rules The array of rules.
 * @returns The schema object.
 */
export const toSchema = (rules: Rule[] = []): { schema: Schema | null; message?: string } => {
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
