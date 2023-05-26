# Simp Validator

[![GitHub release](https://img.shields.io/github/release/dncgmh/simp-validator?include_prereleases=&sort=semver&color=blue)](https://github.com/dncgmh/simp-validator/releases/)
[![License](https://img.shields.io/badge/License-ISC-blue)](https://github.com/dncgmh/simp-validator/blob/main/LICENSE)
[![issues - simp-validator](https://img.shields.io/github/issues/dncgmh/simp-validator)](https://github.com/dncgmh/simp-validator/issues)
[![codecov](https://codecov.io/gh/dncgmh/simp-validator/branch/main/graph/badge.svg)](https://codecov.io/gh/dncgmh/simp-validator)
![npm](https://img.shields.io/npm/dw/simp-validator)

The Simp Validator is a lightweight JavaScript library that provides functions for validating a single value or an entire data object against a schema. It is designed to be simple, flexible, and easily transferable over the network, ensuring smooth JSON serialization. The library can be used in both browser and Node.js environments, making it versatile for various development scenarios.

## Installation

You can install the Simp Validator using npm:

```
npm install simp-validator
```

## Usage

To use the Simp Validator in your project, follow these steps:

1. Import the necessary functions and types from the library:

```javascript
import { validate, validateSchema, Rule, Schema } from 'simp-validator';
```

2. Define your validation rules using the `Rule` type:

```javascript
const rule: Rule = {
  type: 'string',
  required: true,
  min: 2,
};
```

3. Validate a single value using the `validate` function:

```javascript
const value = 'hello';
const result = validate(value, rule);
```

4. Validate an entire data object against a schema using the `validateSchema` function:

```javascript
const data = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
};

const schema: Schema = {
  name: { type: 'string', required: true },
  age: { type: 'number', min: 18 },
  email: { type: 'string', pattern: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$' },
};

const validationResult = validateSchema(data, schema);
```

5. Check the validation result:

```javascript
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

The `ValidationResult` object represents the result of a validation. It has the following properties:

- `success`: A boolean indicating whether the validation was successful.
- `data`: The parsed data if the validation was successful.
- `message`: The error message if the validation failed.
- `details`: The error details if the validation failed.
