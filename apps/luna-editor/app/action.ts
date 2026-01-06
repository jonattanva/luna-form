'use server'

export async function action() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    data: {
      message: 'Form submitted successfully',
    },
    errors: null,
  }
}
