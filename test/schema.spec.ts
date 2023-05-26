import { schemaValidate, toSchema } from '../src/index';
import type { Rule, Schema } from '../src/interface';

describe('toSchema', () => {
  describe('Conversion of rules to schema', () => {
    it('should convert an array of rules to a schema object', () => {
      const rules: Rule[] = [
        {
          name: 'firstName',
          type: 'string',
          required: true,
          description: 'The first name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        {
          name: 'lastName',
          type: 'string',
          required: true,
          description: 'The last name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        {
          name: 'age',
          type: 'number',
          required: true,
          description: 'The age of the person',
          min: 18,
          max: 120,
          integer: true,
        },
        {
          name: 'email',
          type: 'string',
          required: true,
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
          required: true,
          description: 'The first name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        lastName: {
          name: 'lastName',
          type: 'string',
          required: true,
          description: 'The last name of the person',
          min: 2,
          max: 20,
          pattern: '^[A-Za-z]+$',
        },
        age: {
          name: 'age',
          type: 'number',
          required: true,
          description: 'The age of the person',
          min: 18,
          max: 120,
          integer: true,
        },
        email: {
          name: 'email',
          type: 'string',
          required: true,
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
      const schema = toSchema(rules);
      expect(schema).toEqual({ schema: expectedSchema });
    });

    it('should return an empty object if the rules array is empty', () => {
      const schema = toSchema();
      expect(schema).toEqual({ schema: {} });
    });

    it('should returns an error when a rule does not have a name', () => {
      const rules: Rule[] = [{ name: 'rule1', type: 'string' }, { type: 'string' }, { name: 'rule3', type: 'string' }];
      const schema = toSchema(rules);
      expect(schema.schema).toBeNull();
      expect(schema.message).toBeDefined();
    });

    it('toSchema returns an error when rules is not an array', () => {
      const rules = 'not an array';
      const schema = toSchema(rules as any);
      expect(schema.schema).toBeNull();
      expect(schema.message).toBeDefined();
    });
  });
});

const schema: Schema = {
  name: { type: 'string', required: true },
  age: { type: 'number', integer: true, min: 0, max: 120 },
  email: { type: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  hobbies: { type: 'array', items: { type: 'string' } },
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
