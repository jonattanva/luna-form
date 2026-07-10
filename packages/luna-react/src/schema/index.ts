// Server-safe validation entry. Re-exports the headless schema builder and its
// types from @luna-form/core WITHOUT pulling any React code, so consumers (e.g.
// a server runtime) can derive and run the same Zod schema the form uses.
export { buildFormSchema, collectIssues } from '@luna-form/core'

export type {
  AssertRule,
  Column,
  Field,
  Fields,
  List,
  Operator,
  PatternRule,
  Section,
  Sections,
  Validation,
  WhenClause,
  WhenRule,
  ZodSchema,
} from '@luna-form/core'
