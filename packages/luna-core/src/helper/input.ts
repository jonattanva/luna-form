import { OPTIONS } from '../util/constant'
import { buildOptions, buildSource } from '../util/build'
import { getCurrentValue, toOptions } from '../util/extract'
import { isCheckbox, isOptions, isSelect, isValidValue } from '../util/is-input'
import type { CommonProps, DataSource, Field, Nullable, Value } from '../type'

export function resolveSource(
  field: Field,
  value?: Nullable<Record<string, unknown>>
) {
  const current = buildSource(field)
  if (current) {
    return current
  }
  return buildOptions(field, value)
}

export function getInputValue<K>(field: Field, value?: Nullable<K>) {
  return getCurrentValue(value, field.advanced?.entity)
}

export function mergeOptionsProps(
  field: Field,
  commonProps: CommonProps,
  options?: Nullable<DataSource | unknown[]>
) {
  return isOptions(field) && Array.isArray(options)
    ? { ...commonProps, [OPTIONS]: options }
    : commonProps
}

export function getPreselectedValue(
  field: Field,
  commonProps: CommonProps,
  value?: Value
) {
  if (field.required && !isValidValue(value)) {
    if (isSelect(field)) {
      if (field.advanced?.preselected !== false && OPTIONS in commonProps) {
        const options = commonProps[OPTIONS]
        if (Array.isArray(options) && options.length === 1) {
          return options[0]
        }
      }
    }
  }
  return value
}

export function getOptions<T>(field: Field, data?: Nullable<T[]>) {
  if (isSelect(field) && Array.isArray(data)) {
    return toOptions(data, field.advanced?.options)
  }
  return data
}

export function prepareInputProps<T, K>(
  field: Field,
  commonProps: CommonProps,
  data?: Nullable<DataSource | T[]>,
  value?: Nullable<K>
) {
  const currentValue = getInputValue(field, value)
  const options = Array.isArray(data) ? getOptions(field, data) : data

  const commonPropsWithOptions = mergeOptionsProps(field, commonProps, options)

  const defaultValue = getPreselectedValue(
    field,
    commonPropsWithOptions,
    currentValue
  )

  return {
    commonPropsWithOptions,
    defaultValue,
  }
}

export function prepareInputValue<T>(field: Field, value?: Nullable<T>) {
  if (isCheckbox(field)) {
    return {
      checked: isValidValue(value),
    }
  }
  return { value: value ?? '' }
}

export function prepareDefaultValue<T>(field: Field, value?: Nullable<T>) {
  if (isCheckbox(field)) {
    return {
      defaultChecked: isValidValue(value),
    }
  }
  return { defaultValue: value }
}
