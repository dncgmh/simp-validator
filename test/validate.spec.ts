import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate', () => {
  describe('String validation', () => {
    it('should return success when validating a string value', () => {
      const value = 'Hello';
      const rule: Rule = { type: 'string' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Number validation', () => {
    it('should return success when validating a number value', () => {
      const value = 42;
      const rule: Rule = { type: 'number' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Boolean validation', () => {
    it('should return success when validating a boolean value', () => {
      const value = true;
      const rule: Rule = { type: 'boolean' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Array validation', () => {
    it('should return success when validating an array value', () => {
      const value = [1, 2, 3];
      const rule: Rule = { type: 'array', items: { type: 'number' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Date validation', () => {
    it('should return success when validating a date value', () => {
      const value = new Date();
      const rule: Rule = { type: 'date' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toStrictEqual(value);
    });
  });

  describe('Invalid rule type', () => {
    it('should return an error when rule does not have a type', () => {
      const value = 'test';
      const rule = { name: 'test-rule' };
      const result = validate(value, rule as any);
      expect(result.success).toBe(false);
    });

    it('should return an error when rule has an invalid type', () => {
      const value = 'test';
      const rule = { name: 'test-rule', type: 'invalid-type' };
      const result = validate(value, rule as any);
      expect(result.success).toBe(false);
    });
  });

  describe('Custom message', () => {
    it('should return a custom message when provided', () => {
      const value = 5678;
      const rule: Rule = { name: 'test-rule', type: 'string', message: 'Custom message' };
      const result = validate(value, rule);
      expect(result.message).toBe(rule.message);
    });
  });
});
