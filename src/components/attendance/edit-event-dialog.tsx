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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Event } from "./lib/types"

interface EditEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
  onSave: (updates: Partial<Event>) => void
}

export function EditEventDialog({
  open,
  onOpenChange,
  event,
  onSave,
}: EditEventDialogProps) {
  const [eventName, setEventName] = React.useState(event.eventName)
  const [eventDate, setEventDate] = React.useState(event.eventDate)
  const [eventTime, setEventTime] = React.useState(event.eventTime || "")
  const [location, setLocation] = React.useState(event.location || "")

  React.useEffect(() => {
    if (open) {
      setEventName(event.eventName)
      setEventDate(event.eventDate)
      setEventTime(event.eventTime || "")
      setLocation(event.location || "")
    }
  }, [open, event])

  const handleSave = () => {
    if (!eventName.trim() || !eventDate) {
      alert("Please enter both event name and date.")
      return
    }

    onSave({
      eventName: eventName.trim(),
      eventDate,
      eventTime: eventTime || undefined,
      location: location.trim() || undefined,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Event Details</DialogTitle>
          <DialogDescription>
            Update the event information below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-event-name">Event Name</Label>
            <Input
              id="edit-event-name"
              placeholder="e.g., Resume Workshop, Game Night"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-event-date">Event Date</Label>
            <Input
              id="edit-event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-event-time">Event Time (Optional)</Label>
            <Input
              id="edit-event-time"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="HH:MM"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-location">Location (Optional)</Label>
            <Input
              id="edit-location"
              placeholder="e.g., Zoom, Student Center Room 201"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
