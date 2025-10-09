'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "./ui/button"
import { Calendar } from "lucide-react"

export default function UpcomingEvents() {
  return (
    <Card className="flex flex-col h-[380px]">
    <CardHeader>
      <CardTitle>Calendar</CardTitle>
      <CardDescription>Upcoming Events</CardDescription>
      <CardAction>
        <Button>
          <Calendar/>
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
      <div className="h-full space-y-2">
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Mock Data</h1>
          <p>Event 1 description</p>
        </div>
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Event 2</h1>
          <p>Event 2 description</p>
        </div>
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Event 3</h1>
          <p>Event 3 description</p>
        </div>
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Event 3</h1>
          <p>Event 3 description</p>
        </div>
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Event 3</h1>
          <p>Event 3 description</p>
        </div>
        <div className="grid grid-cols-1 bg-accent rounded-md p-2">
          <h1>Event 3</h1>
          <p>Event 3 description</p>
        </div>
      </div>
      </ScrollArea>
    </CardContent>
    <CardFooter>
      <p>Pull top 3 events from master calender, updates once it pass</p>
    </CardFooter>
  </Card>
  )
}