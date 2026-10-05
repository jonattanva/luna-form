import {
  DATA_FORMAT,
  DATA_MODE,
  DATA_RESERVED,
  MAX,
  MAX_LENGTH,
  MIN,
  MIN_LENGTH,
  OPTIONS,
} from '../util/constant'
import {
  buildNumberStep,
  buildOptions,
  buildSource,
  isArraySource,
} from '../util/build'
import {
  buildDateLimits,
  buildSuggestedZone,
  buildYearLimits,
  getDateFormat,
  getMonth,
  getTimeFormat,
  getTimezones,
  getWeekDays,
  getYear,
  toNativeDate,
  toNativeTime,
  toRange,
} from '../util/date'
import { getCurrentValue, getType, toOptions } from '../util/extract'
import {
  isCheckbox,
  isChips,
  isChipsDays,
  isChipsMonths,
  isDate,
  isDateRange,
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
  CommonProps,
  DataSource,
  Field,
  Input,
  Nullable,
  Option,
  Select,
  Time,
  Value,
  DateFormat,
  Localization,
} from '../type'

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

// `now` is the instant the host gives in `context.now`, which a timezone
// select labels its zones for.
function buildOptionSelect(
  field: Field,
  localization?: Localization,
  now?: string
) {
  if (isSelect(field)) {
    return defineOptionSelect(field, localization, now)
  }
}

function defineOptionSelect(
  select: Select,
  localization?: Localization,
  now?: string
) {
  const { lang, translations } = localization ?? {}

  if (isSelectDay(select)) {
    return getWeekDays(lang)
  }

  if (isSelectMonth(select)) {
    return getMonth(lang)
  }

  if (isSelectYear(select)) {
    const { max, min } = buildYearLimits(select)
    return min !== undefined && max !== undefined ? getYear(min, max) : []
  }

  if (isSelectTimezone(select)) {
    return getTimezones(buildSuggestedZone(select), now)
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
  localization?: Localization,
  now?: string
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
      ...defineInput(field, localization?.lang),
    }
  }

  if (isSelect(field)) {
    return {
      ...commonProps,
      ...defineWithOptions(buildOptionSelect(field, localization, now)),
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

function defineInput(input: Input, lang?: string) {
  const type = getType(input.type)
  const copy = { ...input, type }

  return {
    ...defineTime(input),
    ...defineDate(input, lang),
    ...defineAutoComplete(input),
    ...defineNumberLimits(copy),
    ...defineNumberStep(copy),
    ...(isText(copy) ? defineLength(copy) : {}),
    type,
  }
}

// A number is whole unless it declares a step, which is the browser's own
// default of 1. `buildNumberStep` reads it once for both halves: it is rendered
// here and validated in `getNumber`, so the input's arrows and the schema move
// by the same step.
function defineNumberStep(input: Input) {
  const step = buildNumberStep(input)
  if (isNumber(input) && step !== undefined) {
    return { step }
  }
  return {}
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

// What a temporal field tells the component that renders it, the same on the
// server and in the browser: these props are built here, where both render
// paths build theirs. The format attribute says how to show the value, never
// the shape of the value itself. For a date, `readDateProps` reads it back.
function defineTime(field: Field) {
  if (isTime(field)) {
    const format = getTimeFormat(field)
    const withSeconds = format === 'HH:mm:ss' || format === 'hh:mm:ss a'

    return {
      [DATA_FORMAT]: format,
      step: withSeconds ? '1' : '60',
    }
  }
  return {}
}

// A date's bounds go on as `min` and `max`, which a native date input uses as
// they are, and its reserved days as one list in a data attribute, which any
// element accepts, where an array in an unknown prop would reach the DOM as
// text. A calendar from any library reads them back with `readDateProps`.
// `lang` is a standard attribute: a native input takes it as it comes, and a
// calendar reads it, through `readDateProps`, for its month and day names.
function defineDate(field: Field, lang?: string) {
  const format = dateFormatOf(field)
  if (!format) {
    return {}
  }

  const { max, min, reserved } = buildDateLimits(field)
  return {
    [DATA_FORMAT]: format,
    ...(lang && { lang }),
    ...(min !== undefined && { [MIN]: min }),
    ...(max !== undefined && { [MAX]: max }),
    ...(reserved.length > 0 && { [DATA_RESERVED]: reserved.join(',') }),
    ...(isDateRange(field) && { [DATA_MODE]: 'range' }),
  }
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
    return holdValue(field, effectiveValue)
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

/**
 * What a field holds for a value it is given, and the one door every value
 * comes in by: the host's, a `defaultValue`, what the user types, what a change
 * event writes and the rows assigned to a list.
 *
 * A date is held as `yyyy-MM-dd` whichever shape it arrived in, so everything
 * that reads the store -- a description's `{value}`, a `when`, the events the
 * field fires -- sees one shape. Text that is no day is held as it came: the
 * field shows what was typed and the schema says what is wrong with it,
 * instead of the field quietly going blank. Any other field holds its value
 * as it came.
 */
export function holdValue<T>(
  field: Field,
  value: T
): T | string | [string, string] {
  const format = dateFormatOf(field)
  if (!format) {
    return value
  }

  // A range holds `[from, to]`, each end the way a single day is held. Nothing
  // stays nothing: an empty range is not a pair of empty ends. And what is no
  // range stays as it came, for the schema to say what is wrong with it.
  if (isDateRange(field)) {
    const ends = value == null || value === '' ? undefined : toRange(value)
    if (!ends) {
      return value
    }

    const from = holdDay(ends[0], format)
    const to = holdDay(ends[1], format)

    // The field hands its value to the component on every render: a pair held
    // already comes back as the same array.
    return Array.isArray(value) && value[0] === from && value[1] === to
      ? value
      : [from, to]
  }

  return isString(value) ? holdDay(value, format) : value
}

function holdDay(text: string, format: DateFormat) {
  return toNativeDate(text, format) || text
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
  // A row shows a zone by its name: the list is grouped, which a preview
  // cannot look a label up in, so building it would be all cost.
  if (!isOptions(field) || isSelectTimezone(field)) {
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

// The format a field shows a day in, or `undefined` when it is not a date. What
// the component is told, what a value is read with on its way in, and what a
// row's preview shows its day in all ask here.
export function dateFormatOf(field?: Field): DateFormat | undefined {
  return field && isDate(field) ? getDateFormat(field) : undefined
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
