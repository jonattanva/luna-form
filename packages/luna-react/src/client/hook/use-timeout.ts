import { useCallback, useEffect, useRef } from 'react'

export function useTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function clearTimeoutRef() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const setTimeoutRef = useCallback((callback: () => void, delay: number) => {
    clearTimeoutRef()
    timeoutRef.current = setTimeout(callback, delay)
  }, [])

  return setTimeoutRef
}
