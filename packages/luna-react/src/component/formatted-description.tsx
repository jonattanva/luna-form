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
  }>
) {
  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
  }

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
            interpolateIfNeeded(props.text.title, interpolateOpts),
            props.translations
          )
        )
      : undefined

  const message = formatMarkdown(
    translate(
      interpolateIfNeeded(
        isString(props.text) ? props.text : props.text?.message,
        interpolateOpts
      ),
      props.translations
    )
  )

  if (message) {
    return (
      <div className="flex flex-col gap-2">
        {title && (
          <button
            className="flex items-center gap-1 text-left text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            onClick={handleExpandToggle}
            type="button"
          >
            {title}
            <ChevronIcon expanded={isExpanded} />
          </button>
        )}
        {isExpanded && <Description>{message}</Description>}
      </div>
    )
  }

  return null
}
