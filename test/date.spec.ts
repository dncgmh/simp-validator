import { validate } from '../src';
import { type Rule } from '../src/interface';

describe('validate date', () => {
  it('should return success when value is a string representation of a valid date', () => {
    const value = '2022-01-01';
    const rule: Rule<Date> = { type: 'date', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data instanceof Date).toBe(true);
  });

  it('should return success when value is a number representing a valid date', () => {
    const value = 1640995200000; // UNIX timestamp for '2022-01-01'
    const rule: Rule<Date> = { type: 'date', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data instanceof Date).toBe(true);
  });

  it('should return failure when value is a string representation of an invalid date', () => {
    const value = '2022-13-01'; // Invalid month
    const rule: Rule<Date> = { type: 'date', required: true };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('should return success when value is within the minimum and maximum date range', () => {
    const value = new Date('2022-03-15');
    const rule: Rule<Date> = {
      type: 'date',
      required: true,
      min: new Date('2022-01-01').getTime(),
      max: new Date('2022-12-31').getTime(),
    };
    const result = validate(value, rule);
    expect(result.success).toBe(true);
    expect(result.data).toBe(value);
  });

  it('should return failure when value is outside the minimum and maximum date range', () => {
    const value = new Date('2023-01-01');
    const rule: Rule<Date> = {
      type: 'date',
      required: true,
      min: new Date('2022-01-01').getTime(),
      max: new Date('2022-12-31').getTime(),
    };
    const result = validate(value, rule);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});
