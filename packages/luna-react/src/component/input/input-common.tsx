import {
  MAX,
  MAX_LENGTH,
  MIN,
  MIN_LENGTH,
  getType,
  isInput,
  isNumber,
  isSelect,
  isText,
  isTextArea,
  type CommonProps,
  type Field,
  type Input,
} from '@luna-form/core'
import { buildOptionSelect } from './input-option-select'

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
      result[keys.min] = length.min
    }

    if (length.max !== undefined) {
      result[keys.max] = length.max
    }
  }
  return result
}
