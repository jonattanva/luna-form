import { applyCompareValidation } from '@/packages/luna-core/src/util/compare'
import { expect, test } from '@playwright/test'
import { z } from 'zod'
import type { Field } from '@/packages/luna-core/src/type'

test.describe('Compare Utility', { tag: ['@unit'] }, () => {
  test('should return same schema if no comparison rules are present', () => {
    const schema = z.object({
      field1: z.string(),
    })
    const fields: Field[] = [{ name: 'field1', type: 'text' }]

    const result = applyCompareValidation(schema, fields)
    expect(result).toBe(schema)
  })

  test('should validate equal values (eq operator)', () => {
    const schema = z.object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    const fields: Field[] = [
      { name: 'password', type: 'password' },
      {
        name: 'confirmPassword',
        type: 'password',
        validation: {
          compare: {
            field: 'password',
            operator: 'eq',
            message: 'Passwords must match',
          },
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)

    // Valid case
    expect(
      result.safeParse({ password: '123', confirmPassword: '123' }).success
    ).toBe(true)

    // Invalid case
    const parseResult = result.safeParse({
      password: '123',
      confirmPassword: '456',
    })
    expect(parseResult.success).toBe(false)
    expect(parseResult.error?.issues[0].message).toBe('Passwords must match')
    expect(parseResult.error?.issues[0].path).toEqual(['confirmPassword'])
  })

  test('should default to eq operator if not specified', () => {
    const schema = z.object({
      a: z.string(),
      b: z.string(),
    })
    const fields: Field[] = [
      { name: 'a', type: 'text' },
      {
        name: 'b',
        type: 'text',
        validation: {
          compare: {
            field: 'a',
            message: 'Must be equal',
          },
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)
    expect(result.safeParse({ a: 'x', b: 'x' }).success).toBe(true)
    expect(result.safeParse({ a: 'x', b: 'y' }).success).toBe(false)
  })

  test('should validate not equal values (neq operator)', () => {
    const schema = z.object({
      currentName: z.string(),
      newName: z.string(),
    })
    const fields: Field[] = [
      { name: 'currentName', type: 'text' },
      {
        name: 'newName',
        type: 'text',
        validation: {
          compare: {
            field: 'currentName',
            operator: 'neq',
            message: 'New name must be different',
          },
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)
    expect(
      result.safeParse({ currentName: 'john', newName: 'doe' }).success
    ).toBe(true)
    expect(
      result.safeParse({ currentName: 'john', newName: 'john' }).success
    ).toBe(false)
  })

  test('should validate in operator', () => {
    const schema = z.object({
      list: z.array(z.string()),
      item: z.string(),
    })
    const fields: Field[] = [
      { name: 'list', type: 'list' },
      {
        name: 'item',
        type: 'text',
        validation: {
          compare: {
            field: 'list',
            operator: 'in',
            message: 'Item must be in list',
          },
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)
    expect(result.safeParse({ list: ['a', 'b'], item: 'a' }).success).toBe(true)
    expect(result.safeParse({ list: ['a', 'b'], item: 'c' }).success).toBe(
      false
    )
  })

  test('should validate nin operator', () => {
    const schema = z.object({
      blacklist: z.array(z.string()),
      username: z.string(),
    })
    const fields: Field[] = [
      { name: 'blacklist', type: 'list' },
      {
        name: 'username',
        type: 'text',
        validation: {
          compare: {
            field: 'blacklist',
            operator: 'nin',
            message: 'Username is blacklisted',
          },
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)
    expect(
      result.safeParse({ blacklist: ['admin', 'root'], username: 'user' })
        .success
    ).toBe(true)
    expect(
      result.safeParse({ blacklist: ['admin', 'root'], username: 'admin' })
        .success
    ).toBe(false)
  })

  test('should handle multiple comparison rules for a single field', () => {
    const schema = z.object({
      a: z.number(),
      b: z.number(),
      c: z.number(),
    })
    const fields: Field[] = [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      {
        name: 'c',
        type: 'number',
        validation: {
          compare: [
            { field: 'a', operator: 'neq', message: 'C must not be A' },
            { field: 'b', operator: 'eq', message: 'C must be B' },
          ],
        },
      },
    ]

    const result = applyCompareValidation(schema, fields)
    // a=1, b=2, c=2 (c != a and c == b) -> OK
    expect(result.safeParse({ a: 1, b: 2, c: 2 }).success).toBe(true)

    // a=2, b=2, c=2 (c == a) -> FAIL
    const fail1 = result.safeParse({ a: 2, b: 2, c: 2 })
    expect(fail1.success).toBe(false)
    expect(fail1.error?.issues[0].message).toBe('C must not be A')

    // a=1, b=3, c=2 (c != b) -> FAIL
    const fail2 = result.safeParse({ a: 1, b: 3, c: 2 })
    expect(fail2.success).toBe(false)
    expect(fail2.error?.issues[0].message).toBe('C must be B')
  })
})
