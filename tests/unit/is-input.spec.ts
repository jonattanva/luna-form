import { describe, expect, test } from 'vitest'
import {
  isEmail,
  isNumber,
  isOptions,
  isRadio,
  isSelectMonth,
  isSelectYear,
  isText,
  isTextArea,
  keepsValue,
} from '@/packages/luna-core/src/util/is-input'
import type { Field, List } from '@/packages/luna-core/src/type'

describe('Is Input Utility', () => {
  test('should identify select month inputs correctly', () => {
    const fieldMonth = {
      name: 'birthMonth',
      type: 'select/month',
    }

    expect(isSelectMonth(fieldMonth)).toBe(true)
  })

  test('should identify non-select month inputs correctly', () => {
    const fieldYear = {
      name: 'birthYear',
      type: 'select/year',
    }

    expect(isSelectMonth(fieldYear)).toBe(false)
  })

  test('should identify select year inputs correctly', () => {
    const fieldYear = {
      name: 'birthYear',
      type: 'select/year',
    }

    expect(isSelectYear(fieldYear)).toBe(true)
  })

  test('should identify non-select year inputs correctly', () => {
    const fieldEmail = {
      name: 'email',
      type: 'email',
    }

    expect(isSelectYear(fieldEmail)).toBe(false)
  })

  test('should identify options inputs correctly', () => {
    const fieldOptions = {
      name: 'country',
      type: 'select/options',
      options: ['USA', 'Canada', 'Mexico'],
    }

    expect(isOptions(fieldOptions)).toBe(true)
  })

  test('should identify non-options inputs correctly', () => {
    const fieldText = {
      name: 'firstName',
      type: 'text',
    }

    expect(isOptions(fieldText)).toBe(false)
  })

  test('should identify radio inputs as options', () => {
    const fieldRadio = {
      name: 'gender',
      type: 'radio',
      options: ['Male', 'Female', 'Other'],
    }

    expect(isOptions(fieldRadio)).toBe(true)
  })

  test('should identify non-radio inputs correctly', () => {
    const fieldNumber = {
      name: 'age',
      type: 'number',
    }

    expect(isOptions(fieldNumber)).toBe(false)
  })

  test('should identify nom-radio inputs type incorrectly', () => {
    const field = {
      name: 'age',
      type: 1234,
    }

    // @ts-expect-error Testing invalid type
    expect(isRadio(field)).toBe(false)
  })

  test('should identify textarea inputs correctly', () => {
    expect(
      isTextArea({
        name: 'description',
        type: 'textarea',
      })
    ).toBe(true)

    expect(
      isTextArea({
        name: 'description',
        type: 'textarea/',
      })
    ).toBe(true)
  })

  test('should identify email inputs type correctly', () => {
    expect(
      isEmail({
        name: 'email',
        type: 'input/email',
      })
    ).toBe(true)

    expect(
      isEmail({
        name: 'email',
        type: 'email',
      })
    ).toBe(true)

    expect(
      isEmail({
        name: 'email',
        type: 'text/',
      })
    ).toBe(false)
  })

  test('should identify text inputs correctly', () => {
    expect(
      isText({
        name: 'firstName',
        type: 'text',
      })
    ).toBe(true)

    expect(
      isText({
        name: 'firstName',
        type: 'email',
      })
    ).toBe(true)

    expect(
      isText({
        name: 'firstName',
        type: 'textarea/',
      })
    ).toBe(false)
  })

  test('should identify number inputs correctly', () => {
    expect(
      isNumber({
        name: 'age',
        type: 'input/number',
      })
    ).toBe(true)

    expect(
      isNumber({
        name: 'age',
        type: 'number',
      })
    ).toBe(true)

    expect(
      isNumber({
        name: 'age',
        type: 'text/',
      })
    ).toBe(false)
  })
})

describe('Keeps Value Utility', () => {
  test('should read the flag from advanced', () => {
    expect(
      keepsValue({
        name: 'raw',
        type: 'textarea',
        advanced: { keepValue: true },
      })
    ).toBe(true)
  })

  test('should not keep a field that says so explicitly', () => {
    expect(
      keepsValue({
        name: 'raw',
        type: 'textarea',
        advanced: { keepValue: false },
      })
    ).toBe(false)
  })

  test('should not keep a field whose advanced says nothing about it', () => {
    expect(
      keepsValue({
        name: 'raw',
        type: 'textarea',
        advanced: { transient: true },
      })
    ).toBe(false)
  })

  test('should not keep a field with no advanced at all', () => {
    expect(
      keepsValue({
        name: 'raw',
        type: 'textarea',
      })
    ).toBe(false)
  })

  test('should read the flag off a list, alongside its other advanced keys', () => {
    const list: List = {
      name: 'items',
      type: 'list',
      fields: [{ name: 'value', type: 'input/text' }],
      advanced: { length: { min: 1 }, keepValue: true },
    }

    expect(keepsValue(list)).toBe(true)
  })

  // The property used to sit at the top level, beside `hidden`. Nothing reads
  // it there any more, and every key of a field is optional -- so a definition
  // written the old way is not a type error, it is a value quietly dropped.
  // This is the test that says so out loud.
  test('should ignore the flag written at the top level', () => {
    const field = {
      name: 'raw',
      type: 'textarea',
      keepValue: true,
    } as Field

    expect(keepsValue(field)).toBe(false)
  })
})
