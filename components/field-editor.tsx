"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FieldType, FormField } from "@/lib/types"
import { getDefaultValidationsForType } from "@/lib/validation"

interface FieldEditorProps {
  fieldType: FieldType
  onSave: (field: FormField) => void
  onCancel: () => void
}

export function FieldEditor({ fieldType, onSave, onCancel }: FieldEditorProps) {
  const [label, setLabel] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [options, setOptions] = useState("")

  const handleSave = () => {
    if (!label.trim()) return

    const id = label.toLowerCase().replace(/\s+/g, "_")
    const fieldOptions = options.split("\n").filter((opt) => opt.trim() !== "")

    // Determine if this should be a number field based on the label
    let validationType: "string" | "number" = "string"

    if (
      id.includes("phone") ||
      id.includes("number") ||
      id.includes("age") ||
      id.includes("count") ||
      id.includes("total") ||
      id.includes("quantity") ||
      id.includes("amount") ||
      id.includes("price")
    ) {
      validationType = "number"
    }

    const field: FormField = {
      id,
      label,
      placeholder,
      type: fieldType,
      validationType,
      value: "",
      validations: getDefaultValidationsForType(fieldType, id),
    }

    // Add email validation if the field appears to be an email field
    if (id.includes("email")) {
      field.validations.push({
        type: "email",
        params: ["Please enter a valid email address"],
      })
    }

    // Add specific validations based on field type
    if (validationType === "number") {
      // For number fields, add min validation
      field.validations.push({
        type: "min",
        params: [0, `${id} must be a positive number`],
      })
    }

    if (["select", "radio", "checkbox"].includes(fieldType) && fieldOptions.length > 0) {
      field.options = fieldOptions
    }

    onSave(field)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Field Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Enter field label" />
        </div>

        {(fieldType === "text" || fieldType === "textarea") && (
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {(fieldType === "select" || fieldType === "radio" || fieldType === "checkbox") && (
          <div className="space-y-2">
            <Label htmlFor="options">Options (one per line)</Label>
            <Textarea
              id="options"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Enter options (one per line)"
              className="min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Add Field</Button>
      </CardFooter>
    </Card>
  )
}
