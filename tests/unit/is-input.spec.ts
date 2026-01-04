import { expect, test } from '@playwright/test'
import {
  isEmail,
  isNumber,
  isOptions,
  isRadio,
  isSelectMonth,
  isSelectYear,
  isText,
  isTextArea,
} from '@/packages/luna-core/src/util/is-input'

test.describe('Is Input Utility', { tag: ['@unit'] }, () => {
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
