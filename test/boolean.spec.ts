import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate boolean', () => {
  it('should return success when value meets the rule', () => {
    const value = true;
    const rule: Rule<boolean> = { type: 'boolean', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });

  it('should return success when value is false', () => {
    const value = false;
    const rule: Rule<boolean> = { type: 'boolean', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });

  it('should return failure when value is not a boolean', () => {
    const value = 'true';
    const rule: Rule<boolean> = { type: 'boolean', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});
