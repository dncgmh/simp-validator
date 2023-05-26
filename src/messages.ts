export const MESSAGES = {
  invalidType: '%s has invalid type: %s',
  schema: {
    invalidRule: 'rule must be an array',
    invalidRuleItemsType: `type rule of items in %s must be a valid type, got %s`,
    invalid: 'invalid schema object',
    invalidObject: 'object must be an object',
    invalidValidType: 'valid rule of %s must be an array, got %s',
    missingName: 'missing name in rule at index %s',
  },
  required: '%s is required',
  type: '%s must be a %s',
  string: {
    min: '%s must be at least %s characters',
    max: '%s must be at most %s characters',
    pattern: '%s does not match the pattern %s',
    len: '%s must be exactly %s characters',
  },
  number: {
    min: '%s must be greater than or equal to %s',
    max: '%s must be less than or equal to %s',
    integer: '%s must be an integer',
  },
  array: {
    min: '%s must have at least %s items',
    max: '%s must have at most %s items',
    items: 'array %s: %s',
    len: '%s must have exactly %s items',
  },
  date: {
    min: '%s must be after %s',
    max: '%s must be before %s',
  },
  valid: '%s must be one of %s',
};

const format = (text: string, ...args: any[]): string => {
  return text.replace(/%s/g, () => {
    return args.shift();
  });
};

export const m = (text: string, fieldName: string = 'value', ...args: any[]): string => {
  return format(text, fieldName, ...args);
};
