import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate number', () => {
  describe('Required number', () => {
    it('should return success when value meets the rule', () => {
      const value = 42;
      const rule: Rule<number> = { type: 'number', min: 0, max: 100 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is undefined and required is true', () => {
      const value = undefined;
      const rule: Rule<number> = { type: 'number', min: 0, max: 100 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Integer number', () => {
    it('should return success when value is an integer', () => {
      const value = 10;
      const rule: Rule<number> = { type: 'number', integer: true };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is not an integer', () => {
      const value = 3.14;
      const rule: Rule<number> = { type: 'number', integer: true };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Number range', () => {
    it('should return success when value is within the specified range', () => {
      const value = 75;
      const rule: Rule<number> = { type: 'number', min: 0, max: 100 };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is below the minimum', () => {
      const value = -10;
      const rule: Rule<number> = { type: 'number', min: 0, max: 100 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value is above the maximum', () => {
      const value = 150;
      const rule: Rule<number> = { type: 'number', min: 0, max: 100 };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
