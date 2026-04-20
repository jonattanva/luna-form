import { InputBase } from './input-base'
import type { InputCoreProps } from '../hook/use-input-core'
import type { InputStrategies } from './input-strategies'

export function createInput(strategies: InputStrategies) {
  return function CreateInput(props: InputCoreProps) {
    return <InputBase {...props} strategies={strategies} />
  }
}
