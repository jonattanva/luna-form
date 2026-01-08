import { Input } from "./components/ui/input";
import { Select } from "./components/ui/native-select";
import { Textarea } from "./components/ui/textarea";

import { 
    defineConfig, 
    defineInput, 
    defineSelect,
    defineTextArea, 
} from "react-luna-form/config";

export default defineConfig({
    inputs: [
        defineInput(Input),
        defineSelect(Select),
        defineTextArea(Textarea),
    ],
});
