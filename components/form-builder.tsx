"use client"

import { useState } from "react"
import { FieldSidebar } from "@/components/field-sidebar"
import { FieldEditor } from "@/components/field-editor"
import { DynamicForm } from "@/components/dynamic-form"
import type { FieldType, FormField } from "@/lib/types"

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddField = (type: FieldType) => {
    setSelectedFieldType(type)
    setIsEditing(true)
  }

  const handleSaveField = (field: FormField) => {
    setFields((prev) => [...prev, field])
    setIsEditing(false)
    setSelectedFieldType(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedFieldType(null)
  }

  const handleLoadFields = (loadedFields: FormField[]) => {
    setFields(loadedFields)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-3">
        <FieldSidebar onAddField={handleAddField} onLoadFields={handleLoadFields} />
      </div>
      <div className="md:col-span-9">
        {isEditing && selectedFieldType ? (
          <FieldEditor fieldType={selectedFieldType} onSave={handleSaveField} onCancel={handleCancelEdit} />
        ) : (
          <DynamicForm fields={fields} />
        )}
      </div>
    </div>
  )
}
