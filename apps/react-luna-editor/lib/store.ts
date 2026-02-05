import { atomWithStorage } from 'jotai/utils'

export const codeAtom = atomWithStorage<string>('luna-editor:code', '')
