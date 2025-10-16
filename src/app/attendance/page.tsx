import { AttendanceManager } from "@/components/attendance/AttendanceManager"

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
        <p className="text-muted-foreground">
          Manage attendance and credits for all directors
        </p>
      </div>

      <AttendanceManager />
    </div>
  )
}
