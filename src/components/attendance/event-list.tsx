"use client"

import * as React from "react"
import { Plus, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event, Entry, Director } from "./lib/types"

interface EventListProps {
  events: Event[]
  entries: Entry[]
  director: Director
  onEventClick: (eventId: string) => void
  onAddEvent: () => void
}

export function EventList({
  events,
  entries,
  director,
  onEventClick,
  onAddEvent,
}: EventListProps) {
  // Filter events by director
  const directorEvents = events.filter((e) => e.director === director)

  // Calculate attendance stats for each event
  const getEventStats = (eventId: string) => {
    const eventEntries = entries.filter((e) => e.eventId === eventId)
    const attended = eventEntries.length
    return { attended, total: 41 } // Total members
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Click on an event to track attendance
          </p>
        </div>
        <Button onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {directorEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No events yet</p>
            <Button onClick={onAddEvent} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {directorEvents.map((event) => {
            const stats = getEventStats(event.id)
            const percentage = Math.round((stats.attended / stats.total) * 100)

            return (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onEventClick(event.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{event.eventName}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {stats.attended}/{stats.total} attended
                      </span>
                    </div>
                    <Badge variant={percentage >= 70 ? "default" : "secondary"}>
                      {percentage}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
