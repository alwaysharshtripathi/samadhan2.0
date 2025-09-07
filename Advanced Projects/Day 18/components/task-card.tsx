"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TaskDialog } from "@/components/task-dialog"
import { Calendar, MoreHorizontal, GripVertical, Eye, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  dueDate?: string
  progress?: number
  priority?: "low" | "medium" | "high"
}

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onEdit: (task: Task) => void
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export function TaskCard({ task, onDelete, onEdit, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart()
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <Card
      className={`bg-card hover:shadow-md transition-all cursor-pointer group ${
        isDragging ? "opacity-50 rotate-2 shadow-lg" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2 flex-1">
            <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            <TaskDialog
              task={task}
              mode="view"
              trigger={
                <h4 className="text-sm font-medium text-card-foreground leading-tight flex-1 text-pretty hover:text-primary cursor-pointer">
                  {task.title}
                </h4>
              }
              onSave={onEdit}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TaskDialog
                task={task}
                mode="view"
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="h-4 w-4 mr-2" />
                    View details
                  </DropdownMenuItem>
                }
                onSave={onEdit}
              />
              <TaskDialog
                task={task}
                mode="edit"
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit card
                  </DropdownMenuItem>
                }
                onSave={onEdit}
                onDelete={onDelete}
              />
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                Delete card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

        {task.progress !== undefined && task.progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-1" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.priority && (
              <Badge variant="outline" className={`text-xs px-2 py-0 ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </Card>
  )
}
