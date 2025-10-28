// Mock data for attendance table

import type { User, Event, Entry } from "./types"

export const mockUsers: User[] = [
  { id: "1", name: "Aashna Chadda", active: true },
  { id: "2", name: "Alina Nguyen", active: true },
  { id: "3", name: "Amogh Kuchibhotla", active: true },
  { id: "4", name: "Anthony Dang", active: true },
  { id: "5", name: "Ariana Vermeulen", active: true },
  { id: "6", name: "Arya Patel", active: true },
  { id: "7", name: "Brandon Nguyen", active: true },
  { id: "8", name: "Correy Le", active: true },
  { id: "9", name: "Curtis Ng", active: true },
  { id: "10", name: "Denzel Chima", active: true },
  { id: "11", name: "Dhanesh Manda", active: true },
  { id: "12", name: "Donovan Putthongvilai", active: true },
  { id: "13", name: "Emily Dang", active: true },
  { id: "14", name: "Enzo Teddy", active: true },
  { id: "15", name: "Fellip Oflas", active: true },
  { id: "16", name: "Gia Mitra", active: true },
  { id: "17", name: "Huy Vu", active: true },
  { id: "18", name: "Jade Lee", active: true },
  { id: "19", name: "Jaelyn Chen", active: true },
  { id: "20", name: "Jenny Zhu", active: true },
  { id: "21", name: "Jiya Patel", active: true },
  { id: "22", name: "Josephine Yu", active: true },
  { id: "23", name: "Kevin Huynh", active: true },
  { id: "24", name: "Kha-Ai Pham", active: true },
  { id: "25", name: "Lynsey Chau", active: true },
  { id: "26", name: "Michael Figueroa", active: true },
  { id: "27", name: "Michael Vo", active: true },
  { id: "28", name: "Nicholas Soukchareon", active: true },
  { id: "29", name: "Raymond Lei", active: true },
  { id: "30", name: "Robinson Doan", active: true },
  { id: "31", name: "Rogan Souter", active: true },
  { id: "32", name: "Roger Huynh", active: true },
  { id: "33", name: "Ryan Pham", active: true },
  { id: "34", name: "Salvador Elisondo", active: true },
  { id: "35", name: "Shawn Roxas", active: true },
  { id: "36", name: "Shreya Jayakumar", active: true },
  { id: "37", name: "Teluun (Mitch) Baterdene", active: true },
  { id: "38", name: "Thomson Truong", active: true },
  { id: "39", name: "Andrian Than", active: true },
  { id: "40", name: "Veronika Kudriavtceva", active: true },
  { id: "41", name: "Wesley Kieu", active: true },
]

export const mockEvents: Event[] = [
  // Pro-Credits events
  {
    id: "e1",
    eventName: "Resume Workshop",
    eventDate: "2025-10-01",
    eventTime: "18:00",
    location: "Student Center Room 201",
    director: "procredits",
  },
  {
    id: "e2",
    eventName: "LinkedIn Optimization",
    eventDate: "2025-10-08",
    eventTime: "19:00",
    location: "Zoom",
    director: "procredits",
  },
  {
    id: "e3",
    eventName: "Interview Skills Session",
    eventDate: "2025-10-15",
    eventTime: "17:30",
    location: "Business Building Room 105",
    director: "procredits",
  },

  // Brotherhood events
  {
    id: "e4",
    eventName: "Game Night",
    eventDate: "2025-10-05",
    eventTime: "20:00",
    location: "Chapter House",
    director: "brotherhood",
  },
  {
    id: "e5",
    eventName: "Big/Little Reveal",
    eventDate: "2025-10-12",
    eventTime: "18:30",
    location: "Campus Park",
    director: "brotherhood",
  },

  // Fundraising events
  {
    id: "e6",
    eventName: "Bake Sale",
    eventDate: "2025-10-03",
    eventTime: "10:00",
    location: "Student Union Plaza",
    director: "fundraising",
  },
  {
    id: "e7",
    eventName: "Car Wash",
    eventDate: "2025-10-10",
    eventTime: "09:00",
    location: "Campus Parking Lot B",
    director: "fundraising",
  },

  // Service events
  {
    id: "e8",
    eventName: "Food Bank Volunteering",
    eventDate: "2025-10-07",
    eventTime: "14:00",
    location: "Downtown Food Bank",
    director: "service",
  },
  {
    id: "e9",
    eventName: "Beach Cleanup",
    eventDate: "2025-10-14",
    eventTime: "08:00",
    location: "Santa Monica Beach",
    director: "service",
  },

  // Education events
  {
    id: "e10",
    eventName: "Financial Literacy Workshop",
    eventDate: "2025-10-02",
    eventTime: "19:00",
    location: "Business Building Room 201",
    director: "education",
  },
  {
    id: "e11",
    eventName: "Excel Skills Training",
    eventDate: "2025-10-09",
    eventTime: "18:30",
    location: "Computer Lab A",
    director: "education",
  },
  {
    id: "e12",
    eventName: "Guest Speaker: Marketing Trends",
    eventDate: "2025-10-16",
    eventTime: "19:30",
    location: "Auditorium",
    director: "education",
  },

  // Rush events
  {
    id: "e13",
    eventName: "Tabling 1",
    eventDate: "2025-08-25",
    eventTime: "10:00",
    location: "Student Union",
    director: "rush",
  },
  {
    id: "e14",
    eventName: "Meet the Chapter",
    eventDate: "2025-08-28",
    eventTime: "19:00",
    location: "Chapter House",
    director: "rush",
  },
  {
    id: "e15",
    eventName: "LinkedIn & Resume",
    eventDate: "2025-09-02",
    eventTime: "18:00",
    location: "Student Center Room 105",
    director: "rush",
  },
]

export const mockEntries: Entry[] = [
  // Pro-Credits entries
  { id: "en1", userId: "1", eventId: "e1", credit: "green" },
  { id: "en2", userId: "2", eventId: "e1", credit: "yellow" },
  { id: "en3", userId: "3", eventId: "e1", credit: "clear" },
  { id: "en4", userId: "1", eventId: "e2", credit: "green" },
  { id: "en5", userId: "4", eventId: "e2", credit: "yellow" },

  // Brotherhood entries
  { id: "en6", userId: "1", eventId: "e4", credit: 1 },
  { id: "en7", userId: "2", eventId: "e4", credit: 1 },
  { id: "en8", userId: "3", eventId: "e4", credit: 0 },
  { id: "en9", userId: "1", eventId: "e5", credit: 1 },
  { id: "en10", userId: "5", eventId: "e5", credit: 1 },

  // Fundraising entries
  { id: "en11", userId: "1", eventId: "e6", credit: 2 },
  { id: "en12", userId: "2", eventId: "e6", credit: 1.5 },
  { id: "en13", userId: "6", eventId: "e6", credit: 1 },
  { id: "en14", userId: "1", eventId: "e7", credit: 2.5 },

  // Service entries
  { id: "en15", userId: "1", eventId: "e8", credit: 3 },
  { id: "en16", userId: "7", eventId: "e8", credit: 2 },
  { id: "en17", userId: "8", eventId: "e9", credit: 1.5 },
  { id: "en18", userId: "1", eventId: "e9", credit: 2 },

  // Education entries
  { id: "en19", userId: "1", eventId: "e10", credit: 1 },
  { id: "en20", userId: "2", eventId: "e10", credit: 1 },
  { id: "en21", userId: "3", eventId: "e10", credit: 0 },
  { id: "en22", userId: "1", eventId: "e11", credit: 1 },
  { id: "en23", userId: "5", eventId: "e11", credit: 1 },

  // Rush entries
  { id: "en24", userId: "1", eventId: "e13", credit: 2.5 },
  { id: "en25", userId: "2", eventId: "e13", credit: 2 },
  { id: "en26", userId: "1", eventId: "e14", credit: 1 },
  { id: "en27", userId: "3", eventId: "e14", credit: 1 },
  { id: "en28", userId: "1", eventId: "e15", credit: 1 },
]
