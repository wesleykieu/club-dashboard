"use client"

import * as React from "react"
import { DirectorTabs } from "./director-tabs"
import { EventList } from "./event-list"
import { EventAttendance } from "./event-attendance"
import { AddEventDialog } from "./add-event-dialog"
import { EditEventDialog } from "./edit-event-dialog"
import { mockUsers, mockEvents, mockEntries } from "./lib/mock-data"
import type { User, Event, Entry, Director, ProCreditStatus } from "./lib/types"

export function AttendanceManager() {
  const [director, setDirector] = React.useState<Director>("procredits")
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [events, setEvents] = React.useState<Event[]>(mockEvents)
  const [entries, setEntries] = React.useState<Entry[]>(mockEntries)

  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null)
  const [addEventDialogOpen, setAddEventDialogOpen] = React.useState(false)
  const [editEventDialogOpen, setEditEventDialogOpen] = React.useState(false)

  // Pending changes for current event (before save)
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, number | ProCreditStatus>>(new Map())

  const selectedEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId)
    : null

  // Handle adding new event
  const handleAddEvent = (name: string, date: string) => {
    const newEvent: Event = {
      id: `e${Date.now()}`,
      eventName: name,
      eventDate: date,
      director,
    }
    setEvents((prev) => [...prev, newEvent])
    // Automatically open the new event for attendance
    setSelectedEventId(newEvent.id)
  }

  // Handle editing event
  const handleEditEvent = (updates: Partial<Event>) => {
    if (!selectedEventId) return

    setEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEventId ? { ...event, ...updates } : event
      )
    )
  }

  // Handle attendance update (stores in pending changes)
  const handleUpdateAttendance = (userId: string, credit: number | ProCreditStatus) => {
    setPendingChanges((prev) => {
      const updated = new Map(prev)
      updated.set(userId, credit)
      return updated
    })
  }

  // Save all pending changes for the current event
  const handleSaveAttendance = () => {
    if (!selectedEventId) return

    setEntries((prev) => {
      // Remove existing entries for this event
      const filtered = prev.filter((e) => e.eventId !== selectedEventId)

      // Add new entries from pending changes
      const newEntries: Entry[] = Array.from(pendingChanges.entries()).map(
        ([userId, credit]) => ({
          id: `en${Date.now()}_${userId}`,
          userId,
          eventId: selectedEventId,
          credit,
        })
      )

      return [...filtered, ...newEntries]
    })

    // Clear pending changes
    setPendingChanges(new Map())

    // Show success message
    alert("Attendance saved successfully!")
  }

  // When selecting an event, populate pending changes with existing entries
  React.useEffect(() => {
    if (selectedEventId) {
      const eventEntries = entries.filter((e) => e.eventId === selectedEventId)
      const changes = new Map<string, number | ProCreditStatus>()
      eventEntries.forEach((entry) => {
        changes.set(entry.userId, entry.credit)
      })
      setPendingChanges(changes)
    } else {
      setPendingChanges(new Map())
    }
  }, [selectedEventId, entries])

  // Merge pending changes with existing entries for display
  const displayEntries = React.useMemo(() => {
    if (!selectedEventId || pendingChanges.size === 0) return entries

    // Create new entries array with pending changes applied
    const filtered = entries.filter((e) => e.eventId !== selectedEventId)
    const updated: Entry[] = Array.from(pendingChanges.entries()).map(
      ([userId, credit]) => ({
        id: `temp_${userId}`,
        userId,
        eventId: selectedEventId,
        credit,
      })
    )

    return [...filtered, ...updated]
  }, [entries, selectedEventId, pendingChanges])

  return (
    <div className="space-y-6">
      {/* Director Tabs */}
      <DirectorTabs value={director} onValueChange={setDirector} />

      {/* Show either event list or event attendance */}
      {selectedEvent ? (
        <EventAttendance
          event={selectedEvent}
          users={users}
          entries={displayEntries}
          onBack={() => setSelectedEventId(null)}
          onUpdateAttendance={handleUpdateAttendance}
          onSave={handleSaveAttendance}
          onEditEvent={() => setEditEventDialogOpen(true)}
        />
      ) : (
        <EventList
          events={events}
          entries={entries}
          director={director}
          onEventClick={setSelectedEventId}
          onAddEvent={() => setAddEventDialogOpen(true)}
        />
      )}

      {/* Add Event Dialog */}
      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
        director={director}
        onSave={handleAddEvent}
      />

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <EditEventDialog
          open={editEventDialogOpen}
          onOpenChange={setEditEventDialogOpen}
          event={selectedEvent}
          onSave={handleEditEvent}
        />
      )}
    </div>
  )
}
