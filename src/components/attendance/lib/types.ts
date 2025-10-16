// Attendance Table Types

export type Director = "procredits" | "brotherhood" | "fundraising" | "service" | "education" | "rush"

export type ProCreditStatus = "clear" | "yellow" | "green"

export interface User {
  id: string
  name: string
  active?: boolean
}

export interface Event {
  id: string
  eventName: string
  eventDate: string // ISO date string
  eventTime?: string // Time in HH:MM format
  location?: string
  director: Director
}

export interface Entry {
  id: string
  userId: string
  eventId: string
  credit: number | ProCreditStatus
  notes?: string
}

// Flattened row for the data table
export interface AttendanceRow {
  id: string // entry id
  userId: string
  userName: string
  eventId: string
  eventName: string
  eventDate: string
  director: Director
  credit: number | ProCreditStatus
  notes?: string
}
