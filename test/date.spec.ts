import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate date', () => {
  describe('Required date', () => {
    it('should return success when value is a string representation of a valid date', () => {
      const value = '2022-01-01';
      const rule: Rule<Date> = { type: 'date' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data instanceof Date).toBe(true);
    });

    it('should return success when value is a number representing a valid date', () => {
      const value = 1640995200000; // UNIX timestamp for '2022-01-01'
      const rule: Rule<Date> = { type: 'date' };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data instanceof Date).toBe(true);
    });

    it('should return failure when value is a string representation of an invalid date', () => {
      const value = '2022-13-01'; // Invalid month
      const rule: Rule<Date> = { type: 'date' };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value is not a date', () => {
      const value = 'not a date';
      const rule: Rule<Date> = { type: 'date' };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('Date range', () => {
    it('should return success when value is within the minimum and maximum date range', () => {
      const value = new Date('2022-03-15');
      const rule: Rule<Date> = {
        type: 'date',
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-12-31').getTime(),
      };
      const result = validate(value, rule);
      expect(result.success).toBe(true);
      expect(result.data).toStrictEqual(value);
    });

    it('should return failure when value is outside the maximum', () => {
      const value = new Date('2023-01-01');
      const rule: Rule<Date> = {
        type: 'date',
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-12-31').getTime(),
      };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return failure when value is outside the minimum', () => {
      const value = new Date('2021-12-31');
      const rule: Rule<Date> = {
        type: 'date',
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-12-31').getTime(),
      };
      const result = validate(value, rule);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
