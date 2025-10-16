"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditsCell } from "./credits-cell"
import { creditToNumeric } from "./lib/credit-utils"
import type { AttendanceRow, Director, ProCreditStatus } from "./lib/types"

interface ColumnsProps {
  director: Director
  onUpdateEntry: (id: string, credit: number | ProCreditStatus) => void
  onEditEntry: (row: AttendanceRow) => void
  onDeleteEntry: (id: string) => void
}

export function getColumns({
  director,
  onUpdateEntry,
  onEditEntry,
  onDeleteEntry,
}: ColumnsProps): ColumnDef<AttendanceRow>[] {
  return [
    // Row selection column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Member column
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Member
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("userName")}</div>,
    },

    // Event column
    {
      accessorKey: "eventName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("eventName")}</div>,
    },

    // Date column
    {
      accessorKey: "eventDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("eventDate"))
        return (
          <div>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.getValue("eventDate"))
        const dateB = new Date(rowB.getValue("eventDate"))
        return dateB.getTime() - dateA.getTime() // newest first
      },
    },

    // Credits column (dynamic)
    {
      accessorKey: "credit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Credits
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const credit = row.getValue("credit") as number | ProCreditStatus

        return (
          <CreditsCell
            value={credit}
            director={director}
            onChange={(newCredit) => onUpdateEntry(row.original.id, newCredit)}
          />
        )
      },
      sortingFn: (rowA, rowB) => {
        const creditA = creditToNumeric(
          rowA.getValue("credit") as number | ProCreditStatus,
          director
        )
        const creditB = creditToNumeric(
          rowB.getValue("credit") as number | ProCreditStatus,
          director
        )
        return creditA - creditB
      },
    },

    // Actions column
    {
      id: "actions",
      cell: ({ row }) => {
        const entry = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.id)}
              >
                Copy entry ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditEntry(entry)}>
                Edit entry
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteEntry(entry.id)}
                className="text-destructive"
              >
                Delete entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
