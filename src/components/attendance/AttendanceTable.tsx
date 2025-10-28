"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { DataTableToolbar } from "./data-table-toolbar"
import { getColumns } from "./columns"
import { EntryDialog } from "./entry-dialog"
import { ManageUsersDialog } from "./manage-users-dialog"
import { ManageEventsDialog } from "./manage-events-dialog"
import { mockUsers, mockEvents, mockEntries } from "./lib/mock-data"
import { creditToNumeric } from "./lib/credit-utils"
import type {
  User,
  Event,
  Entry,
  AttendanceRow,
  Director,
  ProCreditStatus,
} from "./lib/types"

export function AttendanceTable() {
  const [director, setDirector] = React.useState<Director>("procredits")
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [events, setEvents] = React.useState<Event[]>(mockEvents)
  const [entries, setEntries] = React.useState<Entry[]>(mockEntries)

  // Dialog states
  const [entryDialogOpen, setEntryDialogOpen] = React.useState(false)
  const [usersDialogOpen, setUsersDialogOpen] = React.useState(false)
  const [eventsDialogOpen, setEventsDialogOpen] = React.useState(false)
  const [editingEntry, setEditingEntry] = React.useState<Entry | null>(null)

  // Build flattened rows for the current director
  const rows = React.useMemo<AttendanceRow[]>(() => {
    const directorEvents = events.filter((e) => e.director === director)
    const directorEventIds = new Set(directorEvents.map((e) => e.id))

    return entries
      .filter((entry) => directorEventIds.has(entry.eventId))
      .map((entry) => {
        const user = users.find((u) => u.id === entry.userId)
        const event = events.find((e) => e.id === entry.eventId)

        return {
          id: entry.id,
          userId: entry.userId,
          userName: user?.name || "Unknown",
          eventId: entry.eventId,
          eventName: event?.eventName || "Unknown",
          eventDate: event?.eventDate || "",
          director: event?.director || director,
          credit: entry.credit,
          notes: entry.notes,
        }
      })
  }, [entries, events, users, director])

  // Entry CRUD
  const handleSaveEntry = (entryData: Omit<Entry, "id">) => {
    if (editingEntry) {
      // Update existing
      setEntries((prev) =>
        prev.map((e) => (e.id === editingEntry.id ? { ...e, ...entryData } : e))
      )
      setEditingEntry(null)
    } else {
      // Add new
      const newEntry: Entry = {
        ...entryData,
        id: `en${Date.now()}`,
      }
      setEntries((prev) => [...prev, newEntry])
    }
  }

  const handleUpdateEntry = (id: string, credit: number | ProCreditStatus) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, credit } : entry))
    )
  }

  const handleEditEntry = (row: AttendanceRow) => {
    const entry = entries.find((e) => e.id === row.id)
    if (entry) {
      setEditingEntry(entry)
      setEntryDialogOpen(true)
    }
  }

  const handleDeleteEntry = (id: string) => {
    if (confirm("Delete this entry?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id))
    }
  }

  // User CRUD
  const handleAddUser = (name: string) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      active: true,
    }
    setUsers((prev) => [...prev, newUser])
  }

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    // Cascade delete entries
    setEntries((prev) => prev.filter((e) => e.userId !== id))
  }

  // Event CRUD
  const handleAddEvent = (name: string, date: string, director: Director) => {
    const newEvent: Event = {
      id: `e${Date.now()}`,
      eventName: name,
      eventDate: date,
      director,
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    // Cascade delete entries
    setEntries((prev) => prev.filter((e) => e.eventId !== id))
  }

  // Compute totals
  const totals = React.useMemo(() => {
    const userTotals: Record<string, number> = {}
    rows.forEach((row) => {
      const numericCredit = creditToNumeric(row.credit, director)
      userTotals[row.userId] = (userTotals[row.userId] || 0) + numericCredit
    })
    return userTotals
  }, [rows, director])

  const columns = React.useMemo(
    () =>
      getColumns({
        director,
        onUpdateEntry: handleUpdateEntry,
        onEditEntry: handleEditEntry,
        onDeleteEntry: handleDeleteEntry,
      }),
    [director]
  )

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => (
          <DataTableToolbar
            table={table}
            director={director}
            onDirectorChange={setDirector}
            onAddEntry={() => {
              setEditingEntry(null)
              setEntryDialogOpen(true)
            }}
            onManageUsers={() => setUsersDialogOpen(true)}
            onManageEvents={() => setEventsDialogOpen(true)}
          />
        )}
      />

      {/* Totals summary */}
      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold mb-2">Member Totals ({director})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {users.map((user) => {
            const total = totals[user.id] || 0
            return (
              <div key={user.id} className="flex justify-between">
                <span className="truncate">{user.name}:</span>
                <span className="font-medium ml-2">{total.toFixed(1)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dialogs */}
      <EntryDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        users={users}
        events={events}
        director={director}
        entry={editingEntry}
        onSave={handleSaveEntry}
      />

      <ManageUsersDialog
        open={usersDialogOpen}
        onOpenChange={setUsersDialogOpen}
        users={users}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />

      <ManageEventsDialog
        open={eventsDialogOpen}
        onOpenChange={setEventsDialogOpen}
        events={events}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  )
}
