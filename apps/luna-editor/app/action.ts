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

  /*
  return {
    success: false,
    data: null,
    error: {
      title: 'Submission Failed',
      description: 'There was an error submitting the form.',
      details: {
        field1: ['Field1 is required.'],
        field2: ['Field2 must be a valid email address.'],
      },
    },
  }
    */
}
