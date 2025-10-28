"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { X, Settings2, Plus, Users as UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDirectorLabel } from "./lib/credit-utils"
import type { Director } from "./lib/types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  director: Director
  onDirectorChange: (director: Director) => void
  onAddEntry: () => void
  onManageUsers: () => void
  onManageEvents: () => void
}

export function DataTableToolbar<TData>({
  table,
  director,
  onDirectorChange,
  onAddEntry,
  onManageUsers,
  onManageEvents,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const directors: Director[] = ["procredits", "brotherhood", "fundraising", "service"]

  return (
    <div className="flex flex-col gap-4">
      {/* Director selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Director:</span>
        {directors.map((dir) => (
          <Button
            key={dir}
            variant={director === dir ? "default" : "outline"}
            size="sm"
            onClick={() => onDirectorChange(dir)}
          >
            {getDirectorLabel(dir)}
          </Button>
        ))}
      </div>

      {/* Toolbar actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          {/* Global search */}
          <Input
            placeholder="Filter members or events..."
            value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("userName")?.setFilterValue(event.target.value)
              table.getColumn("eventName")?.setFilterValue(event.target.value)
            }}
            className="h-8 w-[250px]"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Manage buttons */}
          <Button variant="outline" size="sm" onClick={onManageUsers} className="h-8">
            <UsersIcon className="mr-2 h-4 w-4" />
            Users
          </Button>

          <Button variant="outline" size="sm" onClick={onManageEvents} className="h-8">
            Events
          </Button>

          {/* Add entry button */}
          <Button size="sm" onClick={onAddEntry} className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>
    </div>
  )
}
