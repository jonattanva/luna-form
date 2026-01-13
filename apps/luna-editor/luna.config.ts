import { AlertForm } from './components/ui/alert-form'
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
} from 'react-luna-form/config'

export default defineConfig({
  alert: AlertForm,
  inputs: [
    defineCheckbox(Checkbox),
    defineInput(Input),
    defineRadio(Radio),
    defineSelect(Select),
    defineTextArea(Textarea),
  ],
})
