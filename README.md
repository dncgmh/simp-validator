# Simp Validator

[![GitHub release](https://img.shields.io/github/release/dncgmh/simp-validator?include_prereleases=&sort=semver&color=blue)](https://github.com/dncgmh/simp-validator/releases/)
[![issues - simp-validator](https://img.shields.io/github/issues/dncgmh/simp-validator)](https://github.com/dncgmh/simp-validator/issues)
![CircleCI](https://img.shields.io/circleci/build/github/dncgmh/simp-validator/main)
[![codecov](https://codecov.io/gh/dncgmh/simp-validator/branch/main/graph/badge.svg)](https://codecov.io/gh/dncgmh/simp-validator)
![npm](https://img.shields.io/npm/dw/simp-validator)
[![License](https://img.shields.io/badge/License-ISC-blue)](https://github.com/dncgmh/simp-validator/blob/main/LICENSE)

The Simp Validator is a lightweight JavaScript library for validating data against a schema. It's simple, flexible, and easily transferable over the network. It can be used in both browser and Node.js environments, making it versatile for various development scenarios. Its key feature is the ability to validate data on both the frontend and backend using a single schema, which can be easily migrated or serialized/deserialized without impacting the validation process.

## Installation

You can install the Simp Validator using npm:

```
npm install simp-validator
```

## Usage

To use the Simp Validator in your project, follow these steps:

1. Import the necessary functions and types from the library:

```typescript
import { validate, validateSchema, Rule, Schema, toSchema } from 'simp-validator';
```

The `validate` function is used to validate a single value against a rule. The `validateSchema` function is used to validate an entire data object against a schema. The `Rule` and `Schema` types are used to define validation rules and schemas, respectively. The `toSchema` function is used to generate a schema from a TypeScript interface.

2. Define your validation rules using the `Rule` type:

```typescript
const rule: Rule = {
  type: 'string',
  required: true,
  min: 2,
  max: 10,
  pattern: '^[a-zA-Z]+$',
  len: 5,
};
```

The `Rule` type is an object that defines the validation rules for a single value. The `type` property is required and specifies the data type of the value being validated. Other properties depend on the data type being validated. In this example, we're validating a string value that is required, must be between 2 and 10 characters long, must match the pattern /^[a-zA-Z]+$/, and must be exactly 5 characters long.

3. Validate a single value using the `validate` function:

```typescript
const value = 'hello';
const result = validate(value, rule);
```

The `validate` function takes a value and a rule, and returns a `ValidationResult` object. The `ValidationResult` object contains a `success` property indicating whether the validation was successful, and a `message` property containing an error message if the validation failed.

4. Validate an entire data object against a schema using the `validateSchema` function:

```typescript
const data = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  hobbies: ['reading', 'swimming'],
};

const schema: Schema = {
  name: { type: 'string', required: true },
  age: { type: 'number', min: 18 },
  email: { type: 'string', pattern: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$' },
  hobbies: {
    type: 'array',
    items: { type: 'string', pattern: '^[a-zA-Z]+$' },
    min: 1,
    max: 5,
  },
};

const validationResult = validateSchema(data, schema);
```

The `validateSchema` function takes a data object and a schema, and returns a `SchemaValidationResult` object. The `SchemaValidationResult` object contains a `success` property indicating whether the validation was successful, a `data` property containing the parsed data if the validation was successful, and a `details` property containing an object with error messages for each field if the validation failed.

In this example, we're validating an object with several fields. The `name` field is a required string. The `age` field is a number that must be at least 18. The `email` field is a string that must match a specific pattern. The `hobbies` field is an array of strings that must match a specific pattern, must have at least one item, must have no more than five items, and must have unique items

5. Check the validation result:

```typescript
if (validationResult.success) {
  // Validation succeeded
  console.log('Validation passed!');
} else {
  // Validation failed
  console.error('Validation failed!');
  // Value validation error message
  console.error('Error messages:', validationResult.message);
  // Schema validation error object
  console.error('Error messages:', validationResult.details);
}
```

Check the `success` property of the `ValidationResult` or `SchemaValidationResult` object to determine whether the validation was successful. If the validation failed, check the `message` or `details` property for error messages.

6. Generate a schema from a TypeScript interface using the `toSchema` function:

```typescript
const rules: Rule[] = [
  { name: 'username', type: 'string', required: true },
  { name: 'age', type: 'number', required: false },
  { name: 'email', type: 'string', required: true, pattern: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$' },
  { name: 'hobbies', type: 'array', required: true, items: { type: 'string', pattern: '^[a-zA-Z]+$' } },
];

const { schema, message } = toSchema(rules);

if (schema) {
  console.log('Schema:', schema);
} else {
  console.error('Error:', message);
}
```

This code creates an array of `Rule` objects, calls the `toSchema` function with that array, and then logs the resulting schema object to the console if there were no errors. If there was an error, it logs the error message to the console instead.

GitHub Copilot: Sure, here's a summary of the Simp Validator library:

## Supported Data Types

The Simp Validator supports the following data types for validation:

- String
- Number
- Boolean
- Array
- Date

Each data type has its own set of validation rules that can be customized according to your needs.

## API

### `validate(value: any, rule: Rule): ValidationResult`

The `validate` function is used to validate a value against a given rule.

- `value`: The value to validate.
- `rule`: The rule to validate against.

Returns a `ValidationResult` object containing the result of the validation.

### `validateSchema(data: any, schema: Schema): SchemaValidationResult`

The `validateSchema` function is used to validate an entire data object against a schema.

- `data`: The data object to validate.
- `schema`: The schema to validate against.

Returns a `SchemaValidationResult` object containing the result of the schema validation.

### `Rule`

The `Rule` type represents a rule for validating a value. It has the following properties:

- `type`: The allowed data type of the value.
- `required`: A boolean indicating whether the value is required.
- `valid`: An array of valid values.
- Additional properties depending on the data type:
  - For `string`: `min`, `max`, `pattern`, `len`
  - For `number`: `integer`, `min`, `max`
  - For `boolean`: No additional properties
  - For `array`: `items`, `min`, `max`, `len`
  - For `date`: `min`, `max`
- `name` (required for schema conversion): The name of the field.
- `description`: The description of the field.

### `Schema`

The `Schema` type represents a schema for validating an entire data object. It is a record where the keys are the field names, and the values are the validation rules.

### `ValidationResult`

Validate a value against a rule. Returns a `ValidationResult` object containing the result of the validation.

- `success`: A boolean indicating whether the validation was successful.
- `message`: An error message if the validation failed.

### `SchemaValidationResult`

Validate an entire data object against a schema. Returns a `SchemaValidationResult` object containing the result of the schema validation.

- `success`: A boolean indicating whether the validation was successful.
- `data`: The parsed data if the validation was successful.
- `details`: An object containing error messages for each field if the validation failed.
