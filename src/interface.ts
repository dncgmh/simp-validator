export type FieldType = 'array' | 'boolean' | 'date' | 'number' | 'string';
export type ItemType = 'boolean' | 'date' | 'number' | 'string';

/**
 * Represents a rule for validating a value.
 */
export interface RuleBase {
  /** The allowed data type of the value. */
  type: FieldType;
  /** The name of the value. */
  name?: string;
  /** The description of the value. */
  description?: string;
  /** Whether the value is required. */
  required?: boolean;
  /** An array of allowed values. */
  valid?: any[];
  /** Custom message to return when validation fails. */
  message?: string;
}

export interface NumericRule extends RuleBase {
  /** The allowed data type of the value. */
  type: 'number';
  /** Whether the number must be an integer. */
  integer?: boolean;
  /** The minimum value allowed for the number. */
  min?: number;
  /** The maximum value allowed for the number. */
  max?: number;
}

export interface StringRule extends RuleBase {
  /** The allowed data type of the value. */
  type: 'string';
  /** The minimum length allowed for the string. */
  min?: number;
  /** The maximum length allowed for the string. */
  max?: number;
  /** A regular expression that the value must match. */
  pattern?: string;
  /** The exact length allowed for the string. */
  len?: number;
}

export interface ArrayRule extends RuleBase {
  /** The allowed data type of the value. */
  type: 'array';
  /** The allowed data type of the items in the array. */
  items?: Rule & { type: ItemType };
  /** The minimum length allowed for the array. */
  min?: number;
  /** The maximum length allowed for the array. */
  max?: number;
  /** The exact length allowed for the array. */
  len?: number;
}

export interface BooleanRule extends RuleBase {
  /** The allowed data type of the value. */
  type: 'boolean';
}

export interface DateRule extends RuleBase {
  /** The allowed data type of the value. */
  type: 'date';
  /** The minimum date allowed for the value. */
  min?: number;
  /** The maximum date allowed for the value. */
  max?: number;
}

export type Rule<T = any> = T extends string
  ? StringRule
  : T extends number
  ? NumericRule
  : T extends boolean
  ? BooleanRule
  : T extends Date
  ? DateRule
  : T extends any[]
  ? ArrayRule
  : StringRule | NumericRule | BooleanRule | DateRule | ArrayRule;

export type Schema = Record<string, Rule>;

export interface ValidationResult<T = any> {
  /** Whether the validation was successful. */
  success: boolean;
  /** The error message if the validation failed. */
  message?: string;
  /** The validated value if the validation was successful. */
  data?: T;
  /** The details of the validation if the validation failed. */
  details?: Record<string, string>;
}
/**
 * The main function that validates a value against a rule.
 *
 * @param value The value to validate.
 * @param rule The rule to validate against.
 * @returns An object containing the result of the validation.
 */
export type Validator<T> = (value: any, rule: Rule<T>) => ValidationResult<T>;
