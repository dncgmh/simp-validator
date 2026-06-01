import { validate, schemaValidate, registerValidator } from '../src/index';
import type { Rule, Schema } from '../src/interface';

describe('Object Validation', () => {
  const schema: Schema = {
    user: {
      type: 'object',
      schema: {
        name: { type: 'string', min: 2 },
        age: { type: 'number', min: 0 },
      },
    },
  };

  it('should validate nested objects successfully', () => {
    const data = {
      user: {
        name: 'John',
        age: 30,
      },
    };
    const result = schemaValidate(data, schema);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('should fail if nested object is invalid', () => {
    const data = {
      user: {
        name: 'J',
        age: 30,
      },
    };
    const result = schemaValidate(data, schema);
    expect(result.success).toBe(false);
    expect(result.details).toBeDefined();
    expect(result.details?.user).toBeDefined();
  });

  it('should fail if field is not an object', () => {
    const data = {
      user: 'not an object',
    };
    const result = schemaValidate(data, schema);
    expect(result.success).toBe(false);
    expect(result.details?.user).toContain('must be a "object"');
  });
});

describe('Custom Validator Registration', () => {
  it('should allow registering and using a custom validator', () => {
    const customValidator = (value: unknown, rule: Rule) => {
      if (value === 'secret') {
        return { success: true, data: value };
      }
      return { success: false, message: 'Value is not secret' };
    };

    registerValidator('secret', customValidator);

    const rule: Rule = { type: 'secret' as any, name: 'password' };

    expect(validate('secret', rule).success).toBe(true);
    expect(validate('wrong', rule).success).toBe(false);
    expect(validate('wrong', rule).message).toBe('Value is not secret');
  });
});
