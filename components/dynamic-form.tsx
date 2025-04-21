"use client"

import { useState } from "react"
import { useFormik } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormField } from "@/lib/types"
import { buildValidationSchema } from "@/lib/validation"

interface DynamicFormProps {
  fields: FormField[]
}

export function DynamicForm({ fields }: DynamicFormProps) {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const initialValues = fields.reduce(
    (acc, field) => {
      if (field.type === "checkbox" && field.options) {
        acc[field.id] = []
      } else {
        acc[field.id] = field.value || ""
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const validationSchema = buildValidationSchema(fields)

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      setFormData(values)
      setFormSubmitted(true)
      console.log("Form submitted:", values)
    },
  })

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <h3 className="text-lg font-medium">No fields added yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Select field types from the sidebar to start building your form
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-6">
          {formSubmitted && (
            <Alert className="mb-6">
              <AlertDescription>Form submitted successfully!</AlertDescription>
            </Alert>
          )}

          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.validations.some((v) => v.type === "required") && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.validationType === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={formik.values[field.id] || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched[field.id] && formik.errors[field.id] ? "border-red-500" : ""}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  value={formik.values[field.id] || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched[field.id] && formik.errors[field.id] ? "border-red-500" : ""}
                />
              )}

              {field.type === "select" && field.options && (
                <Select
                  name={field.id}
                  value={formik.values[field.id] || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue(field.id, value)
                    formik.setFieldTouched(field.id, true, false)
                  }}
                >
                  <SelectTrigger
                    className={formik.touched[field.id] && formik.errors[field.id] ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "radio" && field.options && (
                <RadioGroup
                  name={field.id}
                  value={formik.values[field.id] || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue(field.id, value)
                    formik.setFieldTouched(field.id, true, false)
                  }}
                  className="flex flex-col space-y-1"
                >
                  {field.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.type === "checkbox" && field.options && (
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option}`}
                        checked={Array.isArray(formik.values[field.id]) && formik.values[field.id].includes(option)}
                        onCheckedChange={(checked) => {
                          let newValue = [...(formik.values[field.id] || [])]
                          if (checked) {
                            newValue.push(option)
                          } else {
                            newValue = newValue.filter((val) => val !== option)
                          }
                          formik.setFieldValue(field.id, newValue)
                          formik.setFieldTouched(field.id, true, false)
                        }}
                      />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "upload" && (
                <Input
                  id={field.id}
                  name={field.id}
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    formik.setFieldValue(field.id, file || "")
                    formik.setFieldTouched(field.id, true, false)
                  }}
                  className={formik.touched[field.id] && formik.errors[field.id] ? "border-red-500" : ""}
                />
              )}

              {formik.touched[field.id] && formik.errors[field.id] && (
                <p className="text-sm text-red-500 mt-1">{formik.errors[field.id] as string}</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            Submit Form
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
