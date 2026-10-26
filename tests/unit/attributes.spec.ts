import { describe, expect, test } from 'vitest'
import {
  buildAriaAttributes,
  getDataAttributes,
  getAriaAttributes,
} from '@/packages/luna-core/src/util/attributes'
import type { Field } from '@/packages/luna-core/src/type'

describe('Get aria and data attributes', () => {
  test('should return empty object when no aria attributes are provided', () => {
    expect(getAriaAttributes({})).toEqual({})
  })

  test('should convert aria attributes correctly', () => {
    const props = {
      advanced: {
        aria: {
          label: 'Label',
          hidden: true,
          describedby: 'description-id',
        },
      },
    }
    expect(getAriaAttributes(props.advanced.aria)).toEqual({
      'aria-label': 'Label',
      'aria-hidden': true,
      'aria-describedby': 'description-id',
    })
  })

  test('should return empty object when no data attributes are provided', () => {
    expect(getDataAttributes({})).toEqual({})
  })

  test('should convert data attributes correctly', () => {
    const props = {
      advanced: {
        data: {
          testId: 'button-1',
          role: 'admin',
        },
      },
    }

    expect(getDataAttributes(props.advanced.data)).toEqual({
      'data-testId': 'button-1',
      'data-role': 'admin',
    })
  })

  test('should point a labelled field at its label', () => {
    const field: Field = { label: 'Priority', name: 'priority', type: 'chips' }

    expect(buildAriaAttributes(field)).toEqual({
      'aria-labelledby': 'priority-label',
    })
  })

  test('should point at no label when the field renders none', () => {
    expect(buildAriaAttributes({ name: 'priority', type: 'chips' })).toEqual({})
    expect(buildAriaAttributes({ label: 'Priority', type: 'chips' })).toEqual(
      {}
    )
  })

  test('should leave the name to advanced.aria when it gives one', () => {
    const labelled: Field = {
      advanced: { aria: { label: 'How urgent' } },
      label: 'Priority',
      name: 'priority',
      type: 'chips',
    }
    const labelledBy: Field = {
      advanced: { aria: { labelledby: 'heading' } },
      label: 'Priority',
      name: 'priority',
      type: 'chips',
    }

    expect(buildAriaAttributes(labelled)).toEqual({
      'aria-label': 'How urgent',
    })
    expect(buildAriaAttributes(labelledBy)).toEqual({
      'aria-labelledby': 'heading',
    })
  })
})
