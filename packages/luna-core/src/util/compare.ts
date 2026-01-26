import { operators } from './operator'
import type { Compare, Field, ZodSchema } from '../type'

export function applyCompareValidation(schema: ZodSchema, fields: Field[]) {
  const rules = getRules(fields)
  if (rules.length === 0) {
    return schema
  }

  return schema.superRefine((data, context) => {
    for (const { name, rule } of rules) {
      if (!evaluate(data, name, rule)) {
        context.addIssue({
          code: 'custom',
          message: rule.message,
          path: [name],
        })
      }
    }
  })
}

function evaluate(
  data: Record<string, unknown>,
  name: string,
  rule: Compare
): boolean {
  const operator = rule.operator ?? 'eq'
  const operation = operators[operator]
  if (operation) {
    return operation(data[name], data[rule.field])
  }
  return false
}

function getRules(fields: Field[]) {
  const results: Array<{ name: string; rule: Compare }> = []
  for (const field of fields) {
    const compare = field.validation?.compare
    if (!compare) {
      continue
    }

    const rules = Array.isArray(compare) ? compare : [compare]
    for (const rule of rules) {
      results.push({ name: field.name, rule })
    }
  }
  return results
}
