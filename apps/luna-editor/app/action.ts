'use server'

export async function action<T>(formData: T) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    data: {
      message: 'Form submitted successfully',
      form: formData,
    },
    errors: null,
  }
}
