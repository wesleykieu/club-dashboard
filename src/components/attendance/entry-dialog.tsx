"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreditsCell } from "./credits-cell"
import type { User, Event, Entry, Director, ProCreditStatus } from "./lib/types"

interface EntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
  events: Event[]
  director: Director
  entry?: Entry | null
  onSave: (entry: Omit<Entry, "id">) => void
}

export function EntryDialog({
  open,
  onOpenChange,
  users,
  events,
  director,
  entry,
  onSave,
}: EntryDialogProps) {
  const [selectedUserId, setSelectedUserId] = React.useState<string>("")
  const [selectedEventId, setSelectedEventId] = React.useState<string>("")
  const [credit, setCredit] = React.useState<number | ProCreditStatus>(
    director === "procredits" ? "clear" : director === "brotherhood" ? 0 : 0
  )

  const filteredEvents = events.filter((e) => e.director === director)

  // Initialize form when entry or dialog opens
  React.useEffect(() => {
    if (open) {
      if (entry) {
        setSelectedUserId(entry.userId)
        setSelectedEventId(entry.eventId)
        setCredit(entry.credit)
      } else {
        // Reset for new entry
        setSelectedUserId("")
        setSelectedEventId("")
        setCredit(
          director === "procredits" ? "clear" : director === "brotherhood" ? 0 : 0
        )
      }
    }
  }, [open, entry, director])

  const handleSave = () => {
    if (!selectedUserId || !selectedEventId) {
      alert("Please select both a member and an event.")
      return
    }

    onSave({
      userId: selectedUserId,
      eventId: selectedEventId,
      credit,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Entry" : "Add Entry"}</DialogTitle>
          <DialogDescription>
            {entry
              ? "Update the attendance entry details."
              : "Add a new attendance entry for the selected director."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Member selection */}
          <div className="grid gap-2">
            <Label htmlFor="member">Member</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="member">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event selection */}
          <div className="grid gap-2">
            <Label htmlFor="event">Event ({director})</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger id="event">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {filteredEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.eventName} ({new Date(event.eventDate).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Credits input */}
          <div className="grid gap-2">
            <Label>Credits</Label>
            <CreditsCell value={credit} director={director} onChange={setCredit} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
