"use client"

import * as React from "react"
import { DirectorTabs } from "./director-tabs"
import { SpreadsheetView } from "./spreadsheet-view"
import { AddEventDialog } from "./add-event-dialog"
import { EditEventDialog } from "./edit-event-dialog"
import { mockUsers, mockEvents, mockEntries } from "./lib/mock-data"
import type { User, Event, Entry, Director, ProCreditStatus } from "./lib/types"

export function AttendanceManager() {
  const [director, setDirector] = React.useState<Director>("procredits")
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [events, setEvents] = React.useState<Event[]>(mockEvents)
  const [entries, setEntries] = React.useState<Entry[]>(mockEntries)

  const [addEventDialogOpen, setAddEventDialogOpen] = React.useState(false)
  const [editEventDialogOpen, setEditEventDialogOpen] = React.useState(false)
  const [eventToEdit, setEventToEdit] = React.useState<Event | null>(null)

  // Pending changes for all cells (userId_eventId -> credit)
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, number | ProCreditStatus>>(new Map())
  const [savedEntries, setSavedEntries] = React.useState<Entry[]>(mockEntries)

  // Handle adding new event
  const handleAddEvent = (name: string, date: string) => {
    const newEvent: Event = {
      id: `e${Date.now()}`,
      eventName: name,
      eventDate: date,
      director,
    }
    setEvents((prev) => [...prev, newEvent])
  }

  // Handle editing event
  const handleEditEvent = (event: Event) => {
    setEventToEdit(event)
    setEditEventDialogOpen(true)
  }

  // Handle saving edited event
  const handleSaveEditedEvent = (updates: Partial<Event>) => {
    if (!eventToEdit) return

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventToEdit.id ? { ...event, ...updates } : event
      )
    )
    setEditEventDialogOpen(false)
    setEventToEdit(null)
  }

  // Handle deleting event
  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? All attendance data for this event will be lost.")) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
      setEntries((prev) => prev.filter((e) => e.eventId !== eventId))
      setPendingChanges((prev) => {
        const updated = new Map(prev)
        // Remove all pending changes for this event
        Array.from(updated.keys()).forEach((key) => {
          if (key.endsWith(`_${eventId}`)) {
            updated.delete(key)
          }
        })
        return updated
      })
    }
  }

  // Handle attendance update (stores in pending changes)
  const handleUpdateAttendance = (userId: string, eventId: string, credit: number | ProCreditStatus) => {
    setPendingChanges((prev) => {
      const updated = new Map(prev)
      const key = `${userId}_${eventId}`
      updated.set(key, credit)
      return updated
    })
  }

  // Save all pending changes
  const handleSaveAttendance = () => {
    const newEntries: Entry[] = []
    const updatedEntryIds = new Set<string>()

    // Convert pending changes to entries
    pendingChanges.forEach((credit, key) => {
      const [userId, eventId] = key.split("_")
      newEntries.push({
        id: `en${Date.now()}_${Math.random()}`,
        userId,
        eventId,
        credit,
      })
      updatedEntryIds.add(key)
    })

    // Update entries: remove old entries for changed cells, add new ones
    setEntries((prev) => {
      const filtered = prev.filter((entry) => {
        const key = `${entry.userId}_${entry.eventId}`
        return !updatedEntryIds.has(key)
      })
      return [...filtered, ...newEntries]
    })

    // Update saved entries and clear pending changes
    setSavedEntries((prev) => {
      const filtered = prev.filter((entry) => {
        const key = `${entry.userId}_${entry.eventId}`
        return !updatedEntryIds.has(key)
      })
      return [...filtered, ...newEntries]
    })

    setPendingChanges(new Map())
    alert("Attendance saved successfully!")
  }

  // Cancel pending changes
  const handleCancelChanges = () => {
    setPendingChanges(new Map())
    setEntries(savedEntries)
  }

  // Merge pending changes with existing entries for display
  const displayEntries = React.useMemo(() => {
    if (pendingChanges.size === 0) return entries

    // Create a map of current entries
    const entryMap = new Map<string, Entry>()
    entries.forEach((entry) => {
      const key = `${entry.userId}_${entry.eventId}`
      entryMap.set(key, entry)
    })

    // Apply pending changes
    pendingChanges.forEach((credit, key) => {
      const [userId, eventId] = key.split("_")
      entryMap.set(key, {
        id: `temp_${key}`,
        userId,
        eventId,
        credit,
      })
    })

    return Array.from(entryMap.values())
  }, [entries, pendingChanges])

  const hasChanges = pendingChanges.size > 0

  return (
    <div className="space-y-6">
      {/* Director Tabs */}
      <DirectorTabs value={director} onValueChange={setDirector} />

      {/* Spreadsheet View */}
      <SpreadsheetView
        users={users}
        events={events}
        entries={displayEntries}
        director={director}
        onUpdateAttendance={handleUpdateAttendance}
        onAddEvent={() => setAddEventDialogOpen(true)}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onSave={handleSaveAttendance}
        onCancel={handleCancelChanges}
        hasChanges={hasChanges}
      />

      {/* Add Event Dialog */}
      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
        director={director}
        onSave={handleAddEvent}
      />

      {/* Edit Event Dialog */}
      {eventToEdit && (
        <EditEventDialog
          open={editEventDialogOpen}
          onOpenChange={setEditEventDialogOpen}
          event={eventToEdit}
          onSave={handleSaveEditedEvent}
        />
      )}
    </div>
  )
}
