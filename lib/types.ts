export type FieldType = "text" | "select" | "textarea" | "radio" | "checkbox" | "upload"

export type ValidationRule = {
  type: string
  params: any[]
}

export interface FormField {
  id: string
  label: string
  placeholder: string
  type: FieldType
  validationType: "string" | "number"
  value: string
  options?: string[]
  validations: ValidationRule[]
}

// Add a function to parse JSON field definitions
export function parseFieldsFromJSON(json: string): FormField[] {
  try {
    const parsed = JSON.parse(json) as FormField[]

    // Validate the structure of each field
    return parsed.filter((field) => {
      return field.id && field.label && field.type && field.validationType && Array.isArray(field.validations)
    })
  } catch (error) {
    console.error("Failed to parse fields JSON:", error)
    throw error
  }
}
