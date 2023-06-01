import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate array', () => {
  describe('Required array', () => {
    it('should return success when required array has items', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return success when required array is empty', () => {
      const value: any[] = [];
      const rule: Rule = { type: 'array', items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
    });
  });

  describe('Non-required array', () => {
    it('should return success when non-required array is empty', () => {
      const value: any[] = [];
      const rule: Rule = { type: 'array', items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Minimum length', () => {
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
  });

  describe('Maximum length', () => {
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
  });

  describe('Array items type', () => {
    it('should return failure when array items are of the wrong type', () => {
      const value = ['apple', 1, 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Array items valid values', () => {
    it('should return failure when array items do not match the valid values', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string', valid: ['apple', 'banana'] } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Array items specific length', () => {
    it('should return failure when array items do not meet the specific length requirement', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string', len: 5 } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Array length', () => {
    it('should return failure when value is not an array', () => {
      const value = 'apple';
      const rule: Rule = { type: 'array', items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when the array has insufficient length', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', len: 5, items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return success when the array has the correct length', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', len: 3, items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Array items valid rule', () => {
    it('should return failure when the array has invalid items - valid rule in items', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string', valid: ['apple', 'banana'] } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when the array has invalid items - valid rule in value', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', valid: ['apple', 'banana'], items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return success when the array has valid items - valid rule in items', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', items: { type: 'string', valid: ['apple', 'banana', 'orange'] } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return success when the array has valid items - valid rule in value', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule: Rule = { type: 'array', valid: ['apple', 'banana', 'orange'], items: { type: 'string' } };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Missing items type', () => {
    it('should return success when items type is missing', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule = { type: 'array', items: { valid: ['apple', 'banana', 'orange'] } };
      const result = validate(value, rule as any);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Invalid items type', () => {
    it('should return failure when items type is invalid', () => {
      const value = ['apple', 'banana', 'orange'];
      const rule = { type: 'array', items: { type: 'invalid', valid: ['apple', 'banana', 'orange'] } };
      const result = validate(value, rule as any);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
