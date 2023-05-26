import { validate } from '../src/index';
import { type Rule } from '../src/interface';

describe('validate string', () => {
  describe('Required string', () => {
    it('should return success when value meets the rule', () => {
      const value = 'hello';
      const rule: Rule<string> = { type: 'string', required: true, min: 2 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is not a string', () => {
      const value = 123;
      const rule: Rule<string> = { type: 'string', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value is not provided but required', () => {
      const value = undefined;
      const rule: Rule<string> = { type: 'string', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value length is less than the minimum', () => {
      const value = 'a';
      const rule: Rule<string> = { type: 'string', required: true, min: 2 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return success when value length equals the minimum', () => {
      const value = 'ab';
      const rule: Rule<string> = { type: 'string', required: true, min: 2 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return success when value length is within the range', () => {
      const value = 'abcde';
      const rule: Rule<string> = { type: 'string', required: true, min: 2, max: 10 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value length exceeds the maximum', () => {
      const value = 'abcdefghijk';
      const rule: Rule<string> = { type: 'string', required: true, max: 10 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return success when value matches the pattern', () => {
      const value = 'abc123';
      const rule: Rule<string> = { type: 'string', required: true, pattern: '^[a-z0-9]+$' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value does not match the pattern', () => {
      const value = 'abc-123';
      const rule: Rule<string> = { type: 'string', required: true, pattern: '^[a-z0-9]+$' };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value is null', () => {
      const value = null;
      const rule: Rule<string> = { type: 'string', required: false };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
    });
  });

  describe('Optional string', () => {
    it('should return success when value is an empty string but not required', () => {
      const value = '';
      const rule: Rule<string> = { type: 'string', required: false };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });
  });

  describe('Exact length string', () => {
    it('should return success when value length equals the exact length', () => {
      const value = 'abc';
      const rule: Rule<string> = { type: 'string', required: true, len: 3 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value length does not equal the exact length', () => {
      const value = 'abcd';
      const rule: Rule<string> = { type: 'string', required: true, len: 3 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Valid values string', () => {
    it('should return success when value is in the valid values array', () => {
      const value = 'apple';
      const rule: Rule<string> = { type: 'string', required: true, valid: ['apple', 'banana', 'orange'] };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is not in the valid values array', () => {
      const value = 'pear';
      const rule: Rule<string> = { type: 'string', required: true, valid: ['apple', 'banana', 'orange'] };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
