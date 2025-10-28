"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDirectorLabel } from "./lib/credit-utils"
import type { Director } from "./lib/types"

interface DirectorTabsProps {
  value: Director
  onValueChange: (director: Director) => void
}

export function DirectorTabs({ value, onValueChange }: DirectorTabsProps) {
  const directors: Director[] = ["procredits", "brotherhood", "fundraising", "service", "education", "rush"]

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as Director)}>
      <TabsList className="grid w-full grid-cols-6">
        {directors.map((director) => (
          <TabsTrigger key={director} value={director}>
            {getDirectorLabel(director)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
