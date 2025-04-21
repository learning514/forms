import * as Yup from "yup"
import type { FormField, ValidationRule } from "@/lib/types"

// This function is now only used for new fields created through the UI
export function getDefaultValidationsForType(type: string, id: string): ValidationRule[] {
  const validations: ValidationRule[] = [
    {
      type: "required",
      params: [`${id} is required`],
    },
  ]

  if (type === "text") {
    validations.push(
      {
        type: "min",
        params: [2, `${id} must be at least 2 characters`],
      },
      {
        type: "max",
        params: [50, `${id} cannot exceed 50 characters`],
      },
    )
  }

  if (type === "textarea") {
    validations.push({
      type: "min",
      params: [10, `${id} must be at least 10 characters`],
    })
  }

  return validations
}

export function buildValidationSchema(fields: FormField[]) {
  const schemaFields: Record<string, any> = {}

  fields.forEach((field) => {
    let schema: any

    // Set base schema type
    if (field.validationType === "string") {
      schema = Yup.string()
    } else if (field.validationType === "number") {
      schema = Yup.number().typeError(`${field.label} must be a number`)
    } else {
      schema = Yup.mixed()
    }

    // Apply all validations from the field definition
    field.validations.forEach((validation) => {
      const { type, params } = validation

      switch (type) {
        case "required":
          schema = schema.required(params[0])
          break
        case "min":
          if (field.validationType === "string") {
            schema = schema.min(params[0], params[1])
          } else if (field.validationType === "number") {
            schema = schema.min(params[0], params[1])
          }
          break
        case "max":
          if (field.validationType === "string") {
            schema = schema.max(params[0], params[1])
          } else if (field.validationType === "number") {
            schema = schema.max(params[0], params[1])
          }
          break
        case "email":
          if (field.validationType === "string") {
            schema = schema.email(params[0])
          }
          break
        // Add other validation types as needed
        default:
          break
      }
    })

    // Special handling for checkbox fields (array values)
    if (field.type === "checkbox") {
      const requiredMessage =
        field.validations.find((v) => v.type === "required")?.params[0] || "This field is required"
      schema = Yup.array().min(1, requiredMessage)
    }

    // Special handling for file uploads
    if (field.type === "upload") {
      const requiredMessage = field.validations.find((v) => v.type === "required")?.params[0] || "File is required"
      schema = Yup.mixed().test("fileRequired", requiredMessage, (value) => !!value)
    }

    schemaFields[field.id] = schema
  })

  return Yup.object().shape(schemaFields)
}
