import { useEffect, useRef } from 'react'

export function useTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timeout = timeoutRef.current
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  function clearTimeoutRef() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function setTimeoutRef(callback: () => void, delay: number) {
    clearTimeoutRef()
    timeoutRef.current = setTimeout(callback, delay)
  }

  return [setTimeoutRef, clearTimeoutRef] as const
}
