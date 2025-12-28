export function convertCodeToForm(code?: string) {
  try {
    if (!code) {
      throw new Error('No code provided')
    }

    const parsed = JSON.parse(code)
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Parsed code is not a valid object')
    }

    return parsed
  } catch {
    return {}
  }
}
