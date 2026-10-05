import { describe, expect, test } from 'vitest'
import {
  getDateFormat,
  readDateProps,
} from '@/packages/luna-core/src/util/date'
import type { Date as DateField } from '@/packages/luna-core/src/type'

describe('getDateFormat', () => {
  test('should return default MMMM d, yyyy when field has no advanced property', () => {
    const field: DateField = { name: 'dob', type: 'date' }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return default MMMM d, yyyy when advanced has no format', () => {
    const field: DateField = { name: 'dob', type: 'date', advanced: {} }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return MMMM d, yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'MMMM d, yyyy' },
    }
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })

  test('should return MM/dd/yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'MM/dd/yyyy' },
    }
    expect(getDateFormat(field)).toBe('MM/dd/yyyy')
  })

  test('should return dd/MM/yyyy when set', () => {
    const field: DateField = {
      name: 'dob',
      type: 'date',
      advanced: { format: 'dd/MM/yyyy' },
    }
    expect(getDateFormat(field)).toBe('dd/MM/yyyy')
  })

  // Regression: a format the form does not know reached date-fns as written,
  // and `DD/MM/YYYY` threw a RangeError from inside a list's preview. A form
  // is JSON, so the type does not stop one from arriving.
  test('should return the default for a format the form does not know', () => {
    const field = JSON.parse(
      '{"name":"dob","type":"input/date","advanced":{"format":"DD/MM/YYYY"}}'
    ) as DateField
    expect(getDateFormat(field)).toBe('MMMM d, yyyy')
  })
})

// The other half of what a date field puts on its component: an adapter reads
// it back through this rather than parsing attributes of its own.
describe('readDateProps', () => {
  test('should read the format the field put on its props', () => {
    expect(readDateProps({ 'data-format': 'dd/MM/yyyy' })).toEqual({
      format: 'dd/MM/yyyy',
      lang: 'en',
      mode: 'single',
      reserved: [],
    })
  })

  test('should fall back to the default format when there is none', () => {
    expect(readDateProps({})).toEqual({
      format: 'MMMM d, yyyy',
      lang: 'en',
      mode: 'single',
      reserved: [],
    })
  })

  test('should fall back to the default format for one the form does not know', () => {
    expect(readDateProps({ 'data-format': 'DD/MM/YYYY' })).toEqual({
      format: 'MMMM d, yyyy',
      lang: 'en',
      mode: 'single',
      reserved: [],
    })
  })

  test('should read the bounds the field put on its props', () => {
    expect(
      readDateProps({
        'data-format': 'dd/MM/yyyy',
        max: '2026-10-20',
        min: '2026-10-05',
      })
    ).toEqual({
      format: 'dd/MM/yyyy',
      max: '2026-10-20',
      min: '2026-10-05',
      lang: 'en',
      mode: 'single',
      reserved: [],
    })
  })

  test('should read no bound that is no yyyy-MM-dd day', () => {
    expect(readDateProps({ max: '2026-02-30', min: '05/10/2026' })).toEqual({
      format: 'MMMM d, yyyy',
      lang: 'en',
      mode: 'single',
      reserved: [],
    })
  })

  test('should read the reserved days as a list', () => {
    expect(
      readDateProps({ 'data-reserved': '2026-12-24,2026-12-25' }).reserved
    ).toEqual(['2026-12-24', '2026-12-25'])
  })

  test('should read the range mode the field put on its props', () => {
    expect(readDateProps({ 'data-mode': 'range' }).mode).toBe('range')
    expect(readDateProps({ 'data-mode': 'multiple' }).mode).toBe('single')
  })

  // A component renders on every keystroke, and the list it is handed is the
  // same text each time: it is read once, and comes back as the same array, so
  // a component can memoize on it.
  test('should hand back the same list for the same reserved days', () => {
    const props = { 'data-reserved': '2026-12-24,2026-12-25' }
    expect(readDateProps(props).reserved).toBe(readDateProps(props).reserved)
  })

  // Several date fields render on one page, and each keeps getting its own
  // array back while its days stay the same.
  test('should hand each field back its list whatever others read between', () => {
    const night = { 'data-reserved': '2026-12-24,2026-12-25' }
    const stay = { 'data-reserved': '2026-11-01' }

    const first = readDateProps(night).reserved
    readDateProps(stay)

    expect(readDateProps(night).reserved).toBe(first)
  })

  test('should drop from the reserved days what is no yyyy-MM-dd day', () => {
    expect(
      readDateProps({ 'data-reserved': '2026-12-24,24/12/2026,,2026-02-30' })
        .reserved
    ).toEqual(['2026-12-24'])
  })

  // The language a calendar names its months and days in: the form's, as the
  // standard `lang` attribute, and English without one.
  test('should read the language the field put on its props', () => {
    expect(readDateProps({ lang: 'es-CO' }).lang).toBe('es-CO')
    expect(readDateProps({}).lang).toBe('en')
  })
})
