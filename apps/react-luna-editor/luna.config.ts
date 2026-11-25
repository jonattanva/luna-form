import { AlertForm } from './components/ui/alert-form'
import { Checkbox } from './components/ui/wrapper/checkbox'
import { Chips } from './components/ui/wrapper/chips'
import { ComboboxWithGroup } from './components/ui/wrapper/combobox'
import { DatePickerInput } from './components/ui/wrapper/date-picker'
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
  // The hosts a source may call with an absolute URL; a relative one is this
  // page's and always called. The form in the editor can be written by an
  // agent, and a source's URL or body can carry what the person types to the
  // host it names: only the ones the tests use are let through.
  fetcher: {
    remotePatterns: [
      { hostname: 'jsonplaceholder.typicode.com', protocol: 'https' },
      { hostname: 'pokeapi.co', protocol: 'https' },
    ],
  },
  inputs: [
    defineCheckbox(Checkbox),
    defineChips(Chips),
    defineInput(Input),
    defineRadio(Radio),
    defineSelect(Select),
    defineTextArea(Textarea),

    defineCustomInput('checkbox/switch', Switch),
    defineCustomInput('chips/day', DayOfWeekWrapper),
    defineCustomInput('input/date', DatePickerInput),
    defineCustomInput('select/timezone', ComboboxWithGroup),

    // A type of the editor's own, written by an agent as a whole number.
    defineCustomInput('rating', Input, {
      agent: { schema: { maximum: 5, minimum: 1, type: 'integer' } },
    }),

    // A type of the editor's own that no agent writes, in any form.
    defineCustomInput('secret', Input, { agent: false }),
  ],
})
