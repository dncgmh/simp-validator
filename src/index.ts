import { toSchema } from './utils';
import { schemaValidate, validate, registerValidator } from './validators';
import type { Schema, Rule } from './interface';

export default {
  toSchema,
  schemaValidate,
  validate,
  registerValidator,
};

export { toSchema, schemaValidate, validate, registerValidator, type Schema, type Rule };
