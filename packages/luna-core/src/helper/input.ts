import {
  MAX,
  MAX_LENGTH,
  MIN,
  MIN_LENGTH,
  OPTIONS,
} from '../util/constant'
import { buildOptions, buildSource } from '../util/build'
import { getConvert, getCurrentYear, getMonth, getYear } from '../util/date'
import { getCurrentValue, getType, toOptions } from '../util/extract'
import {
  isCheckbox,
  isInput,
  isNumber,
  isOptions,
  isSelect,
  isSelectMonth,
  isSelectYear,
  isText,
  isTextArea,
  isValidValue,
} from '../util/is-input'
import { isObject } from '../util/is-type'
import type {
  CommonProps,
  DataSource,
  Field,
  Input,
  Nullable,
  Select,
  Value,
} from '../type'

const now = getCurrentYear()

export function buildOptionSelect(field: Field) {
  if (isSelect(field)) {
    return defineOption(field)
  }
}

function defineOption(select: Select) {
  if (isSelectMonth(select)) {
    return getMonth()
  }

  if (isSelectYear(select)) {
    const min = select.advanced?.length?.min ?? now
    const max = select.advanced?.length?.max ?? now + 5

    return getYear(getConvert(min, now), getConvert(max, now))
  }
}

export function buildCommon(
  field: Field,
  disabled: boolean = false
): CommonProps {
  const commonProps: CommonProps = {
    disabled,
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
    required: field.required,
  }

  if (isInput(field)) {
    return {
      ...commonProps,
      ...defineInput(field),
    }
  }

  if (isSelect(field)) {
    return {
      ...commonProps,
      ...defineSelect(field),
    }
  }

  if (isTextArea(field)) {
    return {
      ...commonProps,
      ...defineTextArea(field),
    }
  }

  return commonProps
}

function defineInput(input: Input) {
  const type = getType(input.type)
  const copy = { ...input, type }

  return {
    ...defineAutoComplete(input),
    ...defineNumberLimits(copy),
    ...(isText(copy) ? defineLength(copy) : {}),
    type,
  }
}

function defineSelect(field: Field) {
  const options = buildOptionSelect(field)
  if (options) {
    return { options }
  }
  return {}
}

function defineTextArea(field: Field) {
  return {
    ...defineAutoComplete(field),
    ...defineLength(field),
  }
}

function defineAutoComplete(input: Input) {
  const autoComplete = input.advanced?.autocomplete
  if (autoComplete) {
    return { autoComplete }
  }
  return {}
}

function defineNumberLimits(input: Input): Partial<CommonProps> {
  if (isNumber(input)) {
    return defineMinMax(input)
  }
  return {}
}

function defineLength(input: Input): Partial<CommonProps> {
  return defineConstraints(input, { min: MIN_LENGTH, max: MAX_LENGTH })
}

function defineMinMax(input: Input): Partial<CommonProps> {
  return defineConstraints(input, { min: MIN, max: MAX })
}

function defineConstraints(
  input: Input,
  keys: {
    min: typeof MIN | typeof MIN_LENGTH
    max: typeof MAX | typeof MAX_LENGTH
  }
): Partial<CommonProps> {
  const result: Record<string, number> = {}
  const length = input.advanced?.length
  if (length) {
    if (length.min !== undefined) {
      result[keys.min] = Number(length.min)
    }

    if (length.max !== undefined) {
      result[keys.max] = Number(length.max)
    }
  }
  return result
}

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
  const newValue =
    isObject(value) && field.name in value ? value[field.name] : value
  return getCurrentValue(newValue, field.advanced?.entity)
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
        const options = (commonProps as Record<string, unknown>)[OPTIONS]
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
      checked: isValidValue(value) ? value : false,
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
