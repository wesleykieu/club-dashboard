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
import type { Director } from "./lib/types"

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  director: Director
  onSave: (name: string, date: string) => void
}

export function AddEventDialog({
  open,
  onOpenChange,
  director,
  onSave,
}: AddEventDialogProps) {
  const [eventName, setEventName] = React.useState("")
  const [eventDate, setEventDate] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setEventName("")
      setEventDate("")
    }
  }, [open])

  const handleSave = () => {
    if (!eventName.trim() || !eventDate) {
      alert("Please enter both event name and date.")
      return
    }

    onSave(eventName.trim(), eventDate)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event for {director}. You can add attendance after creating the event.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="e.g., Resume Workshop, Game Night"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event-date">Event Date</Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
