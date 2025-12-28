import { OPTIONS } from '../constant'
import { buildOptions, buildSource } from '../build'
import { getCurrentValue, toOptions } from '../extract'
import { isOptions, isSelect, isValidValue } from '../is-input'
import type {
  CommonProps,
  DataSource,
  Field,
  Nullable,
  Value,
} from '../../type'

export function resolveSource(field: Field, value?: Record<string, unknown>) {
  const current = buildSource(field)
  if (current) {
    return current
  }
  return buildOptions(field, value)
}

export function getInputValue(field: Field, value?: Record<string, unknown>) {
  return getCurrentValue(
    field.name ? value?.[field.name] : undefined,
    field.advanced?.entity
  )
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
