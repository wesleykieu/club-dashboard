"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Director, ProCreditStatus } from "./lib/types"

interface CreditsCellProps {
  value: number | ProCreditStatus
  director: Director
  onChange: (value: number | ProCreditStatus) => void
}

export function CreditsCell({ value, director, onChange }: CreditsCellProps) {
  if (director === "procredits") {
    return <ProCreditsCell value={value as ProCreditStatus} onChange={onChange} />
  }

  if (director === "brotherhood" || director === "education") {
    return <BrotherhoodCell value={value as number} onChange={onChange} />
  }

  // fundraising, service, or rush
  return <NumericCell value={value as number} onChange={onChange} />
}

function ProCreditsCell({
  value,
  onChange,
}: {
  value: ProCreditStatus
  onChange: (value: ProCreditStatus) => void
}) {
  const options: { value: ProCreditStatus; label: string }[] = [
    { value: "clear", label: "No Credit" },
    { value: "yellow", label: "Half Credit" },
    { value: "green", label: "Full Credit" },
  ]

  return (
    <div className="flex items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-2 py-1 text-xs rounded border transition-colors
            ${
              value === option.value
                ? option.value === "clear"
                  ? "bg-gray-200 border-gray-400 text-gray-900"
                  : option.value === "yellow"
                  ? "bg-yellow-200 border-yellow-400 text-yellow-900"
                  : "bg-green-200 border-green-400 text-green-900"
                : "bg-background border-border hover:bg-accent"
            }
          `}
          aria-label={`Set credit to ${option.label}`}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function BrotherhoodCell({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const isChecked = value === 1

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`brotherhood-${Math.random()}`}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
        aria-label={isChecked ? "Here" : "Not here"}
      />
      <Label
        htmlFor={`brotherhood-${Math.random()}`}
        className="text-sm font-normal cursor-pointer"
      >
        {isChecked ? "Here" : "Not here"}
      </Label>
    </div>
  )
}

function NumericCell({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue)
    }
  }

  const increment = () => onChange(Math.round((value + 0.5) * 2) / 2)
  const decrement = () => onChange(Math.max(0, Math.round((value - 0.5) * 2) / 2))

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        step={0.5}
        min={0}
        className="w-20"
        aria-label="Credits"
      />
      <div className="flex flex-col">
        <button
          type="button"
          onClick={increment}
          className="px-2 text-xs hover:bg-accent rounded"
          aria-label="Increase by 0.5"
        >
          +
        </button>
        <button
          type="button"
          onClick={decrement}
          className="px-2 text-xs hover:bg-accent rounded"
          aria-label="Decrease by 0.5"
          disabled={value <= 0}
        >
          −
        </button>
      </div>
    </div>
  )
}
