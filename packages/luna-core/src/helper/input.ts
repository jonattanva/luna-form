import { MAX, MAX_LENGTH, MIN, MIN_LENGTH, OPTIONS } from '../util/constant'
import { buildOptions, buildSource, isArraySource } from '../util/build'
import {
  fromNativeDate,
  getConvert,
  getCurrentYear,
  getDateFormat,
  getMonth,
  getTimeFormat,
  getTimezones,
  getWeekDays,
  getYear,
  toNativeDate,
  toNativeTime,
} from '../util/date'
import { getCurrentValue, getType, toOptions } from '../util/extract'
import {
  isCheckbox,
  isChips,
  isChipsDays,
  isChipsMonths,
  isDate,
  isInput,
  isNumber,
  isOptions,
  isSelect,
  isSelectActive,
  isSelectDay,
  isSelectMonth,
  isSelectTimezone,
  isSelectYear,
  isText,
  isTextArea,
  isTime,
  isValidValue,
} from '../util/is-input'
import { isObject, isString } from '../util/is-type'
import { translateOptions, type BuiltInKey } from '../util/translate'
import type {
  Chips,
  Date as DateField,
  CommonProps,
  DataSource,
  Field,
  Input,
  Nullable,
  Option,
  Select,
  Time,
  Value,
  TimeFormat,
  DateFormat,
  Localization,
} from '../type'

const now = getCurrentYear()

function buildOptionChips(field: Field, localization?: Localization) {
  if (isChips(field)) {
    // Only `lang` reaches the builder: chips have no authored copy of their
    // own, so the dictionary is deliberately withheld.
    return defineOptionChips(field, localization?.lang)
  }
}

function defineOptionChips(field: Chips, lang?: string) {
  if (isChipsDays(field)) {
    return getWeekDays(lang)
  }

  if (isChipsMonths(field)) {
    return getMonth(lang)
  }
}

function buildOptionSelect(field: Field, localization?: Localization) {
  if (isSelect(field)) {
    return defineOptionSelect(field, localization)
  }
}

function defineOptionSelect(select: Select, localization?: Localization) {
  const { lang, translations } = localization ?? {}

  if (isSelectDay(select)) {
    return getWeekDays(lang)
  }

  if (isSelectMonth(select)) {
    return getMonth(lang)
  }

  if (isSelectYear(select)) {
    const min = select.advanced?.length?.min ?? now
    const max = select.advanced?.length?.max ?? now + 5

    return getYear(getConvert(min, now), getConvert(max, now))
  }

  if (isSelectTimezone(select)) {
    return getTimezones()
  }

  // The only built-in selector whose labels are authored copy rather than
  // locale data, so it is the only one resolved against the dictionary. The
  // schema cannot name these strings, so they act as their own keys the same
  // way `(Optional)` does.
  if (isSelectActive(select)) {
    // `satisfies` rather than `translateBuiltIn`: the key is embedded in an
    // option that `translateOptions` resolves, so the compile-time link is all
    // that is needed here.
    return translateOptions(
      [
        { value: 'true', label: 'Yes' satisfies BuiltInKey },
        { value: 'false', label: 'No' satisfies BuiltInKey },
      ],
      translations
    )
  }
}

export function buildCommon(
  field: Field,
  disabled: boolean = false,
  localization?: Localization
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
      ...defineWithOptions(buildOptionSelect(field, localization)),
    }
  }

  if (isTextArea(field)) {
    return {
      ...commonProps,
      ...defineTextArea(field),
    }
  }

  if (isChips(field)) {
    return {
      ...commonProps,
      ...defineChips(field, localization),
    }
  }

  return commonProps
}

function defineInput(input: Input) {
  const type = getType(input.type)
  const copy = { ...input, type }

  return {
    ...defineTime(input),
    ...defineAutoComplete(input),
    ...defineNumberLimits(copy),
    ...(isText(copy) ? defineLength(copy) : {}),
    type,
  }
}

function defineWithOptions<T>(options: T | undefined) {
  return options ? { options } : {}
}

function defineChips(field: Chips, localization?: Localization) {
  const withOptions = defineWithOptions(buildOptionChips(field, localization))
  const multiple = field.advanced?.multiple ?? true
  return { ...withOptions, multiple }
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

function defineTime(field: Field) {
  if (isTime(field)) {
    const format = getTimeFormat(field)
    const withSeconds = format === 'HH:mm:ss' || format === 'hh:mm:ss a'

    return {
      step: withSeconds ? '1' : '60',
    }
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

  const currentValue = getCurrentValue(newValue, field.advanced?.entity)
  const effectiveValue = isValidValue(currentValue)
    ? currentValue
    : field.defaultValue

  if (isTime(field) && isValidValue(effectiveValue)) {
    return getTimeValue(field, effectiveValue)
  }

  if (isDate(field) && isValidValue(effectiveValue)) {
    return getDateValue(field, effectiveValue)
  }

  return effectiveValue
}

function getTimeValue(field: Time, currentValue?: Value) {
  const format = getTimeFormat(field)
  return isString(currentValue)
    ? toNativeTime(currentValue, format)
    : currentValue
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

export function getOptions<T>(
  field: Field,
  data?: Nullable<T[]>,
  translations?: Record<string, string>
) {
  if (isOptions(field) && Array.isArray(data)) {
    const options = toOptions(data, field.advanced?.options)

    // Labels are only resolved for options declared inline in the schema.
    // A remote source returns data, not authored copy, so it stays as fetched.
    return isArraySource(field)
      ? translateOptions(options, translations)
      : options
  }
  return data
}

export function prepareInputProps<T, K>(
  field: Field,
  commonProps: CommonProps,
  data?: Nullable<DataSource | T[]>,
  value?: Nullable<K>,
  translations?: Record<string, string>
) {
  const currentValue = getInputValue(field, value)
  const options = Array.isArray(data)
    ? getOptions(field, data, translations)
    : data

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
    // A checkbox is a boolean, so what matters is whether the value is true —
    // not whether there is one. `isValidValue` answers the second question, and
    // `false` is a perfectly valid value.
    return {
      checked: Boolean(value),
    }
  }

  if (isChips(field)) {
    return { value: Array.isArray(value) ? value : [] }
  }

  if (isDate(field)) {
    if (isString(value) && isValidValue(value)) {
      return { value: fromNativeDate(value, getDateFormat(field)) }
    }
  }

  if (isSelectActive(field)) {
    return { value: isValidValue(value) ? String(value) : '' }
  }

  return { value: value ?? '' }
}

export function prepareDefaultValue<T>(field: Field, value?: Nullable<T>) {
  if (isCheckbox(field)) {
    // Same rule as `prepareInputValue`, and the reason this is spelled out twice:
    // asking `isValidValue` here rendered `defaultValue: false` as a checked box
    // on the server while the client left it clear.
    return {
      defaultChecked: Boolean(value),
    }
  }
  return { defaultValue: value }
}

function getDateValue(field: DateField, currentValue?: Value) {
  const format = getDateFormat(field)
  return isString(currentValue)
    ? toNativeDate(currentValue, format)
    : currentValue
}

export function getFormatProps(
  dateFormat: Nullable<DateFormat>,
  timeFormat: Nullable<TimeFormat>
) {
  const format = dateFormat ?? timeFormat
  return format ? { 'data-format': format } : {}
}

function normalizePreviewOptions(
  items: readonly unknown[]
): Array<Option | string> {
  const out: Array<Option | string> = []
  for (const item of items) {
    if (typeof item === 'string') {
      out.push(item)
      continue
    }
    if (
      isObject(item) &&
      'value' in item &&
      'label' in item &&
      isString(item.value) &&
      isString(item.label)
    ) {
      out.push({ label: item.label, value: item.value })
    }
  }
  return out
}

export function getPreviewOptions(
  field: Field,
  localization?: Localization
): Array<Option | string> | undefined {
  if (!isOptions(field)) {
    return undefined
  }

  const builtIn = isChips(field)
    ? buildOptionChips(field, localization)
    : buildOptionSelect(field, localization)
  if (Array.isArray(builtIn)) {
    const flat = normalizePreviewOptions(builtIn)
    return flat.length > 0 ? flat : undefined
  }

  const source = buildSource(field)
  if (Array.isArray(source)) {
    const mapped = toOptions(source, field.advanced?.options)
    const flat = normalizePreviewOptions(
      translateOptions(mapped, localization?.translations)
    )
    return flat.length > 0 ? flat : undefined
  }

  return undefined
}

export function resolveOptionLabel(
  value: unknown,
  options: Array<Option | string>
): string {
  const str = String(value)
  for (const opt of options) {
    if (typeof opt === 'string') {
      if (opt === str) {
        return opt
      }
    } else if (opt.value === str) {
      return opt.label
    }
  }
  return str
}
