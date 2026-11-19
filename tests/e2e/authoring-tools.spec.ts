import { expect, test, type Page } from '@playwright/test'
import { inject } from './support/inject'

// The editor offered to an agent through WebMCP: reading the form it holds,
// replacing it, and reading the reference to write one. What `set_definition`
// answers has to be what the editor and its preview then show.

type Answer = Record<string, unknown>

type ModelContextTools = Readonly<{
  executeTool: (tool: object, input: object) => Promise<string | Answer>
  getTools: () => Promise<Array<Readonly<{ name: string }>>>
}>

async function toolNames(page: Page) {
  return page.evaluate(async () => {
    const modelContext = (
      document as Document & { modelContext: ModelContextTools }
    ).modelContext
    return (await modelContext.getTools()).map((tool) => tool.name).sort()
  })
}

// Calls a tool by its name, as an agent would. WebMCP hands the answer back as
// text in some versions and as an object in others.
async function call(page: Page, name: string, input: object): Promise<Answer> {
  const answer = await page.evaluate(
    async ({ name, input }) => {
      const modelContext = (
        document as Document & { modelContext: ModelContextTools }
      ).modelContext
      const tool = (await modelContext.getTools()).find(
        (each) => each.name === name
      )
      if (!tool) {
        throw new Error(`No tool named ${name}`)
      }
      return modelContext.executeTool(tool, input)
    },
    { input, name }
  )
  return typeof answer === 'string' ? JSON.parse(answer) : answer
}

const START = {
  sections: [
    { fields: [{ label: 'Title', name: 'title', type: 'input/text' }] },
  ],
}

const WRITTEN = {
  definition: {
    email: { label: 'Email', name: 'email', type: 'input/email' },
  },
  sections: [
    {
      fields: [
        { label: 'Name', name: 'name', type: 'input/text' },
        { $ref: '#/definition/email' },
      ],
    },
  ],
}

test.describe(
  'Authoring tools of the editor',
  { tag: ['@e2e', '@webmcp'] },
  () => {
    test.beforeEach(async ({ page }) => {
      await inject(page, JSON.stringify(START))
      await page.goto('/')
      expect(
        await page.evaluate(() => 'modelContext' in document),
        'This browser has no document.modelContext: run the chromium-webmcp project'
      ).toBe(true)
      await expect(page.locator('input[name="title"]')).toBeVisible()
    })

    test('should offer the editor tools beside the tools of its preview, which cannot submit', async ({
      page,
    }) => {
      await expect
        .poll(() => toolNames(page))
        .toEqual([
          'get_definition',
          'get_reference',
          'preview_fill',
          'preview_read',
          'set_definition',
        ])
    })

    test('should read the form the editor holds', async ({ page }) => {
      await expect.poll(() => toolNames(page)).toContain('get_definition')
      expect(await call(page, 'get_definition', {})).toEqual({
        definition: START,
        ok: true,
      })
    })

    test('should replace the form, which the editor and its preview then show, and fill it', async ({
      page,
    }) => {
      await expect.poll(() => toolNames(page)).toContain('set_definition')
      expect(await call(page, 'set_definition', WRITTEN)).toEqual({ ok: true })

      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('input[name="title"]')).toHaveCount(0)
      await expect(page.locator('.monaco-editor')).toContainText(
        '#/definition/email'
      )
      expect(await call(page, 'get_definition', {})).toEqual({
        definition: WRITTEN,
        ok: true,
      })

      // The preview's tools follow the form it now renders.
      await expect
        .poll(async () => {
          const answer = await call(page, 'preview_fill', { name: 'Ada' })
          return answer.applied
        })
        .toEqual(['name'])
      await expect(page.locator('input[name="name"]')).toHaveValue('Ada')
    })

    test('should not apply a form with problems, and say what and where', async ({
      page,
    }) => {
      await expect.poll(() => toolNames(page)).toContain('set_definition')
      const answer = await call(page, 'set_definition', {
        sections: [
          {
            fields: [
              { name: 'name', type: 'input/txt' },
              {
                event: {
                  change: [{ action: 'value', value: { nickname: '{value}' } }],
                },
                name: 'other',
                type: 'input/text',
              },
            ],
          },
        ],
      })
      expect(answer).toEqual({
        code: 'invalid',
        message: 'The form was not applied.',
        ok: false,
        problems: [
          {
            message:
              'No input is registered for the type "input/txt", so "name" would not render.',
            path: 'sections[0].fields[0]',
          },
          {
            message: 'The event targets "nickname", which no field is.',
            path: 'sections[0].fields[1].event.change[0]',
          },
        ],
      })
      await expect(page.locator('input[name="title"]')).toBeVisible()
      expect(await call(page, 'get_definition', {})).toEqual({
        definition: START,
        ok: true,
      })
    })

    test('should read the reference, from its index, and only its pages', async ({
      page,
    }) => {
      await expect.poll(() => toolNames(page)).toContain('get_reference')

      const index = await call(page, 'get_reference', {})
      expect(index).toMatchObject({ ok: true, page: 'index.md' })
      expect(index.content).toContain('fields/select.md')

      const select = await call(page, 'get_reference', {
        page: 'fields/select.md',
      })
      expect(select).toMatchObject({ ok: true, page: 'fields/select.md' })

      for (const page_ of ['fields/nothing.md', '../package.json']) {
        const unknown = await call(page, 'get_reference', { page: page_ })
        expect(unknown).toMatchObject({ code: 'unknown', ok: false })
        expect(unknown.pages).toContain('fields/select.md')
      }
    })
  }
)
