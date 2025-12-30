import { Input } from './components/ui/input'
import { Select } from './components/ui/adapter/select'

import { defineConfig, defineInput, defineSelect } from 'react-luna-form/config'

export default defineConfig({
  inputs: [defineInput(Input), defineSelect(Select)],
})
