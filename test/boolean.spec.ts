import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate boolean', () => {
  describe('Required boolean', () => {
    it('should return success when value is true and required is true', () => {
      const value = true;
      const rule: Rule<boolean> = { type: 'boolean', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return success when value is false and required is true', () => {
      const value = false;
      const rule: Rule<boolean> = { type: 'boolean', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toBe(value);
    });

    it('should return failure when value is undefined and required is true', () => {
      const value = undefined;
      const rule: Rule<boolean> = { type: 'boolean', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Invalid boolean', () => {
    it('should return failure when value is not a boolean', () => {
      const value = 'true';
      const rule: Rule<boolean> = { type: 'boolean', required: true };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
