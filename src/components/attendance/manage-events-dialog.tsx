"use client"

import * as React from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDirectorLabel } from "./lib/credit-utils"
import type { Event, Director } from "./lib/types"

interface ManageEventsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: Event[]
  onAddEvent: (name: string, date: string, director: Director) => void
  onDeleteEvent: (id: string) => void
}

export function ManageEventsDialog({
  open,
  onOpenChange,
  events,
  onAddEvent,
  onDeleteEvent,
}: ManageEventsDialogProps) {
  const [newEventName, setNewEventName] = React.useState("")
  const [newEventDate, setNewEventDate] = React.useState("")
  const [newEventDirector, setNewEventDirector] = React.useState<Director>("procredits")

  const handleAdd = () => {
    if (newEventName.trim() && newEventDate) {
      onAddEvent(newEventName.trim(), newEventDate, newEventDirector)
      setNewEventName("")
      setNewEventDate("")
      setNewEventDirector("procredits")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Delete this event? All attendance entries for this event will also be removed.")) {
      onDeleteEvent(id)
    }
  }

  const directors: Director[] = ["procredits", "brotherhood", "fundraising", "service"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Events</DialogTitle>
          <DialogDescription>
            Add or remove events. Deleting an event will cascade delete all
            attendance entries for that event.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new event */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
            <div className="grid gap-2">
              <Label htmlFor="new-event-name">Event Name</Label>
              <Input
                id="new-event-name"
                placeholder="Enter event name"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-event-date">Date</Label>
              <Input
                id="new-event-date"
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-event-director">Director</Label>
              <Select
                value={newEventDirector}
                onValueChange={(value) => setNewEventDirector(value as Director)}
              >
                <SelectTrigger id="new-event-director" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directors.map((dir) => (
                    <SelectItem key={dir} value={dir}>
                      {getDirectorLabel(dir)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Events list */}
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Director</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No events yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.eventName}</TableCell>
                      <TableCell>
                        {new Date(event.eventDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getDirectorLabel(event.director)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
