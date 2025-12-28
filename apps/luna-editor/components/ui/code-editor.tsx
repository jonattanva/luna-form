'use client'

import MonacoEditor from '@monaco-editor/react'
import { codeAtom } from '@/lib/store'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export function CodeEditor(
  props: Readonly<{
    timeout?: number
  }>
) {
  const [value, setValue] = useAtom(codeAtom)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleValueChange = (newValue: string | undefined) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setValue(newValue ?? '')
    }, props.timeout ?? 500)
  }

  return (
    <div className="flex-1 overflow-hidden">
      <MonacoEditor
        height="100%"
        language="json"
        onChange={handleValueChange}
        options={{
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          automaticLayout: true,
          fontSize: 14,
          formatOnPaste: true,
          formatOnType: true,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 2,
          quickSuggestions: {
            comments: false,
            other: true,
            strings: false,
          },
          suggest: {
            snippetsPreventQuickSuggestions: false,
            showSnippets: false,
            showWords: false,
          },
        }}
        value={value}
      />
    </div>
  )
}
