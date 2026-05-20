import { Description } from './description'
import { formatMarkdown } from '../lib/string'
import {
  interpolateIfNeeded,
  isObject,
  isString,
  translate,
  type Description as DescriptionType,
} from '@luna-form/core'
import { ChevronIcon } from './chevron-icon'
import { useState } from 'react'
import type { Config } from '../type'

export function FormattedDescription(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    text?: DescriptionType
    translations?: Record<string, string>
    value?: unknown
  }>
) {
  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
    value: props.value,
  }

  const locale = props.config?.env?.locale as string | undefined
  const formatOptions = { locale }

  const [isExpanded, setIsExpanded] = useState(() => {
    if (isObject(props.text) && 'collapsed' in props.text) {
      return !props.text.collapsed
    }
    return true
  })

  const handleExpandToggle = () => setIsExpanded((previous) => !previous)

  const title =
    isObject(props.text) && isString(props.text.title)
      ? formatMarkdown(
          translate(
            interpolateIfNeeded(
              props.text.title,
              interpolateOpts,
              formatOptions
            ),
            props.translations
          )
        )
      : undefined

  const rawMessage = translate(
    interpolateIfNeeded(
      isString(props.text) ? props.text : props.text?.message,
      interpolateOpts,
      formatOptions
    ),
    props.translations
  )

  const message = formatMarkdown(rawMessage)

  if (message) {
    return (
      <div className="flex flex-col gap-2">
        {title && (
          <button
            className="flex items-center gap-1 text-left text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            onClick={handleExpandToggle}
            type="button"
          >
            {title}
            <ChevronIcon expanded={isExpanded} />
          </button>
        )}
        {isExpanded && <Description title={rawMessage}>{message}</Description>}
      </div>
    )
  }

  return null
}
