import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate base', () => {
  describe('Required rule', () => {
    it('should return an error when value is undefined and required is true', () => {
      const value = undefined;
      const rule: Rule = { type: 'string', required: true, name: 'test-rule' };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Valid rule', () => {
    it('should return an error when valid is not an array', () => {
      const value = 'test';
      const rule = { type: 'string', valid: 'not an array', name: 'test-rule' };
      const result = validate(value, rule as any);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should skip validate valid when value is array', () => {
      const value = ['test'];
      const rule: Rule = { type: 'array', valid: ['test'], name: 'test-rule' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
    });

    it('should return an error when value is not in the valid array', () => {
      const value = 'invalid';
      const rule: Rule = { type: 'string', valid: ['test', 'example'], name: 'test-rule' };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
