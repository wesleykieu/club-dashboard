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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "./lib/types"

interface ManageUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
  onAddUser: (name: string) => void
  onDeleteUser: (id: string) => void
}

export function ManageUsersDialog({
  open,
  onOpenChange,
  users,
  onAddUser,
  onDeleteUser,
}: ManageUsersDialogProps) {
  const [newUserName, setNewUserName] = React.useState("")

  const handleAdd = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName.trim())
      setNewUserName("")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Delete this user? All their attendance entries will also be removed.")) {
      onDeleteUser(id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
          <DialogDescription>
            Add or remove members. Deleting a user will cascade delete all their
            attendance entries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new user */}
          <div className="flex items-end gap-2">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="new-user">New User</Label>
              <Input
                id="new-user"
                placeholder="Enter full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Users list */}
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No users yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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
