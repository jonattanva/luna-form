import { expect, test } from '@playwright/test'
import {
  prepareDefaultValue,
  getOptions,
  mergeOptionsProps,
  getInputValue,
  getPreselectedValue,
  resolveSource,
  prepareInputProps,
} from '@/packages/luna-core/src/helper/input'
import type { Field, Select, CommonProps } from '@/packages/luna-core/src/type'

test.describe('Input Helper', { tag: ['@unit'] }, () => {
  test('should return defaultChecked for checkbox fields', () => {
    const field: Field = {
      name: 'subscribe',
      type: 'checkbox',
    }
    const value = true
    const result = prepareDefaultValue(field, value)
    expect(result).toEqual({ defaultChecked: true })
  })

  test('should return defaultValue for non-checkbox fields', () => {
    const field: Field = {
      name: 'username',
      type: 'input/text',
    }
    const value = 'johndoe'
    const result = prepareDefaultValue(field, value)
    expect(result).toEqual({ defaultValue: 'johndoe' })
  })

  test('should handle undefined values', () => {
    const field: Field = {
      name: 'username',
      type: 'input/text',
    }
    const result = prepareDefaultValue(field)
    expect(result).toEqual({ defaultValue: undefined })
  })

  test('should return defaultValue for radio fields', () => {
    const field: Field = {
      name: 'gender',
      type: 'radio',
    }
    const value = 'male'
    const result = prepareDefaultValue(field, value)
    expect(result).toEqual({ defaultValue: 'male' })
  })

  test('should return data as is if field is not a select', () => {
    const field: Field = { name: 'test', type: 'input/text' }
    const data = [{ id: 1, name: 'Option 1' }]
    const result = getOptions(field, data)
    expect(result).toEqual(data)
  })

  test('should return data as is if data is not an array', () => {
    const field: Field = { name: 'test', type: 'select' }
    const data = null
    const result = getOptions(field, data)
    expect(result).toBeNull()
  })

  test('should transform data if field is a select and data is an array', () => {
    const field: Field = { name: 'test', type: 'select' }
    const data = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ]

    const result = getOptions(field, data)
    expect(result).toEqual([
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ])
  })

  test('should use custom mapping from field.advanced.options', () => {
    const field: Select = {
      name: 'test',
      type: 'select',
      advanced: {
        options: { label: 'name', value: 'id' },
      },
    }
    const data = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Doe' },
    ]

    const result = getOptions(field, data)
    expect(result).toEqual([
      { label: 'John', value: '1' },
      { label: 'Doe', value: '2' },
    ])
  })

  test('should return commonProps if field is not an options field', () => {
    const field: Field = { name: 'test', type: 'input/text' }
    const commonProps: CommonProps = { id: 'test' }
    const options = [{ label: 'Option 1', value: '1' }]
    const result = mergeOptionsProps(field, commonProps, options)
    expect(result).toEqual(commonProps)
  })

  test('should return commonProps if options is not an array', () => {
    const field: Field = { name: 'test', type: 'select' }
    const commonProps: CommonProps = { id: 'test' }
    const options = { url: '/api/options' }
    const result = mergeOptionsProps(field, commonProps, options)
    expect(result).toEqual(commonProps)
  })

  test('should merge options into commonProps if field is select and options is an array', () => {
    const field: Field = { name: 'test', type: 'select' }
    const commonProps: CommonProps = { id: 'test' }
    const options = [{ label: 'Option 1', value: '1' }]
    const result = mergeOptionsProps(field, commonProps, options)
    expect(result).toEqual({ ...commonProps, options })
  })

  test('should merge options into commonProps if field is radio and options is an array', () => {
    const field: Field = { name: 'test', type: 'radio' }
    const commonProps: CommonProps = { id: 'test' }
    const options = [{ label: 'Option 1', value: '1' }]
    const result = mergeOptionsProps(field, commonProps, options)
    expect(result).toEqual({ ...commonProps, options })
  })

  test('should return undefined if values are not provided', () => {
    const field: Field = { name: 'username', type: 'input/text' }
    const result = getInputValue(field)
    expect(result).toBeUndefined()
  })

  test('should return the value from the record using field name', () => {
    const field: Field = { name: 'username', type: 'input/text' }
    const values = { username: 'johndoe' }
    const result = getInputValue(field, values)
    expect(result).toBe('johndoe')
  })

  test('should return undefined if field name is not in values', () => {
    const field: Field = { name: 'email', type: 'input/text' }
    const values = { username: 'johndoe' }
    const result = getInputValue(field, values)
    expect(result).toBeUndefined()
  })

  test('should extract value from object if field value is an object', () => {
    const field: Field = { name: 'user', type: 'select' }
    const values = { user: { label: 'John', value: '1' } }
    const result = getInputValue(field, values)
    expect(result).toBe('1')
  })

  test('should extract specific entity from object if requested', () => {
    const field: Field = {
      name: 'user',
      type: 'select',
      advanced: { entity: 'label' },
    }
    const values = { user: { label: 'John', value: '1' } }
    const result = getInputValue(field, values)
    expect(result).toBe('John')
  })

  test('should return undefined if value is null', () => {
    const field: Field = { name: 'username', type: 'input/text' }
    const values = { username: null }
    const result = getInputValue(field, values)
    expect(result).toBeUndefined()
  })

  test('should return the original value if not required', () => {
    const field: Field = { name: 'test', type: 'select', required: false }
    const result = getPreselectedValue(field, {}, undefined)
    expect(result).toBeUndefined()
  })

  test('should return the original value if already has value', () => {
    const field: Field = { name: 'test', type: 'select', required: true }
    const result = getPreselectedValue(field, {}, 'already-selected')
    expect(result).toBe('already-selected')
  })

  test('should return the only option if required and no value', () => {
    const field: Field = { name: 'test', type: 'select', required: true }
    const commonProps = { options: ['only-one'] } as CommonProps

    const result = getPreselectedValue(field, commonProps, undefined)
    expect(result).toBe('only-one')
  })

  test('should NOT return the option if there are multiple options', () => {
    const field: Field = { name: 'test', type: 'select', required: true }
    const commonProps = { options: ['one', 'two'] } as CommonProps

    const result = getPreselectedValue(field, commonProps, undefined)
    expect(result).toBeUndefined()
  })

  test('should NOT return the option if preselected is false', () => {
    const field: Select = {
      name: 'test',
      type: 'select',
      required: true,
      advanced: { preselected: false },
    }

    const commonProps = { options: ['only-one'] } as CommonProps
    const result = getPreselectedValue(field, commonProps, undefined)
    expect(result).toBeUndefined()
  })

  test('should return original value if not a select field', () => {
    const field: Field = { name: 'test', type: 'input/text', required: true }
    const commonProps = { options: ['only-one'] } as CommonProps
    const result = getPreselectedValue(field, commonProps, undefined)
    expect(result).toBeUndefined()
  })

  test('should return field source if available via buildSource', () => {
    const field: Select = {
      name: 'test',
      type: 'select',
      source: [{ label: 'Source', value: '1' }],
    }
    const result = resolveSource(field)
    expect(result).toEqual(field.source)
  })

  test('should return current value if select is disabled (via buildOptions)', () => {
    const field: Field = {
      name: 'gender',
      type: 'select',
      disabled: true,
    }
    const values = { gender: { label: 'Male', value: 'male' } }
    const result = resolveSource(field, values)
    expect(result).toEqual([values.gender])
  })

  test('should return undefined if no source or options available', () => {
    const field: Field = { name: 'test', type: 'input/text' }
    const result = resolveSource(field)
    expect(result).toBeUndefined()
  })

  test('should return correct props for a text input', () => {
    const field: Field = { name: 'name', type: 'input/text' }
    const commonProps = { id: 'name-id' }
    const values = { name: 'John' }
    const result = prepareInputProps(field, commonProps, undefined, values)

    expect(result).toEqual({
      commonPropsWithOptions: commonProps,
      defaultValue: 'John',
    })
  })

  test('should handle select with data array and preselection', () => {
    const field: Field = { name: 'country', type: 'select', required: true }
    const commonProps = { id: 'country-id' }
    const data = [{ label: 'USA', value: 'us' }]
    const result = prepareInputProps(field, commonProps, data, undefined)

    expect(result).toEqual({
      commonPropsWithOptions: {
        ...commonProps,
        options: [{ label: 'USA', value: 'us' }],
      },
      defaultValue: { label: 'USA', value: 'us' },
    })
  })

  test('should handle data source objects', () => {
    const field: Field = { name: 'country', type: 'select' }
    const commonProps = { id: 'country-id' }
    const data = { url: '/api/countries' }
    const result = prepareInputProps(field, commonProps, data, undefined)

    expect(result).toEqual({
      commonPropsWithOptions: commonProps,
      defaultValue: undefined,
    })
  })
})
