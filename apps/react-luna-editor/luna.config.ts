import { AlertForm } from './components/ui/alert-form'
import { Checkbox } from './components/ui/wrapper/checkbox'
import { Input } from './components/ui/input'
import { Radio } from './components/ui/wrapper/radio'
import { Select } from './components/ui/wrapper/select'
import { Switch } from './components/ui/wrapper/switch'
import { Textarea } from './components/ui/textarea'

import {
  defineCheckbox,
  defineConfig,
  defineCustomInput,
  defineInput,
  defineRadio,
  defineSelect,
  defineTextArea,
} from 'react-luna-form/config'

export default defineConfig({
  alert: AlertForm,
  inputs: [
    defineCheckbox(Checkbox),
    defineCustomInput('checkbox/switch', Switch),
    defineInput(Input),
    defineRadio(Radio),
    defineSelect(Select),
    defineTextArea(Textarea),
  ],
})
