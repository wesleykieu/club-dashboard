"use client"

import * as React from "react"
import { ArrowLeft, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreditsCell } from "./credits-cell"
import { creditToNumeric } from "./lib/credit-utils"
import type { Event, User, Entry, Director, ProCreditStatus } from "./lib/types"

interface EventAttendanceProps {
  event: Event
  users: User[]
  entries: Entry[]
  onBack: () => void
  onUpdateAttendance: (userId: string, credit: number | ProCreditStatus) => void
  onSave: () => void
  onEditEvent: () => void
}

export function EventAttendance({
  event,
  users,
  entries,
  onBack,
  onUpdateAttendance,
  onSave,
  onEditEvent,
}: EventAttendanceProps) {
  // Build a map of userId -> entry for this event
  const attendanceMap = React.useMemo(() => {
    const map = new Map<string, Entry>()
    entries.forEach((entry) => {
      if (entry.eventId === event.id) {
        map.set(entry.userId, entry)
      }
    })
    return map
  }, [entries, event.id])

  // Get default credit value based on director
  const getDefaultCredit = (director: Director): number | ProCreditStatus => {
    if (director === "procredits") return "clear"
    if (director === "brotherhood" || director === "education") return 0
    return 0
  }

  // Calculate totals
  const attendedCount = Array.from(attendanceMap.values()).filter((entry) => {
    const numeric = creditToNumeric(entry.credit, event.director)
    return numeric > 0
  }).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{event.eventName}</h1>
          <div className="space-y-1 text-muted-foreground">
            <p>
              {new Date(event.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {event.eventTime && ` at ${event.eventTime}`}
            </p>
            {event.location && <p>{event.location}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEditEvent}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>
            Track who attended and assign credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold">{attendedCount}/{users.length}</p>
              <p className="text-sm text-muted-foreground">Members Attended</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round((attendedCount / users.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Attendance</CardTitle>
          <CardDescription>
            Mark attendance and assign credits for each member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                const entry = attendanceMap.get(user.id)
                const credit = entry?.credit ?? getDefaultCredit(event.director)

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <CreditsCell
                        value={credit}
                        director={event.director}
                        onChange={(newCredit) => onUpdateAttendance(user.id, newCredit)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
