"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserPlus, Mail, MoreHorizontal, Crown, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  avatar?: string
  isOnline: boolean
  lastActive: Date
}

interface TeamManagementProps {
  members: TeamMember[]
  onInviteMember: (email: string) => void
  onUpdateRole: (memberId: string, role: TeamMember["role"]) => void
  onRemoveMember: (memberId: string) => void
}

const roleIcons = {
  admin: Crown,
  member: Shield,
  viewer: Users,
}

const roleColors = {
  admin: "bg-yellow-100 text-yellow-800 border-yellow-200",
  member: "bg-blue-100 text-blue-800 border-blue-200",
  viewer: "bg-gray-100 text-gray-800 border-gray-200",
}

export function TeamManagement({ members, onInviteMember, onUpdateRole, onRemoveMember }: TeamManagementProps) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteMember(inviteEmail.trim())
      setInviteEmail("")
      setIsInviteOpen(false)
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Team ({members.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Team Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite new member */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address to invite..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInvite()
              }}
            />
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>

          {/* Team members list */}
          <div className="space-y-3">
            <h3 className="font-medium">Team Members ({members.length})</h3>
            <div className="space-y-2">
              {members.map((member) => {
                const RoleIcon = roleIcons[member.role]

                return (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            {member.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <Badge variant="outline" className={`text-xs ${roleColors[member.role]}`}>
                                <RoleIcon className="h-3 w-3 mr-1" />
                                {member.role}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.isOnline ? (
                                <span className="text-green-600">Online now</span>
                              ) : (
                                <span>Last active {formatLastActive(member.lastActive)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onUpdateRole(member.id, "admin")}>
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateRole(member.id, "member")}>
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateRole(member.id, "viewer")}>
                              Make Viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onRemoveMember(member.id)}>
                              Remove from team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Role descriptions */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Role Permissions</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="h-3 w-3 text-yellow-600" />
                <span>
                  <strong>Admin:</strong> Full access to all features and settings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-blue-600" />
                <span>
                  <strong>Member:</strong> Can create, edit, and manage tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-gray-600" />
                <span>
                  <strong>Viewer:</strong> Can view tasks and add comments
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
