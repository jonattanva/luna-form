import { Checkbox } from './components/ui/checkbox'
import { Input } from './components/ui/input'
import { Radio } from './components/ui/adapter/radio'
import { Select } from './components/ui/adapter/select'
import { Textarea } from './components/ui/textarea'

import {
  defineCheckbox,
  defineConfig,
  defineInput,
  defineRadio,
  defineSelect,
  defineTextArea,
} from 'luna-react/config'

export default defineConfig({
  inputs: [
    defineCheckbox(Checkbox),
    defineInput(Input),
    defineRadio(Radio),
    defineSelect(Select),
    defineTextArea(Textarea),
  ],
})
