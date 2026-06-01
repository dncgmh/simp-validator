import { schemaValidate, toSchema } from '../src/index';
import type { Rule, Schema } from '../src/interface';

describe('toSchema', () => {
  describe('Conversion of rules to schema', () => {
    it('should convert an array of rules to a schema object', () => {
      const rules: Rule[] = [
        {
          name: 'firstName',
          type: 'string',
          description: 'The first name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        {
          name: 'lastName',
          type: 'string',
          description: 'The last name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        {
          name: 'age',
          type: 'number',
          description: 'The age of the person',
          min: 18,
          max: 120,
          integer: true,
        },
        {
          name: 'email',
          type: 'string',
          description: 'The email of the person',
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        {
          name: 'hobbies',
          type: 'array',
          items: { type: 'string' },
          description: 'The hobbies of the person',
        },
      ];
      const expectedSchema = {
        firstName: {
          name: 'firstName',
          type: 'string',
          description: 'The first name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        lastName: {
          name: 'lastName',
          type: 'string',
          description: 'The last name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        age: {
          name: 'age',
          type: 'number',
          description: 'The age of the person',
          min: 18,
          max: 120,
          integer: true,
        },
        email: {
          name: 'email',
          type: 'string',
          description: 'The email of the person',
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        hobbies: {
          name: 'hobbies',
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The hobbies of the person',
        },
      };
      const result = toSchema(rules);
      expect(result).toEqual({ success: true, data: expectedSchema });
    });

    it('should return an empty object if the rules array is empty', () => {
      const result = toSchema();
      expect(result).toEqual({ success: true, data: {} });
    });

    it('should returns an error when a rule does not have a name', () => {
      const rules: Rule[] = [{ name: 'rule1', type: 'string' }, { type: 'string' }, { name: 'rule3', type: 'string' }];
      const result = toSchema(rules);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('toSchema returns an error when rules is not an array', () => {
      const rules = 'not an array';
      const result = toSchema(rules as any);
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});

const schema: Schema = {
  name: { type: 'string' },
  age: { type: 'number', integer: true, min: 0, max: 120 },
  email: { type: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', optional: true },
  hobbies: { type: 'array', items: { type: 'string' }, optional: true },
};

describe('schemaValidate', () => {
  describe('Validation of input', () => {
    it('valid input should pass validation', () => {
      const input = {
        name: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
        hobbies: ['reading', 'traveling'],
      };
      const result = schemaValidate(input, schema);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
    });

    it('valid input should pass validation with additional fields', () => {
      const input = {
        name: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
        hobbies: ['reading', 'traveling'],
        additionalField: 'additional field',
      };
      const result = schemaValidate(input, schema);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ ...input, additionalField: undefined });
    });

    it('valid input should pass validation with missing optional fields', () => {
      const input = {
        name: 'John Doe',
        age: 30,
      };
      const result = schemaValidate(input, schema);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
    });

    it('invalid input should fail validation with errors', () => {
      const input = {
        age: 'not a number',
        email: 'invalid email',
        hobbies: [1, 2, 3],
      };
      const result = schemaValidate(input, schema);
      expect(result.success).toBe(false);
      expect(result.details).toBeDefined();
    });

    it('missing required field should fail validation', () => {
      const input = {
        age: 30,
        email: 'johndoe@example.com',
        hobbies: ['reading', 'traveling'],
      };
      const result = schemaValidate(input, schema);
      expect(result.success).toBe(false);
      expect(result.details).toBeDefined();
    });

    it('should returns an error when object is not an object or an array', () => {
      const object = 'not an object';
      const schema = {};
      const result = schemaValidate(object, schema);
      expect(result.success).toBe(false);
    });

    it('should returns an error when schema is not an object', () => {
      const object = {};
      const schema = 'not an object';
      const result = schemaValidate(object, schema as any);
      expect(result.success).toBe(false);
    });
  });
});
