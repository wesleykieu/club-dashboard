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
import Link from "next/link"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function UpcomingEvents() {
  const { data, error, isLoading } = useSWR('http://localhost:8000/api/v1/calendar/upcoming', fetcher)
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <Card className="flex flex-col h-[380px]">
    <CardHeader>
      <CardTitle>Calendar</CardTitle>
      <CardDescription>Upcoming Events</CardDescription>
      <CardAction>
        <Button asChild>
          <Link href={process.env.NEXT_PUBLIC_MASTER_CALENDAR || "/calendar"}>
            <Calendar/>
          </Link>
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="flex-2 overflow-hidden">
    <ScrollArea className="h-full">
        <div className="h-full space-y-2">
          {data.events.map((event: any) => (
            <div key={event.id} className="flex gap-3 bg-accent rounded-lg p-3 hover:bg-accent/80 transition-colors">
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center bg-background rounded-md p-1 min-w-[60px] h-fit shadow-sm">
                <span className="text-2xl  leading-none">
                  {new Date(event.start).toLocaleDateString('en-US', {
                    day: 'numeric'
                  })}
                </span>
                <span className="text-xs uppercase text-muted-foreground font-medium">
                  {new Date(event.start).toLocaleDateString('en-US', {
                    month: 'short'
                  })}
                </span>
              </div>
              
              {/* Event Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-semibold text-base leading-tight truncate">
                  {event.title}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
    <CardFooter>
      <p>shout out secretary for the master calendar</p>
    </CardFooter>
  </Card>
  )
}