import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate', () => {
  it('should return success when validating a string value', () => {
    const value = 'Hello';
    const rule: Rule = { type: 'string' };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });

  it('should return success when validating a number value', () => {
    const value = 42;
    const rule: Rule = { type: 'number' };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return success when validating a boolean value', () => {
    const value = true;
    const rule: Rule = { type: 'boolean' };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return success when validating an array value', () => {
    const value = [1, 2, 3];
    const rule: Rule = { type: 'array', items: { type: 'number' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });

  it('should return success when validating a date value', () => {
    const value = new Date();
    const rule: Rule = { type: 'date' };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
});
