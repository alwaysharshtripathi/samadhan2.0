"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { TeamManagement } from "@/components/team-management"
import { Plus, Settings, BarChart3 } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  dueDate?: string
  progress?: number
  priority?: "low" | "medium" | "high"
}

interface BoardColumn {
  id: string
  title: string
  tasks: Task[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  avatar?: string
  isOnline: boolean
  lastActive: Date
}

interface HeaderProps {
  columns?: BoardColumn[]
  onAddList?: () => void
}

// Mock team data
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isOnline: true,
    lastActive: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "member",
    isOnline: true,
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "member",
    isOnline: false,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "viewer",
    isOnline: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export function Header({ columns = [], onAddList }: HeaderProps) {
  const handleInviteMember = (email: string) => {
    console.log("Inviting member:", email)
    // In a real app, this would send an invitation
  }

  const handleUpdateRole = (memberId: string, role: TeamMember["role"]) => {
    console.log("Updating role:", memberId, role)
    // In a real app, this would update the member's role
  }

  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId)
    // In a real app, this would remove the member
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Project Board</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Project Analytics</DialogTitle>
                </DialogHeader>
                <ProgressDashboard columns={columns} />
              </DialogContent>
            </Dialog>

            <TeamManagement
              members={mockTeamMembers}
              onInviteMember={handleInviteMember}
              onUpdateRole={handleUpdateRole}
              onRemoveMember={handleRemoveMember}
            />

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" onClick={onAddList}>
              <Plus className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
