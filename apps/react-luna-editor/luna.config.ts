import { AlertForm } from './components/ui/alert-form'
import { Checkbox } from './components/ui/wrapper/checkbox'
import { ComboboxWithGroup } from './components/ui/wrapper/combobox'
import { DayOfWeekWrapper } from './components/ui/wrapper/day-of-week'
import { Input } from './components/ui/input'
import { Radio } from './components/ui/wrapper/radio'
import { Select } from './components/ui/wrapper/select'
import { Switch } from './components/ui/wrapper/switch'
import { Textarea } from './components/ui/textarea'

import {
  defineCheckbox,
  defineChips,
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
    defineChips(DayOfWeekWrapper),
    defineInput(Input),
    defineRadio(Radio),
    defineSelect(Select),
    defineTextArea(Textarea),

    defineCustomInput('checkbox/switch', Switch),
    defineCustomInput('select/timezone', ComboboxWithGroup),
  ],
})
