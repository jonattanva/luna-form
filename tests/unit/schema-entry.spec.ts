import {
  buildFormSchema,
  collectIssues,
} from '@/packages/luna-react/src/schema'
import { describe, expect, test } from 'vitest'
import type { Sections } from '@/packages/luna-react/src/schema'

// The server-safe `react-luna-form/schema` entry must expose the headless
// builder without dragging in React. This exercises the re-export end to end.
describe('react-luna-form/schema entry', () => {
  test('re-exports a working buildFormSchema + collectIssues', () => {
    const sections: Sections = [
      {
        fields: [
          {
            name: 'url',
            type: 'input',
            required: true,
            validation: { required: 'URL is required' },
          },
        ],
      },
    ]

    const schema = buildFormSchema(sections)

    expect(schema.safeParse({ url: 'https://example.com' }).success).toBe(true)

    const result = schema.safeParse({ url: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(collectIssues(result.error)).toContainEqual({
        path: 'url',
        message: 'URL is required',
      })
    }
  })
})
