import { holdValue, isValidValue, type Field } from '@luna-form/core'
import { useCallback, useEffect, useRef } from 'react'
import { useHostEntryReader } from './use-host-entry'
import type { InputCoreProps, useInputCore } from './use-input-core'
import type { InputStrategies } from '../component/input-strategies'
import type { useValue } from './use-value'

type InputCore = ReturnType<typeof useInputCore>
type Value = ReturnType<typeof useValue>

/**
 * A field's change events run again without a change of its own.
 *
 * - **At mount**, for the value the host or the definition gives it, so a form
 *   opened on saved data reveals what it revealed when it was filled in. Once:
 *   a change has run them, or there is nothing to run them for.
 * - **After mount**, the field's `state` rules for a value the host puts in
 *   from outside -- an undo, a reset -- so what they reveal follows the value as
 *   it does on a click.
 *
 * Returns `markReplayed`, for a change of the field's own: it has run the
 * events, so the mount-time run has nothing left to do, and a value the host
 * puts back later can undo what the change revealed.
 *
 * Called after `useValue`, whose effect is the one that notices the host's
 * change, so the second effect here reads this commit's answer; it is handed
 * the host's entry `useValue` subscribes to.
 */
export function useReplayedChangeEvents(
  field: Field,
  options: Readonly<{
    applyChangeEventsRef: InputCore['applyChangeEventsRef']
    applyStateEventsRef: InputCore['applyStateEventsRef']
    buildInitialSelected: InputStrategies['buildInitialSelected']
    data: Parameters<InputStrategies['buildInitialSelected']>[1]
    entity: InputCore['entity']
    getField: InputCoreProps['getField']
    hostFound: Value['hostFound']
    hostValue: Value['hostValue']
    isInitialReady: InputStrategies['isInitialReady']
    takeHostChange: Value['takeHostChange']
  }>
) {
  const {
    applyChangeEventsRef,
    applyStateEventsRef,
    buildInitialSelected,
    data,
    entity,
    getField,
    hostFound,
    hostValue,
    isInitialReady,
    takeHostChange,
  } = options

  const replayedRef = useRef(false)

  // Read only to know when to look again. The first effect looks whenever the
  // host's entry moves until it has run: a host that names the field from the
  // start, empty, fills it in later, and only the value says when. The second
  // looks whenever the field's value may have come from the host.
  const readHostEntry = useHostEntryReader(field.name)

  useEffect(() => {
    if (replayedRef.current) {
      return
    }

    // The whole decision runs in the microtask, not here, and that is the point
    // rather than a detail. This reader latches: it decides once and marks
    // itself done. The form writes the host's record from its own effect, and a
    // parent's effects run after its children's, so anything read at this line
    // is what the previous commit left -- and a decision made on it is made
    // against a value the host has already replaced. By the time the microtask
    // runs, every effect in this commit has run, the form's write included.
    //
    // It also runs once the commit has flushed, which is what the events
    // themselves need: what they write is addressed to other fields, and those
    // are still mounting while this effect runs. Both reasons want the same
    // place, so there is one hop, not two.
    queueMicrotask(() => {
      if (replayedRef.current) {
        return
      }

      const { found, value: hostValue } = readHostEntry()

      const hasInitialSource = found || isValidValue(field.defaultValue)
      if (!hasInitialSource) {
        return
      }

      if (!field.event?.change) {
        replayedRef.current = true
        return
      }

      const resolvedValue = found ? hostValue : undefined

      // Held the way the field holds it, so the events fired at mount see the
      // same shape as the ones fired once the user has typed.
      const hydratedValue = holdValue(
        field,
        isValidValue(resolvedValue) ? resolvedValue : field.defaultValue
      )

      if (!isValidValue(hydratedValue)) {
        return
      }

      if (!isInitialReady(field, hydratedValue, data)) {
        return
      }

      replayedRef.current = true

      // Gone before the microtask ran. `onUnmount` took the field out of the
      // schema and its value with it, and an event sent on its behalf now
      // would write into a form that no longer has it.
      if (!getField(field.name)) {
        return
      }

      applyChangeEventsRef.current(
        buildInitialSelected(hydratedValue, data, entity)
      )
    })
  }, [
    applyChangeEventsRef,
    buildInitialSelected,
    data,
    entity,
    field,
    getField,
    hostFound,
    hostValue,
    isInitialReady,
    readHostEntry,
  ])

  // Until the mount-time run has happened, that run reads the host itself.
  useEffect(() => {
    const change = takeHostChange()
    if (!change || !replayedRef.current) {
      return
    }

    // Held nothing, the rules are undone as if the field were empty, the way a
    // hide withdraws them. See `withdrawStates`.
    applyStateEventsRef.current(
      isValidValue(change.value)
        ? buildInitialSelected(change.value, data, entity)
        : null
    )
  }, [
    applyStateEventsRef,
    buildInitialSelected,
    data,
    entity,
    // `useValue` takes a new default the way it takes the host's value.
    field.defaultValue,
    hostFound,
    hostValue,
    takeHostChange,
  ])

  return useCallback(() => {
    replayedRef.current = true
  }, [])
}
