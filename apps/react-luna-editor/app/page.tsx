import { CodeEditor } from '@/components/ui/code-editor'
import { FormPreview } from '@/components/ui/form-preview'

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="h-full min-h-0 w-full min-w-0">
          <div className="flex h-full w-full flex-col lg:flex-row">
            <div className="hidden h-full max-w-lg flex-1 overflow-x-auto border-r lg:flex">
              <div className="relative flex h-full w-full flex-col items-stretch">
                <div className="flex flex-1 flex-col overflow-hidden outline-none">
                  <CodeEditor />
                </div>
              </div>
            </div>
            <FormPreview />
          </div>
        </div>
      </main>
    </div>
  )
}
