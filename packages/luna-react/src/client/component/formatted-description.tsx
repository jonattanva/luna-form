import { Description } from '../../component/description'
import { formatTemplate } from '../../lib/string'
import {
  interpolateIfNeeded,
  isObject,
  isString,
  renderOptions,
  translate,
  type Description as DescriptionType,
  type Localization,
  type TemplateScope,
} from '@luna-form/core'
import { ChevronIcon } from '../../component/chevron-icon'
import { useDisclosure } from '../hook/use-disclosure'
import type { Config } from '../../type'

export function FormattedDescription(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    localization?: Localization
    text?: DescriptionType
    value?: unknown
  }>
) {
  const scope: TemplateScope = {
    dictionary: props.localization?.translations,
    options: renderOptions(props.localization?.lang, props.context),
    values: {
      context: props.context,
      env: props.config?.env,
      value: props.value,
    },
  }

  const [isExpanded, toggle] = useDisclosure(() => {
    if (isObject(props.text) && 'collapsed' in props.text) {
      return !props.text.collapsed
    }
    return true
  })

  const title =
    isObject(props.text) && isString(props.text.title)
      ? formatTemplate(props.text.title, scope)
      : undefined

  const template = isString(props.text) ? props.text : props.text?.message

  // The tooltip is an attribute, plain text whatever it holds.
  const rawMessage = translate(
    interpolateIfNeeded(template, scope.values, scope.options),
    scope.dictionary
  )

  const message = formatTemplate(template, scope)

  if (message) {
    return (
      <div className="flex flex-col gap-2">
        {title && (
          <button
            className="flex items-center gap-1 text-left text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            onClick={toggle}
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
