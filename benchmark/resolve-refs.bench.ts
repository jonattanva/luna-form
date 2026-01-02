import { bench, group, run } from 'mitata'
import { resolveRefs } from '../packages/luna-core/src/util/prepare'

const definition = {
  user: {
    name: 'John Doe',
    role: 'admin',
  },
  settings: {
    theme: 'dark',
    notifications: true,
  },
}

const smallData = {
  id: 1,
  profile: { $ref: '#/definition/user' },
}

const largeData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  data: { $ref: i % 2 === 0 ? '#/definition/user' : '#/definition/settings' },
  metadata: {
    timestamp: Date.now(),
    tags: ['a', 'b', 'c'],
  },
}))

const noRefsData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  value: Math.random(),
}))

group('resolveRefs Performance', () => {
  bench('Small object with $ref', () => {
    resolveRefs(smallData, definition)
  })

  bench('Large array (1000 items) with $refs', () => {
    resolveRefs(largeData, definition)
  })

  bench('Large array (1000 items) NO $refs', () => {
    resolveRefs(noRefsData, definition)
  })

  bench('Large array (1000 items) NO definition (Short-circuit)', () => {
    resolveRefs(largeData, undefined)
  })
})

run()
