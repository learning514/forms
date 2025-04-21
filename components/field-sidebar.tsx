"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, ListFilter, AlignLeft, CircleDot, CheckSquare, Upload, FileJson } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FieldType } from "@/lib/types"
import { parseFieldsFromJSON } from "@/lib/types"

interface FieldSidebarProps {
  onAddField: (type: FieldType) => void
  onLoadFields?: (fields: any[]) => void
}

const fieldTypes = [
  { type: "text" as FieldType, label: "Text", icon: Type },
  { type: "select" as FieldType, label: "Select", icon: ListFilter },
  { type: "textarea" as FieldType, label: "Textarea", icon: AlignLeft },
  { type: "radio" as FieldType, label: "Radio", icon: CircleDot },
  { type: "checkbox" as FieldType, label: "Checkbox", icon: CheckSquare },
  { type: "upload" as FieldType, label: "Upload", icon: Upload },
]

export function FieldSidebar({ onAddField, onLoadFields }: FieldSidebarProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const [jsonSuccess, setJsonSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLoadFromJSON = () => {
    if (!jsonInput.trim() || !onLoadFields) {
      setJsonError("Please enter JSON data")
      return
    }

    try {
      const fields = parseFieldsFromJSON(jsonInput)
      if (fields.length > 0) {
        onLoadFields(fields)
        setJsonSuccess(`Successfully loaded ${fields.length} fields`)
        setJsonError("")
        setTimeout(() => {
          setIsDialogOpen(false)
          setJsonSuccess("")
        }, 1500)
      } else {
        setJsonError("No valid fields found in JSON")
      }
    } catch (error) {
      setJsonError("Invalid JSON format")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Field</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {fieldTypes.map((field) => (
          <Button key={field.type} variant="outline" className="justify-start" onClick={() => onAddField(field.type)}>
            <field.icon className="mr-2 h-4 w-4" />
            {field.label}
          </Button>
        ))}

        {onLoadFields && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="justify-start">
                <FileJson className="mr-2 h-4 w-4" />
                Load from JSON
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Fields from JSON</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
                {jsonSuccess && (
                  <Alert>
                    <AlertDescription>{jsonSuccess}</AlertDescription>
                  </Alert>
                )}
                <Textarea
                  placeholder="Paste your JSON field definitions here"
                  className="min-h-[200px]"
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value)
                    setJsonError("")
                  }}
                />
                <Button onClick={handleLoadFromJSON}>Load Fields</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
