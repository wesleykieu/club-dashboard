"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { EditableCell } from "./editable-cell"
import { Plus, Pencil, Trash2, Save, X } from "lucide-react"
import type { User, Event, Entry, Director, ProCreditStatus } from "./lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SpreadsheetViewProps {
  users: User[]
  events: Event[]
  entries: Entry[]
  director: Director
  onUpdateAttendance: (userId: string, eventId: string, credit: number | ProCreditStatus) => void
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onSave: () => void
  onCancel: () => void
  hasChanges: boolean
}

export function SpreadsheetView({
  users,
  events,
  entries,
  director,
  onUpdateAttendance,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onSave,
  onCancel,
  hasChanges,
}: SpreadsheetViewProps) {
  // Filter events for the current director
  const directorEvents = React.useMemo(
    () => events.filter((event) => event.director === director),
    [events, director]
  )

  // Create a map for quick entry lookup
  const entryMap = React.useMemo(() => {
    const map = new Map<string, Entry>()
    entries.forEach((entry) => {
      const key = `${entry.userId}_${entry.eventId}`
      map.set(key, entry)
    })
    return map
  }, [entries])

  // Get credit value for a user-event combination
  const getCreditValue = (userId: string, eventId: string): number | ProCreditStatus => {
    const entry = entryMap.get(`${userId}_${eventId}`)
    if (entry) return entry.credit

    // Default values based on director type
    if (director === "procredits") return "clear"
    return 0
  }

  // Calculate total credits for a user
  const calculateTotal = (userId: string): number => {
    let total = 0
    directorEvents.forEach((event) => {
      const credit = getCreditValue(userId, event.id)
      if (typeof credit === "number") {
        total += credit
      } else {
        // Convert ProCreditStatus to number
        if (credit === "yellow") total += 0.5
        if (credit === "green") total += 1
      }
    })
    return total
  }

  // Split user names into first and last
  const parseUserName = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length === 1) return { firstName: parts[0], lastName: "" }
    const firstName = parts[0]
    const lastName = parts.slice(1).join(" ")
    return { firstName, lastName }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button onClick={onSave} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={onCancel} size="sm" variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
        <Button onClick={onAddEvent} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Spreadsheet table */}
      <div className="border border-border rounded-lg overflow-auto max-h-[calc(100vh-300px)]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="border border-border p-3 text-left font-semibold min-w-[120px] bg-muted">
                First Name
              </th>
              <th className="border border-border p-3 text-left font-semibold min-w-[120px] bg-muted">
                Last Name
              </th>
              {directorEvents.map((event) => (
                <th
                  key={event.id}
                  className="border border-border p-2 text-center font-semibold min-w-[150px] bg-muted"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex-1 text-sm">{event.eventName}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hover:bg-accent rounded p-1">
                            <span className="text-xs">⋮</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditEvent(event)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteEvent(event.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                </th>
              ))}
              <th className="border border-border p-3 text-center font-semibold min-w-[100px] bg-muted">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const { firstName, lastName } = parseUserName(user.name)
              return (
                <tr key={user.id} className="hover:bg-accent/20">
                  <td className="border border-border p-3 font-medium bg-background">
                    {firstName}
                  </td>
                  <td className="border border-border p-3 font-medium bg-background">
                    {lastName}
                  </td>
                  {directorEvents.map((event) => (
                    <EditableCell
                      key={`${user.id}_${event.id}`}
                      userId={user.id}
                      eventId={event.id}
                      value={getCreditValue(user.id, event.id)}
                      director={director}
                      onChange={(credit) => onUpdateAttendance(user.id, event.id, credit)}
                    />
                  ))}
                  <td className="border border-border p-3 text-center font-semibold bg-background">
                    {calculateTotal(user.id)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {directorEvents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No events for this director yet.</p>
          <Button onClick={onAddEvent} size="sm" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add First Event
          </Button>
        </div>
      )}
    </div>
  )
}
