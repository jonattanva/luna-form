/**
 * Proof of concept: Custom validation at the getSchema level.
 *
 * Run: npx tsx benchmark/schema-custom-validation.ts
 */

import { z } from 'zod'
import {
  getSchema,
  buildSchema,
  applyCustomValidation,
} from '../packages/luna-core/src/util/schema'
import type { Field, Input } from '../packages/luna-core/src/type'

const confirmPasswordField: Input = {
  name: 'confirmPassword',
  type: 'input/text',
  required: true,
  validation: {
    required: 'Confirm password is required',
    custom: {
      field: 'password',
      operator: 'eq',
      message: 'Passwords must match',
    },
  },
}

const schema = getSchema(confirmPasswordField)

// --- Test A: safeParse with a single value (current behavior) ---

console.log('=== A: safeParse with single value ===')
console.log()

const a1 = schema.safeParse('myPassword123')
console.log('A1 - "myPassword123":', a1.success)

const a2 = schema.safeParse('')
console.log(
  'A2 - "" (empty):',
  a2.success,
  a2.error?.issues.map((i) => i.message)
)

const a3 = schema.safeParse('differentPassword')
console.log(
  'A3 - "differentPassword":',
  a3.success,
  '(custom rule ignored, no cross-field context)'
)
console.log()

// --- Test B: safeParse with an object ---
// getSchema returns z.coerce.string() (or similar), NOT z.object().
// Passing an object to a string schema will coerce it to "[object Object]".

console.log('=== B: safeParse with object ===')
console.log()

const b1 = schema.safeParse({ confirmPassword: 'abc', password: 'abc' })
console.log('B1 - { confirmPassword: "abc", password: "abc" }:')
console.log('  success:', b1.success)
if (b1.success) {
  console.log('  data:', b1.data)
  console.log(
    '  ** z.coerce.string() coerces the object to "[object Object]" **'
  )
}
console.log()

// --- Test C: The approach that DOES work -- buildSchema + applyCustomValidation ---
// Uses the combined object schema with superRefine for cross-field validation.

console.log('=== C: buildSchema + applyCustomValidation (form-level) ===')
console.log()

const fields: Field[] = [
  { name: 'password', type: 'input/text', required: true },
  confirmPasswordField,
]

const passwordSchema = getSchema({
  name: 'password',
  type: 'input/text',
  required: true,
})
const combinedSchema = applyCustomValidation(
  buildSchema({
    password: passwordSchema,
    confirmPassword: schema,
  }),
  fields
)

const c1 = combinedSchema.safeParse({ password: 'abc', confirmPassword: 'abc' })
console.log('C1 - matching passwords:', c1.success)

const c2 = combinedSchema.safeParse({ password: 'abc', confirmPassword: 'xyz' })
console.log(
  'C2 - mismatched passwords:',
  c2.success,
  c2.error?.issues.map((i) => i.message)
)
console.log()

// --- Test D: Mini object schema per field (alternative) ---
// Build a small z.object with only the fields involved in the custom rule,
// then apply superRefine. This could work at field-level if we have access
// to the other field's value.

console.log('=== D: Mini object schema per field ===')
console.log()

const miniSchema = z
  .object({
    confirmPassword: z.coerce.string(),
    password: z.coerce.string(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['confirmPassword'],
      })
    }
  })

const d1 = miniSchema.safeParse({ confirmPassword: 'abc', password: 'abc' })
console.log('D1 - matching:', d1.success)

const d2 = miniSchema.safeParse({ confirmPassword: 'xyz', password: 'abc' })
console.log(
  'D2 - mismatched:',
  d2.success,
  d2.error?.issues.map((i) => i.message)
)
console.log()

console.log('=== SUMMARY ===')
console.log('A) Single value  -> No cross-field validation possible')
console.log(
  'B) Object value  -> z.coerce.string() coerces to "[object Object]", useless'
)
console.log(
  'C) Form-level    -> Works via buildSchema + applyCustomValidation + superRefine'
)
console.log(
  'D) Mini object   -> Works but requires building a z.object per field at runtime'
)
