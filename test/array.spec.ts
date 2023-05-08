import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate array', () => {
  it('should return success when required array has items', () => {
    const value = ['apple', 'banana', 'orange'];
    const rule: Rule = { type: 'array', required: true, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return success when required array is empty', () => {
    const value: any[] = [];
    const rule: Rule = { type: 'array', required: true, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
  });
  it('should return success when non-required array is empty', () => {
    const value: any[] = [];
    const rule: Rule = { type: 'array', items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return success when array has minimum length', () => {
    const value = ['apple', 'banana'];
    const rule: Rule = { type: 'array', min: 2, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return failure when array has insufficient length', () => {
    const value = ['apple'];
    const rule: Rule = { type: 'array', min: 2, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
  it('should return success when array has maximum length', () => {
    const value = ['apple', 'banana'];
    const rule: Rule = { type: 'array', max: 2, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });
  it('should return failure when array has exceeded maximum length', () => {
    const value = ['apple', 'banana', 'orange'];
    const rule: Rule = { type: 'array', max: 2, items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
  it('should return failure when array items are of the wrong type', () => {
    const value = ['apple', 1, 'orange'];
    const rule: Rule = { type: 'array', items: { type: 'string' } };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
  it('should return failure when array items do not match the valid values', () => {
    const value = ['apple', 'banana', 'orange'];
    const rule: Rule = { type: 'array', items: { type: 'string', valid: ['apple', 'banana'] } };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('should return failure when array items do not meet the specific length requirement', () => {
    const value = ['apple', 'banana', 'orange'];
    const rule: Rule = { type: 'array', items: { type: 'string', len: 5 } };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});
