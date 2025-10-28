"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Director, ProCreditStatus } from "./lib/types"

interface EditableCellProps {
  value: number | ProCreditStatus
  director: Director
  onChange: (value: number | ProCreditStatus) => void
  userId: string
  eventId: string
}

export function EditableCell({ value, director, onChange, userId, eventId }: EditableCellProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempValue, setTempValue] = React.useState(value)
  const cellRef = React.useRef<HTMLTableCellElement>(null)

  React.useEffect(() => {
    setTempValue(value)
  }, [value])

  // Handle clicking outside to exit edit mode
  React.useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (event: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        handleSave()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isEditing, tempValue])

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const renderDisplayValue = () => {
    if (director === "procredits") {
      const status = value as ProCreditStatus
      if (status === "clear") return <span className="text-muted-foreground">-</span>
      if (status === "yellow") return <span className="text-yellow-600">Half</span>
      if (status === "green") return <span className="text-green-600">Full</span>
    }

    if (director === "brotherhood" || director === "education") {
      return value === 1 ? "✓" : "-"
    }

    return value || "-"
  }

  const renderEditMode = () => {
    if (director === "procredits") {
      return (
        <ProCreditsCellEdit
          value={tempValue as ProCreditStatus}
          onChange={setTempValue}
          onSave={handleSave}
        />
      )
    }

    if (director === "brotherhood" || director === "education") {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={tempValue === 1}
            onCheckedChange={(checked) => {
              const newValue = checked ? 1 : 0
              setTempValue(newValue)
              onChange(newValue)
              setIsEditing(false)
            }}
            autoFocus
          />
        </div>
      )
    }

    return (
      <NumericCellEdit
        value={tempValue as number}
        onChange={setTempValue}
        onKeyDown={handleKeyDown}
      />
    )
  }

  // Handle click - for brotherhood/education, toggle immediately
  const handleCellClick = () => {
    if (isEditing) return

    // For brotherhood/education, toggle immediately without entering edit mode
    if (director === "brotherhood" || director === "education") {
      const newValue = value === 1 ? 0 : 1
      onChange(newValue)
      return
    }

    // For other types, enter edit mode
    setIsEditing(true)
  }

  return (
    <td
      ref={cellRef}
      className={`
        border border-border p-2 text-center cursor-pointer min-w-[100px] h-[40px]
        hover:bg-accent/50 transition-colors
        ${isEditing ? "bg-accent" : ""}
      `}
      onClick={handleCellClick}
    >
      {isEditing ? renderEditMode() : renderDisplayValue()}
    </td>
  )
}

function ProCreditsCellEdit({
  value,
  onChange,
  onSave,
}: {
  value: ProCreditStatus
  onChange: (value: ProCreditStatus) => void
  onSave: () => void
}) {
  const options: { value: ProCreditStatus; label: string; color: string }[] = [
    { value: "clear", label: "None", color: "bg-gray-200 border-gray-400 text-gray-900" },
    { value: "yellow", label: "Half", color: "bg-yellow-200 border-yellow-400 text-yellow-900" },
    { value: "green", label: "Full", color: "bg-green-200 border-green-400 text-green-900" },
  ]

  return (
    <div className="flex items-center justify-center gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            onChange(option.value)
            onSave()
          }}
          className={`
            px-2 py-1 text-xs rounded border transition-colors
            ${value === option.value ? option.color : "bg-background border-border hover:bg-accent"}
          `}
          autoFocus={option.value === value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function NumericCellEdit({
  value,
  onChange,
  onKeyDown,
}: {
  value: number
  onChange: (value: number) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue)
    } else if (e.target.value === "") {
      onChange(0)
    }
  }

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      step={0.5}
      min={0}
      className="w-full h-8 text-center"
      autoFocus
    />
  )
}
