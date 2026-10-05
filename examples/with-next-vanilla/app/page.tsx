import config from '@/luna.config'
import form from './form.json'
import { Form } from "react-luna-form/server";
import { connection } from "next/server";

export default async function Page() {
  // The form keeps no clock: the years the expiry offers are counted here, on
  // every request, and handed over in `context`.
  await connection();
  const year = new Date().getFullYear();
  const context = { years: { current: year, inSix: year + 6 } };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full max-w-md mx-auto">
          <Form {...form} config={config} context={context} />
        </div>
      </main>
    </div>
  );
}
