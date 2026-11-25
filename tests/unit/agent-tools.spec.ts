import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  createFormTools,
  createQueue,
  type AgentOptions,
  type FieldStatus,
  type FormToolsHost,
  type SubmitStatus,
  type Tool,
  type ToolJson,
  type ToolResult,
  type ToolRow,
  type ToolValue,
} from '@/packages/luna-react/src/client/lib/agent-tools'
import {
  buildToolSchema,
  type ToolSchema,
} from '@/packages/luna-core/src/util/tool-schema'
import { isField, isList } from '@/packages/luna-core/src/util/is-input'
import type { Field, Fields, Option } from '@/packages/luna-core/src/type'

const COUNTRIES: Option[] = [
  { label: 'Colombia', value: 'co' },
  { label: 'México', value: 'mx' },
  { label: 'Perú', value: 'pe' },
]

const PLANS: Option[] = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
]

const FREQUENCIES: Option[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

// Two options that read the same once case and accents are set aside.
const SIZES: Option[] = [
  { label: 'Grande', value: 'g' },
  { label: 'grande', value: 'xg' },
  { label: 'Small', value: 's' },
]

const ZONES: Option[] = Array.from({ length: 60 }, (_, index) => ({
  label: `Zone ${index}`,
  value: `Zone/${index}`,
}))

const FIELDS: Fields = [
  { label: 'Email', name: 'email', type: 'input/email' },
  { name: 'country', source: COUNTRIES, type: 'select' },
  {
    event: {
      change: [
        {
          action: 'state',
          state: { hidden: false },
          target: 'frequency',
          when: 'pro',
        },
      ],
    },
    name: 'plan',
    source: PLANS,
    type: 'radio',
  },
  { hidden: true, name: 'frequency', source: FREQUENCIES, type: 'select' },
  { name: 'size', source: SIZES, type: 'select' },
  { name: 'zone', type: 'select/timezone' },
  { name: 'age', type: 'input/number' },
  { name: 'month', type: 'select/month' },
  { name: 'active', type: 'select/active' },
  { name: 'agree', type: 'checkbox' },
  { name: 'birthday', type: 'input/date' },
  { name: 'start', type: 'input/time' },
  { advanced: { mode: 'range' }, name: 'stay', type: 'input/date' },
  { name: 'tags', source: COUNTRIES, type: 'chips' },
  { name: 'secret', type: 'input/password' },
  { advanced: { agent: false }, name: 'document', type: 'input/text' },
  {
    advanced: { length: { max: 2 } },
    fields: [
      { name: 'sku', type: 'input/text' },
      { name: 'qty', type: 'input/number' },
      { name: 'zone', type: 'select/timezone' },
    ],
    name: 'items',
    type: 'list',
  },
]

const AGENT: AgentOptions = {
  description: 'Signs a person up.',
  name: 'signup',
  submit: true,
}

type Setup = Readonly<{
  // Fields not on the form until a value shows them.
  absent?: readonly string[]
  // Fields a person changed since the agent last read the form.
  changed?: readonly string[]
  // How many rounds the page takes to draw a field a value shows or unlocks,
  // while the form already holds that it does.
  drawing?: Readonly<Record<string, number>>
  locked?: readonly string[]
  // Fields that do not take their first value: they have just appeared.
  notReady?: readonly string[]
  // Fields that never take a value, shown and unlocked as they are.
  refuses?: readonly string[]
  // Fields whose options are still on their way.
  unloaded?: readonly string[]
  // Fields with a request out for their options, until they arrive.
  fetching?: readonly string[]
  // A locked field that another one unlocks when it holds a value.
  unlocks?: Readonly<Record<string, Readonly<{ target: string; when: string }>>>
  // What a field's value writes into another one, as a `value` event does.
  fills?: Readonly<Record<string, (value: ToolValue) => [string, ToolValue]>>
  // A field that is not on the form until another one holds a value.
  shows?: Readonly<Record<string, Readonly<{ target: string; when: string }>>>
  // Validation, by field: a message when the value is wrong.
  rules?: Readonly<Record<string, (value: ToolValue) => string | undefined>>
  submit?: (signal: AbortSignal) => Promise<SubmitStatus>
  values?: Readonly<Record<string, ToolValue>>
}>

// A form in memory, keeping to what the host promises: a write that a value
// shows another field for is seen once the form settles.
function createForm(setup: Setup = {}) {
  const definitions = new Map<string, Field>()
  for (const slot of FIELDS) {
    if (isList(slot)) {
      for (const leaf of slot.fields.filter(isField)) {
        definitions.set(`${slot.name}.0.${leaf.name}`, leaf)
      }
    } else if (isField(slot)) {
      definitions.set(slot.name, slot)
    }
  }

  const options = new Map<string, readonly Option[]>([
    ['country', COUNTRIES],
    ['plan', PLANS],
    ['frequency', FREQUENCIES],
    ['size', SIZES],
    ['zone', ZONES],
    ['tags', COUNTRIES],
    ['items.0.zone', ZONES],
  ])
  for (const name of setup.unloaded ?? []) {
    options.delete(name)
  }

  const absent = new Set(setup.absent ?? ['frequency'])
  const locked = new Set(setup.locked)
  const notReady = new Set(setup.notReady)
  // A field being drawn: the rounds left, and what it is once drawn.
  const drawing = new Map<
    string,
    Readonly<{ done: () => void; left: number }>
  >()
  const draw = (target: string, done: () => void) => {
    const left = setup.drawing?.[target]
    if (left) {
      drawing.set(target, { done, left })
    } else {
      done()
    }
  }
  const values = new Map<string, ToolValue>(Object.entries(setup.values ?? {}))
  const changed = new Set(setup.changed)
  const errors: Record<string, string[]> = {}
  const effects: Array<() => void> = []
  let submitted: SubmitStatus = { status: 'idle' }
  // What was submitted before a person was asked about the next one.
  let before = submitted

  const calls = {
    apply: [] as Array<[string, ToolValue, object | undefined]>,
    filled: [] as Array<readonly string[]>,
    rows: [] as Array<[string, readonly ToolRow[]]>,
    settle: 0,
    using: [] as boolean[],
    validate: [] as Array<readonly string[]>,
  }

  // A row's leaf by its route, `items.1.sku`: the rows are the list's own
  // value here, and the route is the name the form gives the leaf.
  const leafOf = (name: string) => {
    const match = /^items\.(\d+)\.(\w+)$/.exec(name)
    const rows = values.get('items')
    return match && Array.isArray(rows) && Number(match[1]) < rows.length
      ? { index: Number(match[1]), leaf: match[2], rows: rows as ToolRow[] }
      : undefined
  }

  const write = (name: string, value: ToolValue) => {
    const leaf = leafOf(name)
    if (leaf) {
      values.set(
        'items',
        leaf.rows.map((row, index) =>
          index === leaf.index ? { ...row, [leaf.leaf]: value } : row
        )
      )
      return
    }

    values.set(name, value)
    const fill = setup.fills?.[name]
    const show =
      setup.shows?.[name] ??
      (name === 'plan' ? { target: 'frequency', when: 'pro' } : undefined)
    const unlock = setup.unlocks?.[name]

    effects.push(() => {
      if (fill) {
        const [target, filled] = fill(value)
        values.set(target, filled)
      }
      if (show) {
        if (value === show.when) {
          draw(show.target, () => absent.delete(show.target))
        } else {
          drawing.delete(show.target)
          absent.add(show.target)
        }
      }
      if (unlock && value === unlock.when) {
        draw(unlock.target, () => locked.delete(unlock.target))
      }
    })
  }

  const host: FormToolsHost = {
    apply: (name, value, applyOptions) => {
      calls.apply.push([name, value, applyOptions])
      if (
        locked.has(name) ||
        notReady.delete(name) ||
        setup.refuses?.includes(name)
      ) {
        return false
      }
      write(name, value)
      return true
    },
    applyRows: (name, rows) => {
      calls.rows.push([name, rows])
      write(name, rows.slice(0, 2))
      return true
    },
    filled: (names) => {
      calls.filled.push(names)
    },
    getErrors: () => errors,
    getField: (name) => definitions.get(name),
    getOptions: (path, name) => options.get(name ?? path),
    getStatus: (name): FieldStatus | undefined =>
      absent.has(name)
        ? undefined
        : {
            fetching:
              setup.fetching?.includes(name) === true && !options.has(name),
            hidden: false,
            locked: locked.has(name),
          },
    approval: (approval) => {
      if (approval?.status === 'awaiting_approval') {
        before = submitted
      }
      if (approval) {
        submitted = approval
      } else if (submitted.status === 'awaiting_approval') {
        submitted = before
      }
    },
    getSubmit: () => submitted,
    isChanged: (name) => changed.has(name),
    isDrawing: (name) => drawing.has(name),
    locate: (name) => name,
    read: (name) => values.get(name),
    resolve: (route) => (leafOf(route) ? route : undefined),
    seen: (names) => {
      for (const name of names) {
        changed.delete(name)
      }
    },
    settle: async () => {
      calls.settle++
      for (const [name, { done, left }] of drawing) {
        if (left > 1) {
          drawing.set(name, { done, left: left - 1 })
        } else {
          drawing.delete(name)
          done()
        }
      }
      for (const effect of effects.splice(0)) {
        effect()
      }
    },
    using: (active) => {
      calls.using.push(active)
    },
    submit: async (signal) => {
      submitted = { status: 'pending' }
      submitted = await (setup.submit?.(signal) ??
        Promise.resolve<SubmitStatus>({ data: {}, status: 'success' }))
      return submitted
    },
    validate: (names) => {
      calls.validate.push(names)
      const found: Record<string, string[]> = {}
      for (const name of names) {
        const message = setup.rules?.[name]?.(values.get(name) ?? null)
        found[name] = message ? [message] : []
        if (message) {
          errors[name] = [message]
        } else {
          delete errors[name]
        }
      }
      return found
    },
  }

  return { calls, host, options, values }
}

function toolsOf(
  setup: Setup = {},
  agent: AgentOptions = AGENT,
  signal?: AbortSignal
) {
  const form = createForm(setup)
  const tools = createFormTools(
    agent,
    buildToolSchema([{ fields: FIELDS }]),
    form.host,
    { signal }
  )
  return { ...form, tools }
}

function toolNamed(tools: readonly Tool[], suffix: string): Tool {
  const tool = tools.find((candidate) => candidate.name.endsWith(`_${suffix}`))
  if (!tool) {
    throw new Error(`No ${suffix} tool`)
  }
  return tool
}

// Calls a tool and checks the answer against the tool's output schema, so
// every test is a contract test too.
async function call(
  tools: readonly Tool[],
  suffix: string,
  input: ToolJson = {},
  signal?: AbortSignal
): Promise<ToolResult> {
  const tool = toolNamed(tools, suffix)
  const result = await tool.execute(input, { signal })
  expect(violations(tool.outputSchema, result, tool.name)).toEqual([])
  return result
}

// Where a value breaks the part of JSON Schema a tool's schemas use.
function violations(schema: ToolSchema, value: ToolJson, at: string): string[] {
  const found: string[] = []
  const typed: Record<ToolSchema['type'], boolean> = {
    array: Array.isArray(value),
    boolean: typeof value === 'boolean',
    integer: Number.isInteger(value),
    number: typeof value === 'number',
    object:
      typeof value === 'object' && value !== null && !Array.isArray(value),
    string: typeof value === 'string',
  }

  if (!typed[schema.type]) {
    return [`${at} is not ${schema.type}`]
  }
  if (schema.enum && !schema.enum.includes(value as string)) {
    found.push(`${at} is not one of ${schema.enum.join(', ')}`)
  }
  if (
    schema.minimum !== undefined &&
    typeof value === 'number' &&
    value < schema.minimum
  ) {
    found.push(`${at} is under ${schema.minimum}`)
  }
  if (Array.isArray(value) && schema.items) {
    const items = schema.items
    value.forEach((item: ToolJson, index: number) =>
      found.push(...violations(items, item, `${at}[${index}]`))
    )
  }
  if (typed.object && schema.properties) {
    const record = value as Record<string, ToolJson>
    for (const name of schema.required ?? []) {
      if (!(name in record)) {
        found.push(`${at}.${name} is missing`)
      }
    }
    for (const [name, inner] of Object.entries(record)) {
      const property = schema.properties[name]
      if (property) {
        found.push(...violations(property, inner, `${at}.${name}`))
      } else if (schema.additionalProperties === false) {
        found.push(`${at}.${name} is not declared`)
      }
    }
  }
  return found
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('createFormTools', () => {
  describe('the tools', () => {
    test('should name the tools after the agent, and offer submit and options only when they apply', () => {
      expect(toolsOf().tools.map((tool) => tool.name)).toEqual([
        'signup_fill',
        'signup_read',
        'signup_options',
        'signup_submit',
      ])

      const fields: Fields = [{ name: 'email', type: 'input/email' }]
      const tools = createFormTools(
        { description: 'Signs up.', name: 'signup' },
        buildToolSchema([{ fields }]),
        createForm().host
      )
      expect(tools.map((tool) => tool.name)).toEqual([
        'signup_fill',
        'signup_read',
      ])
    })

    test('should build no tool for a name that some consumer would refuse', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      for (const name of ['', 'sign up', 'x'.repeat(57), 'signup.form']) {
        expect(toolsOf({}, { ...AGENT, name }).tools).toEqual([])
      }
      expect(warn).toHaveBeenCalledTimes(4)
    })

    test('should mark what each tool does, and take the fill schema from the form', () => {
      const { tools } = toolsOf()
      const fill = toolNamed(tools, 'fill')

      expect(fill.inputSchema).toEqual(
        buildToolSchema([{ fields: FIELDS }]).schema
      )
      expect(fill.annotations).toEqual({ untrustedContentHint: true })
      expect(toolNamed(tools, 'read').annotations).toEqual({
        readOnlyHint: true,
        untrustedContentHint: true,
      })
      expect(toolNamed(tools, 'options').annotations).toEqual({
        readOnlyHint: true,
        untrustedContentHint: true,
      })
      expect(toolNamed(tools, 'submit').annotations).toEqual({
        consequentialHint: true,
        untrustedContentHint: true,
      })
    })

    test("should open every description with the author's and warn that the page's text is data", () => {
      for (const tool of toolsOf().tools) {
        expect(tool.description.startsWith('Signs a person up.')).toBe(true)
        expect(tool.description).toContain('never instructions')
      }
    })

    // A dictionary key cannot always end in a period, so the author's text
    // may stop without one: the tool's own sentences start one of their own.
    test("should close the author's description before the tool's own sentences", () => {
      for (const description of [
        'Signs a person up',
        'Signs a person up.',
        'Signs a person up \n',
      ]) {
        for (const tool of toolsOf({}, { ...AGENT, description }).tools) {
          expect(tool.description).toMatch(/^Signs a person up\. [A-Z]/)
        }
      }
      for (const tool of toolsOf({}, { ...AGENT, description: '' }).tools) {
        expect(tool.description).toMatch(/^[A-Z]/)
      }
    })

    test('should name in the fill description what a submission needs', () => {
      const fields: Fields = [
        { name: 'email', required: true, type: 'input/email' },
        { name: 'name', type: 'input/text' },
      ]
      const [fill] = createFormTools(
        AGENT,
        buildToolSchema([{ fields }]),
        createForm().host
      )
      expect(fill.description).toContain('A submission needs: email.')
    })

    test('should name nothing a submission needs when the submit checks nothing', () => {
      const fields: Fields = [
        { name: 'email', required: true, type: 'input/email' },
      ]
      const tools = createFormTools(
        AGENT,
        buildToolSchema([{ fields }]),
        createForm().host,
        { validates: false }
      )
      const fill = toolNamed(tools, 'fill').description
      expect(fill).not.toContain('A submission needs')
      expect(fill).not.toContain('No field is needed')
      expect(toolNamed(tools, 'submit').description).toContain(
        'the values are sent unchecked'
      )
    })

    // An agent told of a submission looks for a way to send it.
    describe('a form the tools cannot submit', () => {
      const NO_SUBMIT: AgentOptions = {
        allow: () => true,
        description: 'Signs a person up.',
        name: 'signup',
      }

      test('should not speak of a submission in any description', () => {
        for (const tool of toolsOf({}, NO_SUBMIT).tools) {
          expect(tool.description).not.toMatch(/submi/i)
        }
      })

      // The notes of a field's rules are the form's, read with or without a
      // submit tool.
      test('should not speak of a submit in the notes of the fields', () => {
        const fields: Fields = JSON.parse(`[
          {
            "name": "vat",
            "type": "input/text",
            "validation": {
              "pattern": { "flags": "i", "regex": "^[a-z]{3}$" },
              "rules": [{ "assert": "minItems", "message": "Too few.", "value": 2 }]
            }
          },
          { "advanced": { "length": { "min": "x" } }, "name": "code", "type": "input/text" }
        ]`)
        const [fill] = createFormTools(
          NO_SUBMIT,
          buildToolSchema([{ fields }]),
          createForm().host
        )
        expect(JSON.stringify(fill.inputSchema)).not.toMatch(/submi/i)
      })

      test('should name in the fill description the fields required', () => {
        const fields: Fields = [
          { name: 'email', required: true, type: 'input/email' },
          { name: 'name', required: true, type: 'input/text' },
        ]
        const [fill] = createFormTools(
          NO_SUBMIT,
          buildToolSchema([{ fields }]),
          createForm().host
        )
        expect(fill.description).toContain('Required fields: email, name.')

        const [none] = createFormTools(
          NO_SUBMIT,
          buildToolSchema([{ fields: [{ name: 'name', type: 'input/text' }] }]),
          createForm().host
        )
        expect(none.description).toContain('No field is required.')

        const [unchecked] = createFormTools(
          NO_SUBMIT,
          buildToolSchema([{ fields }]),
          createForm().host,
          { validates: false }
        )
        expect(unchecked.description).not.toMatch(/required/i)
      })

      test('should read no submission, nor declare one', async () => {
        const { tools } = toolsOf({}, NO_SUBMIT)
        const read = toolNamed(tools, 'read')

        expect(await call(tools, 'read', { fields: ['email'] })).toEqual({
          errors: {},
          hidden: [],
          locked: [],
          values: { email: null },
        })
        expect(read.outputSchema.properties).not.toHaveProperty('submit')
      })

      test('should still speak of the submission, and read it, when the tools submit', async () => {
        const { tools } = toolsOf()
        const read = toolNamed(tools, 'read')

        expect(read.description).toContain(
          'values, hidden or locked fields, errors and the last submission.'
        )
        expect(read.description).toContain(
          'and after signup_submit answered pending;'
        )
        expect(read.outputSchema.properties).toHaveProperty('submit')
        expect(await call(tools, 'read', { fields: ['email'] })).toMatchObject({
          submit: { status: 'idle' },
        })
      })
    })
  })

  describe('fill', () => {
    test('should write each field through its own change, and validate them once at the end', async () => {
      const { calls, tools } = toolsOf()
      const result = await call(tools, 'fill', {
        country: 'mx',
        email: 'ada@example.com',
      })

      expect(calls.apply).toEqual([
        ['email', 'ada@example.com', { immediate: true, validate: false }],
        ['country', 'mx', { immediate: true, validate: false }],
      ])
      expect(calls.validate).toEqual([['email', 'country']])
      expect(result).toEqual({
        adjusted: [],
        applied: ['email', 'country'],
        errors: {},
        ok: true,
        revealed: [],
        skipped: [],
        values: { country: 'mx', email: 'ada@example.com' },
      })
    })

    test('should show the person what it filled, and that a call is running', async () => {
      const { calls, tools } = toolsOf({
        changed: ['country'],
        fills: { email: () => ['age', '30'] },
        values: { country: 'co' },
      })
      await call(tools, 'fill', { country: 'mx', email: 'ada@example.com' })

      expect(calls.filled).toEqual([['email', 'age']])
      expect(calls.using).toEqual([true, false])
    })

    test('should not write over what someone else changed, and say what it holds', async () => {
      const { calls, tools } = toolsOf({
        changed: ['email'],
        values: { email: 'person@example.com' },
      })
      const result = await call(tools, 'fill', {
        country: 'mx',
        email: 'agent@example.com',
      })

      expect(calls.apply).toEqual([
        ['country', 'mx', { immediate: true, validate: false }],
      ])
      expect(result).toMatchObject({
        applied: ['country'],
        ok: false,
        skipped: [{ code: 'changed', name: 'email' }],
        values: { country: 'mx', email: 'person@example.com' },
      })

      // Told what it holds, the agent may write over it.
      const again = await call(tools, 'fill', { email: 'agent@example.com' })
      expect(again).toMatchObject({ applied: ['email'], ok: true })
    })

    test('should write what a person changed when it already holds the value sent', async () => {
      const { tools } = toolsOf({
        changed: ['email'],
        values: { email: 'ada@example.com' },
      })

      expect(
        await call(tools, 'fill', { email: 'ada@example.com' })
      ).toMatchObject({ applied: ['email'], ok: true, skipped: [] })
    })

    test('should report what a value event filled in, and only what changed', async () => {
      const { tools } = toolsOf({
        fills: { email: () => ['country', 'co'] },
        values: { age: '30', email: 'ada@example.com' },
      })
      const result = await call(tools, 'fill', { email: 'ada@example.com' })

      expect(result.values).toEqual({ country: 'co' })
    })

    test('should write a field another value shows in the next round', async () => {
      const { calls, tools } = toolsOf()
      const result = await call(tools, 'fill', {
        frequency: 'weekly',
        plan: 'pro',
      })

      expect(calls.apply.map(([name]) => name)).toEqual(['plan', 'frequency'])
      expect(result.applied).toEqual(['plan', 'frequency'])
      expect(result.revealed).toEqual(['frequency'])
      expect(result.ok).toBe(true)
    })

    test('should wait for the page to draw a field the form already shows', async () => {
      const { tools } = toolsOf({ drawing: { frequency: 8 } })
      const result = await call(tools, 'fill', {
        frequency: 'weekly',
        plan: 'pro',
      })

      expect(result.applied).toEqual(['plan', 'frequency'])
      expect(result.skipped).toEqual([])
      expect(result.ok).toBe(true)
    })

    test('should wait for the page to draw a field the form already unlocks', async () => {
      const { tools } = toolsOf({
        drawing: { email: 8 },
        locked: ['email'],
        unlocks: { country: { target: 'email', when: 'co' } },
      })
      const result = await call(tools, 'fill', {
        country: 'co',
        email: 'ada@example.com',
      })

      expect(result.applied).toEqual(['country', 'email'])
      expect(result.skipped).toEqual([])
    })

    test('should wait for a field being drawn while another keeps refusing its value', async () => {
      const { tools } = toolsOf({
        drawing: { frequency: 8 },
        refuses: ['email'],
      })
      const result = await call(tools, 'fill', {
        email: 'ada@example.com',
        frequency: 'weekly',
        plan: 'pro',
      })

      expect(result.applied).toEqual(['plan', 'frequency'])
      expect(result.skipped).toMatchObject([{ code: 'locked', name: 'email' }])
    })

    test('should stop waiting for a field the page does not draw', async () => {
      const { calls, tools } = toolsOf({ drawing: { frequency: 1_000 } })
      const result = await call(tools, 'fill', {
        frequency: 'weekly',
        plan: 'pro',
      })

      expect(result.applied).toEqual(['plan'])
      expect(result.skipped).toMatchObject([
        { code: 'hidden', name: 'frequency' },
      ])
      // The round that wrote `plan`, and forty rounds of waiting.
      expect(calls.settle).toBe(41)
    })

    test('should skip as hidden a field nothing shows, without failing the call', async () => {
      const { tools } = toolsOf()
      const result = await call(tools, 'fill', {
        frequency: 'weekly',
        plan: 'free',
      })

      expect(result.applied).toEqual(['plan'])
      expect(result.skipped).toEqual([
        {
          code: 'hidden',
          message: 'The field is not on the form: some other value shows it.',
          name: 'frequency',
        },
      ])
      expect(result.ok).toBe(true)
    })

    test('should skip a locked field without failing the call', async () => {
      const { calls, tools } = toolsOf({ locked: ['email'] })
      const result = await call(tools, 'fill', {
        country: 'co',
        email: 'ada@example.com',
      })

      expect(calls.apply.map(([name]) => name)).toEqual(['country'])
      expect(result.skipped).toEqual([
        {
          code: 'locked',
          message: 'The field is disabled or read-only.',
          name: 'email',
        },
      ])
      expect(result.ok).toBe(true)
    })

    test('should write a field another value unlocks in the next round', async () => {
      const { calls, tools } = toolsOf({
        locked: ['country'],
        unlocks: { email: { target: 'country', when: 'ada@example.com' } },
      })
      const result = await call(tools, 'fill', {
        country: 'co',
        email: 'ada@example.com',
      })

      expect(calls.apply.map(([name]) => name)).toEqual(['email', 'country'])
      expect(result.applied).toEqual(['email', 'country'])
      expect(result.skipped).toEqual([])
    })

    test('should try again a field that has not taken its place yet, and not call it locked', async () => {
      const { calls, tools } = toolsOf({ notReady: ['country'] })
      const result = await call(tools, 'fill', { country: 'co' })

      expect(calls.apply.map(([name]) => name)).toEqual(['country', 'country'])
      expect(result.applied).toEqual(['country'])
      expect(result.skipped).toEqual([])
    })

    test('should answer a field left out of the tools as one that does not exist', async () => {
      const { calls, tools } = toolsOf()
      const result = await call(tools, 'fill', {
        document: '123',
        nothing: 'x',
        secret: 'hunter2',
        toString: 'x',
      })

      expect(calls.apply).toEqual([])
      expect(result.skipped).toEqual(
        ['document', 'nothing', 'secret', 'toString'].map((name) => ({
          code: 'unknown',
          message: 'No field so named.',
          name,
        }))
      )
      expect(result.ok).toBe(false)
    })

    test('should return the errors of the fields it wrote, and fail on them', async () => {
      const { tools } = toolsOf({
        rules: { email: () => 'Invalid email address' },
      })
      const result = await call(tools, 'fill', { email: 'ada@example' })

      expect(result.errors).toEqual({ email: ['Invalid email address'] })
      expect(result.ok).toBe(false)
    })

    test('should refuse an input that is not an object of values', async () => {
      const { tools } = toolsOf()
      for (const input of [null, 'email', ['email']]) {
        expect(await call(tools, 'fill', input)).toEqual({
          code: 'invalid_type',
          message: 'Pass an object of values keyed by field name.',
          ok: false,
        })
      }
    })

    describe('options', () => {
      test('should take an option by its label or value in any case and without accents', async () => {
        const { calls, tools } = toolsOf()
        await call(tools, 'fill', {
          country: 'MEXICO',
          plan: 'Pro',
          tags: ['perú', 'co'],
        })

        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['country', 'mx'],
          ['plan', 'pro'],
          ['tags', ['pe', 'co']],
        ])
      })

      test('should name the options a label could mean when it reads as more than one', async () => {
        const { tools } = toolsOf()
        const result = await call(tools, 'fill', { size: 'GRANDE' })

        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message:
              '"GRANDE" names more than one option: g (Grande), xg (grande).',
            name: 'size',
          },
        ])
      })

      test('should list the options when the value is none of them, and point to the search past 25', async () => {
        const { tools } = toolsOf()
        const result = await call(tools, 'fill', {
          country: 'Chile',
          zone: 'Mars/Olympus',
        })

        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message:
              'No option "Chile". Options: co (Colombia), mx (México), pe (Perú).',
            name: 'country',
          },
          {
            code: 'invalid_option',
            message: 'No option "Mars/Olympus". Find them with signup_options.',
            name: 'zone',
          },
        ])
        expect(result.ok).toBe(false)
      })

      test('should refuse an option while the options are not loaded', async () => {
        const { calls, tools } = toolsOf({ unloaded: ['zone'] })
        const result = await call(tools, 'fill', { zone: 'Narnia/Cair' })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message:
              'Its options are not loaded yet: fill the fields it depends on first, then find them with signup_options.',
            name: 'zone',
          },
        ])
      })

      test('should refuse an option chosen twice, or more than a field takes', async () => {
        const { tools } = toolsOf()
        const result = await call(tools, 'fill', { tags: ['co', 'Colombia'] })

        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message: '"co" more than once.',
            name: 'tags',
          },
        ])
      })
    })

    describe('types and formats', () => {
      test('should hand each value over the way its control does', async () => {
        const { calls, tools } = toolsOf()
        await call(tools, 'fill', {
          active: false,
          age: '42',
          agree: true,
          birthday: '1906-12-09',
          month: 3,
          start: '09:30',
        })

        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['age', '42'],
          ['month', '3'],
          ['active', 'false'],
          ['agree', true],
          ['birthday', '1906-12-09'],
          ['start', '09:30'],
        ])
      })

      test('should skip a value of the wrong type or format, saying what it expected', async () => {
        const { calls, tools } = toolsOf()
        const result = await call(tools, 'fill', {
          age: 'forty',
          agree: 'yes',
          birthday: '1906-02-30',
          email: 42,
          month: 13,
          start: '9:30',
        })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          { code: 'invalid_type', message: 'Expected text.', name: 'email' },
          {
            code: 'invalid_type',
            message: 'Expected a whole number.',
            name: 'age',
          },
          {
            code: 'invalid_option',
            message: 'Expected a whole number from 1 to 12.',
            name: 'month',
          },
          {
            code: 'invalid_type',
            message: 'Expected true or false.',
            name: 'agree',
          },
          {
            code: 'invalid_format',
            message: 'Expected a day as yyyy-MM-dd.',
            name: 'birthday',
          },
          {
            code: 'invalid_format',
            message:
              'Expected a time of day, 24-hour, matching ^\\d{2}:\\d{2}$.',
            name: 'start',
          },
        ])
      })

      test('should take a range of one day, and refuse a time that does not exist', async () => {
        const { calls, tools } = toolsOf()
        const result = await call(tools, 'fill', {
          start: '25:99',
          stay: ['2024-05-01', '2024-05-01'],
        })

        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['stay', ['2024-05-01', '2024-05-01']],
        ])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_format',
            message:
              'Expected a time of day, 24-hour, matching ^\\d{2}:\\d{2}$.',
            name: 'start',
          },
        ])
      })

      test('should empty a field with null, unless it is a choice', async () => {
        const { calls, tools } = toolsOf()
        const result = await call(tools, 'fill', {
          country: null,
          email: null,
          tags: null,
        })

        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['email', ''],
          ['tags', []],
        ])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_type',
            message: 'This field cannot be emptied: give it one of its values.',
            name: 'country',
          },
        ])
      })
    })

    describe('a type whose schema the host declares', () => {
      const rating: ToolSchema = { maximum: 5, minimum: 1, type: 'integer' }
      const code: ToolSchema = {
        maxLength: 4,
        minLength: 2,
        pattern: '^[A-Z]+$',
        type: 'string',
      }
      const fields: Fields = [
        { name: 'score', type: 'rating' },
        { name: 'tag', type: 'code' },
        { name: 'count', type: 'input/number' },
      ]

      function declaredTools() {
        const form = createForm()
        const tools = createFormTools(
          AGENT,
          buildToolSchema([{ fields }], {
            types: { code, 'input/number': rating, rating },
          }),
          {
            ...form.host,
            getField: (name) =>
              fields.filter(isField).find((field) => field.name === name),
          },
          { declared: new Set(['code', 'input/number', 'rating']) }
        )
        return { calls: form.calls, tools }
      }

      test('should write a value within the bounds the schema declares', async () => {
        const { calls, tools } = declaredTools()
        const result = await call(tools, 'fill', { score: 4, tag: 'AB' })

        expect(result.ok).toBe(true)
        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['score', 4],
          ['tag', 'AB'],
        ])
      })

      test('should skip a value out of the bounds the schema declares', async () => {
        const { calls, tools } = declaredTools()
        const result = await call(tools, 'fill', { score: 9, tag: 'abcde' })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message: 'Expected a whole number from 1 up to 5.',
            name: 'score',
          },
          {
            code: 'invalid_format',
            message: 'Expected 2 to 4 characters.',
            name: 'tag',
          },
        ])
        expect((await call(tools, 'fill', { tag: 'ab' })).skipped).toEqual([
          {
            code: 'invalid_format',
            message: 'Expected text matching ^[A-Z]+$.',
            name: 'tag',
          },
        ])
      })
    })

    describe('a declared schema, at its edges', () => {
      const fields: Fields = [
        { name: 'count', type: 'input/number' },
        { name: 'tag', type: 'code' },
      ]

      function declaredTools() {
        const form = createForm()
        const tools = createFormTools(
          AGENT,
          buildToolSchema([{ fields }], {
            types: {
              code: { minLength: 3, type: 'string' },
              'input/number': { maximum: 5, minimum: 1, type: 'integer' },
            },
          }),
          {
            ...form.host,
            getField: (name) =>
              fields.filter(isField).find((field) => field.name === name),
          },
          { declared: new Set(['code', 'input/number']) }
        )
        return { calls: form.calls, tools }
      }

      test('should check the range declared for a built-in number type, held as text', async () => {
        const { calls, tools } = declaredTools()
        const result = await call(tools, 'fill', { count: 99 })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_option',
            message: 'Expected a whole number from 1 up to 5.',
            name: 'count',
          },
        ])
        await call(tools, 'fill', { count: 3 })
        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['count', '3'],
        ])
      })

      test('should empty a field with null whatever bounds it declares', async () => {
        const { calls, tools } = declaredTools()
        const result = await call(tools, 'fill', { tag: null })

        expect(result.skipped).toEqual([])
        expect(calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['tag', ''],
        ])
      })
    })

    describe('a leaf of a row, by its route', () => {
      test("should write one row's leaf and report it under its route", async () => {
        const { calls, tools } = toolsOf({
          values: { items: [{ sku: 'A1' }, { sku: 'B2' }] },
        })
        const result = await call(tools, 'fill', { 'items.1.sku': 'b2' })

        expect(calls.rows).toEqual([])
        expect(calls.apply).toEqual([
          ['items.1.sku', 'b2', { immediate: true, validate: false }],
        ])
        expect(result).toMatchObject({
          applied: ['items.1.sku'],
          ok: true,
          values: { 'items.1.sku': 'b2' },
        })
      })

      test("should check a leaf as its row's schema says, and validate it", async () => {
        const { calls, tools } = toolsOf({
          rules: { 'items.0.sku': () => 'Too short' },
          values: { items: [{ sku: 'A1' }] },
        })
        const result = await call(tools, 'fill', {
          'items.0.qty': 'many',
          'items.0.sku': 'x',
        })

        expect(calls.validate).toEqual([['items.0.sku']])
        expect(result.errors).toEqual({ 'items.0.sku': ['Too short'] })
        expect(result.skipped).toEqual([
          {
            code: 'invalid_type',
            message: 'Expected a whole number.',
            name: 'items.0.qty',
          },
        ])
      })

      test('should write into a row the same call adds', async () => {
        const { tools, values } = toolsOf({ values: { items: [] } })
        const result = await call(tools, 'fill', {
          items: [{ sku: 'A1' }],
          'items.0.qty': 4,
        })

        expect(result.applied).toEqual(['items', 'items.0.qty'])
        expect(values.get('items')).toEqual([{ qty: '4', sku: 'A1' }])
      })

      test('should write a route after the list the same call sends whole', async () => {
        const { calls, tools, values } = toolsOf({
          values: { items: [{ sku: 'A1' }, { sku: 'B2' }] },
        })
        const result = await call(tools, 'fill', {
          items: [{ sku: 'X' }],
          'items.0.qty': 4,
        })

        expect(calls.rows).toEqual([['items', [{ sku: 'X' }]]])
        expect(calls.apply.map(([name]) => name)).toEqual(['items.0.qty'])
        expect(values.get('items')).toEqual([{ qty: '4', sku: 'X' }])
        expect(result.applied).toEqual(['items', 'items.0.qty'])
      })

      test('should take a row only as a whole number without a leading zero', async () => {
        const { calls, tools } = toolsOf({
          values: { items: [{ sku: 'A1' }, { sku: 'B2' }] },
        })
        const result = await call(tools, 'fill', { 'items.01.sku': 'x' })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'unknown',
            message: 'No field so named.',
            name: 'items.01.sku',
          },
        ])
      })

      test('should answer unknown for a row the list does not hold, or a leaf it does not have', async () => {
        const { calls, tools } = toolsOf({
          values: { items: [{ sku: 'A1' }] },
        })
        const result = await call(tools, 'fill', {
          'items.0.color': 'red',
          'items.5.sku': 'x',
          'items.x.sku': 'x',
        })

        expect(calls.apply).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'unknown',
            message: 'No field so named.',
            name: 'items.0.color',
          },
          {
            code: 'unknown',
            message: 'No field so named.',
            name: 'items.x.sku',
          },
          {
            code: 'unknown',
            message: 'No row of the list is at that position.',
            name: 'items.5.sku',
          },
        ])
      })
    })

    describe('lists', () => {
      test('should hand a list its rows, and report the rows it did not keep', async () => {
        const { calls, tools } = toolsOf()
        const result = await call(tools, 'fill', {
          items: [{ sku: 'A1' }, { qty: 2, sku: 'B2' }, { sku: 'C3' }],
        })

        expect(calls.rows).toEqual([
          ['items', [{ sku: 'A1' }, { qty: '2', sku: 'B2' }, { sku: 'C3' }]],
        ])
        expect(result.adjusted).toEqual([
          {
            code: 'rows_adjusted',
            message: 'The list holds 2 rows: 3 were sent.',
            name: 'items',
          },
        ])
        expect(result.values).toEqual({
          items: [{ sku: 'A1' }, { qty: 2, sku: 'B2' }],
        })
      })

      test('should keep the rows of a fixed list, which a person can neither add to nor remove', async () => {
        const form = createForm({
          values: { items: [{ sku: 'A1' }, { sku: 'B2' }] },
        })
        const fields = FIELDS.map((slot) =>
          isList(slot)
            ? { ...slot, advanced: { ...slot.advanced, fixed: true } }
            : slot
        )
        const tools = createFormTools(
          AGENT,
          buildToolSchema([{ fields }]),
          form.host
        )
        const skipped = {
          code: 'rows_fixed',
          message:
            'It keeps the 2 rows it has: send each of them, in order, or write one field of a row by its route.',
          name: 'items',
        }

        for (const items of [[{ sku: 'A1' }], [], null]) {
          const result = await call(tools, 'fill', { items })
          expect(result.ok).toBe(false)
          expect(result.skipped).toEqual([skipped])
        }
        expect(form.calls.rows).toEqual([])

        // The rows it has, corrected, and one field of a row by its route.
        const result = await call(tools, 'fill', {
          items: [{ sku: 'A9' }, { sku: 'B2' }],
          'items.1.qty': 3,
        })
        expect(result.ok).toBe(true)
        expect(form.calls.rows).toEqual([
          ['items', [{ sku: 'A9' }, { sku: 'B2' }]],
        ])
        expect(form.calls.apply.map(([name, value]) => [name, value])).toEqual([
          ['items.1.qty', '3'],
        ])
      })

      test('should skip a list with a row it cannot take, saying which', async () => {
        const { calls, tools } = toolsOf()
        const result = await call(tools, 'fill', {
          items: [{ sku: 'A1' }, { color: 'red' }],
        })

        expect(calls.rows).toEqual([])
        expect(result.skipped).toEqual([
          {
            code: 'invalid_type',
            message: 'Row 2 has no field "color".',
            name: 'items',
          },
        ])
      })

      test("should say which row's field a value does not fit", async () => {
        const { tools } = toolsOf()
        const result = await call(tools, 'fill', { items: [{ qty: 'many' }] })

        expect(result.skipped).toEqual([
          {
            code: 'invalid_type',
            message: 'Row 1, qty: Expected a whole number.',
            name: 'items',
          },
        ])
      })
    })
  })

  describe('allow', () => {
    test('should ask before filling, with the values sent', async () => {
      const allow = vi.fn(() => true)
      const { calls, tools } = toolsOf({}, { ...AGENT, allow })
      await call(tools, 'fill', { email: 'ada@example.com' })

      expect(allow).toHaveBeenCalledWith(
        { tool: 'fill', values: { email: 'ada@example.com' } },
        { deadline: expect.any(Number), signal: expect.any(AbortSignal) }
      )
      expect(calls.apply).toHaveLength(1)
    })

    test('should write nothing when refused, and pass on the reason given', async () => {
      for (const [answer, message] of [
        [false, 'The page refused the call.'],
        ['Ask the person first.', 'Ask the person first.'],
      ] as const) {
        const { calls, tools } = toolsOf({}, { ...AGENT, allow: () => answer })
        expect(await call(tools, 'fill', { email: 'a@b.co' })).toEqual({
          code: 'refused',
          message,
          ok: false,
        })
        expect(calls.apply).toEqual([])
      }
    })

    test('should wait for an answer that is a promise', async () => {
      let answer: ((value: boolean) => void) | undefined
      const allow = () =>
        new Promise<boolean>((resolve) => {
          answer = resolve
        })
      const { calls, tools } = toolsOf({}, { ...AGENT, allow })

      const pending = call(tools, 'fill', { email: 'a@b.co' })
      await vi.waitFor(() => expect(answer).toBeDefined())
      expect(calls.apply).toEqual([])

      answer?.(true)
      expect((await pending).ok).toBe(true)
    })

    test('should stop waiting when the agent cancels, and abort what allow was handed', async () => {
      let handed: AbortSignal | undefined
      const allow = (_call: object, { signal }: { signal: AbortSignal }) => {
        handed = signal
        return new Promise<boolean>(() => {})
      }
      const { calls, tools } = toolsOf({}, { ...AGENT, allow })
      const controller = new AbortController()

      const pending = call(
        tools,
        'fill',
        { email: 'a@b.co' },
        controller.signal
      )
      await Promise.resolve()
      await Promise.resolve()
      controller.abort()

      expect(await pending).toEqual({
        code: 'cancelled',
        message: 'The call was cancelled before it changed anything.',
        ok: false,
      })
      expect(handed?.aborted).toBe(true)
      expect(calls.apply).toEqual([])
    })

    test('should refuse a call allow never answers after five minutes, and say nobody answered', async () => {
      vi.useFakeTimers()
      const allow = () => new Promise<boolean>(() => {})
      const { calls, tools } = toolsOf({}, { ...AGENT, allow })

      const pending = call(tools, 'fill', { email: 'a@b.co' })
      await vi.advanceTimersByTimeAsync(5 * 60_000)
      expect(await pending).toEqual({
        code: 'refused',
        message:
          'Nobody answered in time, so the call changed nothing. Ask your user before you try again.',
        ok: false,
      })
      expect(calls.apply).toEqual([])
    })

    test('should refuse a call allow never answers once the tools are taken down, and say the form is gone', async () => {
      const allow = () => new Promise<boolean>(() => {})
      const lifetime = new AbortController()
      const { calls, tools } = toolsOf({}, { ...AGENT, allow }, lifetime.signal)

      const pending = call(tools, 'fill', { email: 'a@b.co' })
      await Promise.resolve()
      await Promise.resolve()
      lifetime.abort()
      expect(await pending).toEqual({
        code: 'refused',
        message:
          'The form is no longer on the page, so the call changed nothing. Ask your user before you try again.',
        ok: false,
      })
      expect(calls.apply).toEqual([])
    })

    test('should tell apart a call nobody answered, one whose form is gone, one the agent cancelled and one refused', async () => {
      vi.useFakeTimers()
      const waiting = () => new Promise<boolean>(() => {})
      const answers: string[] = []

      const late = toolsOf({}, { ...AGENT, allow: waiting })
      const expired = call(late.tools, 'fill', { email: 'a@b.co' })
      await vi.advanceTimersByTimeAsync(5 * 60_000)
      answers.push(String((await expired).message))

      const lifetime = new AbortController()
      const gone = toolsOf({}, { ...AGENT, allow: waiting }, lifetime.signal)
      const closed = call(gone.tools, 'fill', { email: 'a@b.co' })
      await vi.advanceTimersByTimeAsync(0)
      lifetime.abort()
      answers.push(String((await closed).message))

      const controller = new AbortController()
      const left = toolsOf({}, { ...AGENT, allow: waiting })
      const cancelled = call(
        left.tools,
        'fill',
        { email: 'a@b.co' },
        controller.signal
      )
      await vi.advanceTimersByTimeAsync(0)
      controller.abort()
      answers.push(String((await cancelled).message))

      const refusing = toolsOf({}, { ...AGENT, allow: () => false })
      answers.push(
        String(
          (await call(refusing.tools, 'fill', { email: 'a@b.co' })).message
        )
      )

      expect(new Set(answers).size).toBe(4)
    })

    test('should hand allow the time its wait ends', async () => {
      vi.useFakeTimers({ now: 1_000_000 })
      let handed: number | undefined
      const { tools } = toolsOf(
        {},
        {
          ...AGENT,
          allow: (_call, { deadline }) => {
            handed = deadline
            return true
          },
        }
      )

      await call(tools, 'fill', { email: 'a@b.co' })

      expect(handed).toBe(1_000_000 + 5 * 60_000)
    })

    test('should refuse the call when allow fails', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { calls, tools } = toolsOf(
        {},
        {
          ...AGENT,
          allow: () => {
            throw new Error('No dialog')
          },
        }
      )

      expect(await call(tools, 'fill', { email: 'a@b.co' })).toEqual({
        code: 'refused',
        message: 'The page could not answer the call.',
        ok: false,
      })
      expect(calls.apply).toEqual([])
      expect(error).toHaveBeenCalled()
    })

    test('should not ask to read or to look up options', async () => {
      const allow = vi.fn(() => false)
      const { tools } = toolsOf({}, { ...AGENT, allow })
      await call(tools, 'read')
      await call(tools, 'options', { field: 'zone' })

      expect(allow).not.toHaveBeenCalled()
    })
  })

  describe('onCall', () => {
    test('should be told of every call once it was answered, a busy one included', async () => {
      const onCall = vi.fn()
      let release = () => {}
      const allow = () =>
        new Promise<boolean>((resolve) => {
          release = () => resolve(true)
        })
      const { tools } = toolsOf({}, { ...AGENT, allow, onCall })

      const filled = call(tools, 'fill', { email: 'ada@example.com' })
      const waiting = Array.from({ length: 9 }, () => call(tools, 'read'))
      const busy = await call(tools, 'read')
      release()
      const answer = await filled
      await Promise.all(waiting)

      expect(onCall).toHaveBeenCalledTimes(11)
      expect(onCall.mock.calls[0][0]).toEqual({
        duration: expect.any(Number),
        input: {},
        output: busy,
        tool: 'read',
      })
      expect(onCall.mock.calls[1][0]).toEqual({
        duration: expect.any(Number),
        input: { email: 'ada@example.com' },
        output: answer,
        tool: 'fill',
      })
    })

    test('should be told of a call that threw, with what it threw', async () => {
      const onCall = vi.fn()
      const form = createForm()
      const tools = createFormTools(
        { ...AGENT, onCall },
        buildToolSchema([{ fields: FIELDS }]),
        {
          ...form.host,
          apply: () => {
            throw new Error('The field broke')
          },
        }
      )

      await expect(
        toolNamed(tools, 'fill').execute({ email: 'ada@example.com' })
      ).rejects.toThrow('The field broke')
      await vi.waitFor(() =>
        expect(onCall).toHaveBeenCalledWith(
          expect.objectContaining({ error: 'The field broke', tool: 'fill' })
        )
      )
    })

    test('should answer the call whatever onCall throws', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onCall = () => {
        throw new Error('The log is down')
      }
      const { tools } = toolsOf({}, { ...AGENT, onCall })

      expect(await call(tools, 'read', { fields: ['email'] })).toMatchObject({
        values: {},
      })
      expect(error).toHaveBeenCalled()
    })
  })

  describe('queue', () => {
    test('should answer the calls of a form one at a time, in the order they came', async () => {
      const order: string[] = []
      let release = () => {}
      const allow = (call: { tool: string; values: ToolResult }) => {
        order.push(`ask ${String(call.values.email)}`)
        return call.values.email === 'first'
          ? new Promise<boolean>((resolve) => {
              release = () => resolve(true)
            })
          : true
      }
      const { calls, tools } = toolsOf({}, { ...AGENT, allow })

      const first = call(tools, 'fill', { email: 'first' })
      const second = call(tools, 'fill', { email: 'second' })
      await Promise.resolve()
      await Promise.resolve()
      expect(order).toEqual(['ask first'])

      release()
      await Promise.all([first, second])
      expect(order).toEqual(['ask first', 'ask second'])
      expect(calls.apply.map(([, value]) => value)).toEqual(['first', 'second'])
    })

    test('should make tools built again for the same form wait for the ones before', async () => {
      const queue = createQueue()
      let release = () => {}
      const order: string[] = []
      const form = createForm()
      const allow = (call: { values: ToolResult }) => {
        order.push(String(call.values.email))
        return call.values.email === 'first'
          ? new Promise<boolean>((resolve) => {
              release = () => resolve(true)
            })
          : true
      }
      const build = () =>
        createFormTools(
          { ...AGENT, allow },
          buildToolSchema([{ fields: FIELDS }]),
          form.host,
          { queue }
        )

      const first = toolNamed(build(), 'fill').execute({ email: 'first' })
      const second = toolNamed(build(), 'fill').execute({ email: 'second' })
      await vi.waitFor(() => expect(order).toEqual(['first']))

      release()
      await Promise.all([first, second])
      expect(order).toEqual(['first', 'second'])
    })

    test('should answer busy past ten calls waiting', async () => {
      const allow = () => new Promise<boolean>(() => {})
      const { tools } = toolsOf({}, { ...AGENT, allow })

      // The first is being answered, and ten wait behind it.
      for (let index = 0; index < 11; index++) {
        void toolNamed(tools, 'fill').execute({ email: `${index}` })
      }
      expect(await call(tools, 'read')).toEqual({
        code: 'busy',
        message:
          'The form has 10 calls waiting: call again once one is answered.',
        ok: false,
      })
    })
  })

  describe('read', () => {
    test('should read the values, what is hidden or locked, the errors and the last submission', async () => {
      const { host, tools } = toolsOf({
        locked: ['email'],
        rules: { country: () => 'Pick a country' },
        values: { country: 'xx', email: 'ada@example.com' },
      })
      host.validate(['country'])

      expect(
        await call(tools, 'read', { fields: ['email', 'country', 'frequency'] })
      ).toEqual({
        errors: { country: ['Pick a country'] },
        hidden: ['frequency'],
        locked: ['email'],
        submit: { status: 'idle' },
        values: { country: 'xx', email: 'ada@example.com' },
      })
    })

    test('should leave the agent free to write over the fields it read, and only those', async () => {
      const { tools } = toolsOf({ changed: ['country', 'email'] })
      await call(tools, 'read', { fields: ['email'] })

      expect(
        await call(tools, 'fill', { country: 'mx', email: 'ada@example.com' })
      ).toMatchObject({
        applied: ['email'],
        skipped: [{ code: 'changed', name: 'country' }],
      })
    })

    test('should read values in the shape the schema gives them, and only the leaves it has', async () => {
      const { tools } = toolsOf({
        values: {
          active: 'true',
          age: '42',
          items: [{ pin: '1234', qty: '3', sku: 'A1' }],
          month: '3',
        },
      })

      expect(
        (
          await call(tools, 'read', {
            fields: ['age', 'month', 'active', 'items'],
          })
        ).values
      ).toEqual({
        active: true,
        age: 42,
        items: [{ qty: 3, sku: 'A1' }],
        month: 3,
      })
    })

    test('should read a time as the schema gives it, whatever format the field shows', async () => {
      const fields: Fields = [
        { advanced: { format: 'hh:mm a' }, name: 'alarm', type: 'input/time' },
        { advanced: { format: 'HH:mm:ss' }, name: 'lap', type: 'input/time' },
      ]
      const form = createForm({
        absent: [],
        values: { alarm: '09:30 PM', lap: '01:02:03' },
      })
      const [, read] = createFormTools(AGENT, buildToolSchema([{ fields }]), {
        ...form.host,
        getField: (name) =>
          fields.filter(isField).find((field) => field.name === name),
      })

      expect((await read.execute({ fields: ['alarm', 'lap'] })).values).toEqual(
        { alarm: '21:30', lap: '01:02:03' }
      )
    })

    test('should read every field when none is named, and nothing left out of the tools', async () => {
      const { tools } = toolsOf()
      const result = await call(tools, 'read', {
        fields: ['email', 'secret', 'document'],
      })
      expect(Object.keys(result.values as object)).toEqual(['email'])

      const all = await call(tools, 'read')
      expect(Object.keys(all.values as object)).not.toContain('secret')
      expect(all.hidden).toEqual(['frequency'])
    })

    test('should read up to 100 fields, and say how many are left', async () => {
      const fields: Fields = Array.from({ length: 103 }, (_, index) => ({
        name: `field${index}`,
        type: 'input/text',
      }))
      const [, read] = createFormTools(
        AGENT,
        buildToolSchema([{ fields }]),
        createForm({ absent: [] }).host
      )
      const result = await read.execute({})

      expect(Object.keys(result.values as object)).toHaveLength(100)
      expect(result.more).toBe(3)
    })

    test('should refuse fields that are not a list of names', async () => {
      const { tools } = toolsOf()
      expect((await call(tools, 'read', { fields: 'email' })).code).toBe(
        'invalid_type'
      )
    })
  })

  describe('options', () => {
    test('should find options by label or value, in any case and without accents', async () => {
      const { tools } = toolsOf()
      expect(
        await call(tools, 'options', { field: 'zone', text: 'ZONE 1' })
      ).toEqual({
        items: ZONES.filter(({ label }) => label.startsWith('Zone 1')),
      })
    })

    test('should return up to 50 options, and say how many more there are', async () => {
      const { tools } = toolsOf()
      const result = await call(tools, 'options', { field: 'zone' })

      expect(result.items).toEqual(ZONES.slice(0, 50))
      expect(result.more).toBe(10)
    })

    test("should find the options of a list's leaf by the name the schema gives it", async () => {
      const { tools } = toolsOf()
      expect(
        toolNamed(tools, 'options').inputSchema.properties?.field?.enum
      ).toContain('items.0.zone')
      expect(
        await call(tools, 'options', { field: 'items.0.zone', text: 'zone 59' })
      ).toEqual({ items: [ZONES[59]] })
    })

    test('should wait for the options a field is loading', async () => {
      const { options, tools } = toolsOf({
        fetching: ['zone'],
        unloaded: ['zone'],
      })
      const answer = call(tools, 'options', { field: 'zone', text: 'zone 59' })
      options.set('zone', ZONES)

      expect(await answer).toEqual({ items: [ZONES[59]] })
    })

    test('should say why a field has no options, and stop waiting for them', async () => {
      const ask = async (setup: Setup) =>
        (await call(toolsOf(setup).tools, 'options', { field: 'zone' })).message

      expect(await ask({ absent: ['zone'], unloaded: ['zone'] })).toBe(
        'The field is not on the form: fill what shows it first, then ask again.'
      )
      expect(await ask({ locked: ['zone'], unloaded: ['zone'] })).toBe(
        'The field is disabled or read-only.'
      )

      vi.useFakeTimers()
      const answer = ask({ fetching: ['zone'], unloaded: ['zone'] })
      await vi.advanceTimersByTimeAsync(5_000)
      expect(await answer).toBe('Its options did not arrive: ask again later.')
    })

    test('should name the field whose change brings the options', async () => {
      const fields: Fields = [
        {
          event: {
            change: [
              {
                action: 'source',
                source: { url: '/api/zones?country={value}' },
                target: 'zone',
              },
            ],
          },
          name: 'country',
          source: COUNTRIES,
          type: 'select',
        },
        { name: 'zone', type: 'select' },
      ]
      const tools = createFormTools(
        AGENT,
        buildToolSchema([{ fields }]),
        createForm({ unloaded: ['zone'] }).host
      )

      expect(await call(tools, 'options', { field: 'zone' })).toEqual({
        items: [],
        message:
          'Its options come from country: fill it first, then ask again.',
      })
    })

    test('should answer unknown for a field without options or left out of the tools', async () => {
      const { tools } = toolsOf()
      for (const field of ['email', 'secret', 'nothing']) {
        expect(await call(tools, 'options', { field })).toEqual({
          code: 'unknown',
          message: 'No field so named has options.',
          ok: false,
        })
      }
    })
  })

  describe('submit', () => {
    test('should ask with what the form holds, submit, and return what the action answered', async () => {
      const allow = vi.fn(() => true)
      const { tools } = toolsOf(
        {
          submit: async () => ({ data: { id: 7 }, status: 'success' }),
          values: { email: 'ada@example.com' },
        },
        { ...AGENT, allow }
      )

      expect(await call(tools, 'submit')).toEqual({ data: { id: 7 }, ok: true })
      expect(allow).toHaveBeenCalledWith(
        {
          tool: 'submit',
          values: expect.objectContaining({ email: 'ada@example.com' }),
        },
        { deadline: expect.any(Number), signal: expect.any(AbortSignal) }
      )
    })

    test('should return the error and the field errors of a submission that failed', async () => {
      const { tools } = toolsOf({
        submit: async () => ({
          error: { title: 'Check the form' },
          errors: { email: ['Invalid email address'] },
          status: 'error',
        }),
      })

      expect(await call(tools, 'submit')).toEqual({
        error: { title: 'Check the form' },
        errors: { email: ['Invalid email address'] },
        ok: false,
      })
    })

    test('should answer pending after 15 seconds, and not submit again while one runs', async () => {
      vi.useFakeTimers()
      const submit = vi.fn(() => new Promise<SubmitStatus>(() => {}))
      const { tools } = toolsOf({ submit })

      const first = call(tools, 'submit')
      await vi.advanceTimersByTimeAsync(15_000)
      const pending = {
        message:
          'The submission is still running: call signup_read for its outcome.',
        pending: true,
      }
      expect(await first).toEqual(pending)

      expect(await call(tools, 'submit')).toEqual(pending)
      expect(submit).toHaveBeenCalledTimes(1)
    })

    describe('while a person approves it', () => {
      test('should say in its description that a person may approve it first', () => {
        const without = toolNamed(toolsOf().tools, 'submit').description
        const approved = toolNamed(
          toolsOf({}, { ...AGENT, allow: () => true }).tools,
          'submit'
        ).description

        expect(without).not.toContain('approve')
        expect(approved).toContain('A person may need to approve it first.')
      })

      test('should keep its promise of an answer within 15 seconds', async () => {
        vi.useFakeTimers()
        const submit = vi.fn(async (): Promise<SubmitStatus> => ({
          status: 'success',
        }))
        const { tools } = toolsOf(
          { submit },
          { ...AGENT, allow: () => new Promise<boolean>(() => {}) }
        )

        let answered = false
        void call(tools, 'submit').then(() => {
          answered = true
        })
        await vi.advanceTimersByTimeAsync(15_000)

        expect(answered).toBe(true)
        expect(submit).not.toHaveBeenCalled()
      })

      test('should answer pending past 15 seconds, and send once the person approves', async () => {
        vi.useFakeTimers()
        let approve = (_answer: boolean | string) => {}
        const allow = vi.fn((call: { tool: string }) =>
          call.tool === 'fill'
            ? true
            : new Promise<boolean | string>((resolve) => {
                approve = resolve
              })
        )
        const { calls, host, tools } = toolsOf(
          { submit: async () => ({ data: { id: 7 }, status: 'success' }) },
          { ...AGENT, allow }
        )

        const first = call(tools, 'submit')
        await vi.advanceTimersByTimeAsync(15_000)
        const waiting = {
          message:
            'The submission waits for a person to approve it: call signup_read for its outcome.',
          pending: true,
        }
        expect(await first).toEqual(waiting)
        // Not asked again, and nothing written over what the person sees.
        expect(await call(tools, 'submit')).toEqual(waiting)
        const filled = call(tools, 'fill', { email: 'ada@example.com' })
        await vi.advanceTimersByTimeAsync(0)
        expect(calls.apply).toEqual([])
        expect(allow).toHaveBeenCalledTimes(1)

        approve(true)
        vi.useRealTimers()
        expect((await filled).ok).toBe(true)
        expect(host.getSubmit()).toEqual({ data: { id: 7 }, status: 'success' })
      })

      test('should record why a person refused once the agent was answered pending', async () => {
        vi.useFakeTimers()
        let refuse = (_answer: string) => {}
        const submit = vi.fn(async (): Promise<SubmitStatus> => ({
          status: 'success',
        }))
        const { tools } = toolsOf(
          { submit },
          {
            ...AGENT,
            allow: () =>
              new Promise<string>((resolve) => {
                refuse = resolve
              }),
          }
        )

        void call(tools, 'submit')
        await vi.advanceTimersByTimeAsync(15_000)
        refuse('Not this plan.')
        await vi.advanceTimersByTimeAsync(0)

        expect(
          (await call(tools, 'read', { fields: ['email'] })).submit
        ).toEqual({ message: 'Not this plan.', status: 'refused' })
        expect(submit).not.toHaveBeenCalled()
      })

      test('should record a person who never answered as a refusal', async () => {
        vi.useFakeTimers()
        const { tools } = toolsOf(
          {},
          { ...AGENT, allow: () => new Promise<boolean>(() => {}) }
        )

        void call(tools, 'submit')
        await vi.advanceTimersByTimeAsync(5 * 60_000)

        expect(
          (await call(tools, 'read', { fields: ['email'] })).submit
        ).toEqual({
          message:
            'Nobody answered in time, so the call changed nothing. Ask your user before you try again.',
          status: 'refused',
        })
      })

      test('should take the wait back when the agent cancels', async () => {
        const { host, tools } = toolsOf(
          {},
          { ...AGENT, allow: () => new Promise<boolean>(() => {}) }
        )
        const controller = new AbortController()

        const cancelled = call(tools, 'submit', {}, controller.signal)
        await vi.waitFor(() =>
          expect(host.getSubmit().status).toBe('awaiting_approval')
        )
        controller.abort()

        expect((await cancelled).code).toBe('cancelled')
        expect(host.getSubmit()).toEqual({ status: 'idle' })
      })

      test('should let a read say the submission waits for a person, and until when', async () => {
        vi.useFakeTimers({ now: 1_000_000 })
        let handed: number | undefined
        const { tools } = toolsOf(
          {},
          {
            ...AGENT,
            allow: (_call, { deadline }) => {
              handed = deadline
              return new Promise<boolean>(() => {})
            },
          }
        )

        void call(tools, 'submit')
        await vi.advanceTimersByTimeAsync(1_000)
        const read = await Promise.race([
          call(tools, 'read', { fields: ['email'] }),
          vi.advanceTimersByTimeAsync(100).then(() => undefined),
        ])

        expect(handed).toBe(1_000_000 + 5 * 60_000)
        expect(read?.submit).toEqual({
          deadline: new Date(1_000_000 + 5 * 60_000).toISOString(),
          status: 'awaiting_approval',
        })
      })
    })

    test('should not submit a call the agent cancelled', async () => {
      const submit = vi.fn(async (): Promise<SubmitStatus> => ({
        status: 'success',
      }))
      const { tools } = toolsOf({ submit })
      const controller = new AbortController()
      controller.abort()

      expect((await call(tools, 'submit', {}, controller.signal)).code).toBe(
        'cancelled'
      )
      expect(submit).not.toHaveBeenCalled()
    })
  })
})
