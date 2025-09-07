"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { ActivityFeed } from "@/components/activity-feed"
import { CalendarIcon, Flag, Trash2, MessageCircle, Activity } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  dueDate?: string
  progress?: number
  priority?: "low" | "medium" | "high"
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  mentions?: string[]
  replies?: Comment[]
  likes?: string[]
}

interface ActivityItem {
  id: string
  type: "task_created" | "task_moved" | "task_updated" | "comment_added" | "user_assigned" | "task_completed"
  user: string
  timestamp: Date
  details: {
    taskTitle?: string
    fromColumn?: string
    toColumn?: string
    field?: string
    oldValue?: string
    newValue?: string
    comment?: string
    assignee?: string
  }
}

interface TaskDialogProps {
  task?: Task
  trigger: React.ReactNode
  onSave: (task: Omit<Task, "id"> | Task) => void
  onDelete?: () => void
  mode: "create" | "edit" | "view"
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

const teamMembers = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "Tom Brown",
  "Lisa Davis",
  "Alex Chen",
  "Emma Taylor",
]

// Mock data for comments and activity
const mockComments: Comment[] = [
  {
    id: "1",
    author: "Jane Smith",
    content: "I've started working on the wireframes. @John Doe could you review the initial concepts?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    mentions: ["John Doe"],
    likes: ["John Doe", "Mike Johnson"],
  },
  {
    id: "2",
    author: "John Doe",
    content: "Looks great! I'll review them by end of day.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
]

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "task_created",
    user: "John Doe",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    details: { taskTitle: "Design new landing page" },
  },
  {
    id: "2",
    type: "user_assigned",
    user: "John Doe",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    details: { taskTitle: "Design new landing page", assignee: "Jane Smith" },
  },
  {
    id: "3",
    type: "comment_added",
    user: "Jane Smith",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: { taskTitle: "Design new landing page", comment: "I've started working on the wireframes..." },
  },
]

export function TaskDialog({ task, trigger, onSave, onDelete, mode }: TaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [assignee, setAssignee] = useState(task?.assignee || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task.dueDate) : undefined)
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [progress, setProgress] = useState(task?.progress || 0)
  const [comments, setComments] = useState<Comment[]>(mockComments)

  const handleSave = () => {
    if (!title.trim()) return

    const taskData = {
      ...(task?.id && { id: task.id }),
      title: title.trim(),
      description: description.trim() || undefined,
      assignee: assignee || undefined,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : undefined,
      priority,
      progress,
    }

    onSave(taskData)
    setOpen(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setOpen(false)
    }
  }

  const handleAddComment = (content: string, mentions: string[]) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the logged-in user
      content,
      timestamp: new Date(),
      mentions,
      likes: [],
    }
    setComments([...comments, newComment])
  }

  const handleReplyComment = (commentId: string, content: string, mentions: string[]) => {
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: "Current User",
      content,
      timestamp: new Date(),
      mentions,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment,
      ),
    )
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes?.includes("Current User")
                ? comment.likes.filter((user) => user !== "Current User")
                : [...(comment.likes || []), "Current User"],
            }
          : comment,
      ),
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy")
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Task" : mode === "edit" ? "Edit Task" : "Task Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              {isReadOnly ? (
                <h2 className="text-lg font-semibold">{title}</h2>
              ) : (
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title..."
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isReadOnly ? (
                <p className="text-sm text-muted-foreground">{description || "No description provided"}</p>
              ) : (
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description..."
                  rows={3}
                />
              )}
            </div>

            {/* Comments and Activity Tabs */}
            {(mode === "view" || mode === "edit") && (
              <Tabs defaultValue="comments" className="w-full">
                <TabsList>
                  <TabsTrigger value="comments" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comments ({comments.length})
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activity
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-4">
                  <CommentsSection
                    taskId={task?.id || ""}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReplyComment={handleReplyComment}
                    onLikeComment={handleLikeComment}
                  />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <ActivityFeed activities={mockActivity} />
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Assignee */}
              <div className="space-y-2">
                <Label>Assignee</Label>
                {isReadOnly ? (
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(assignee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                ) : (
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee">
                        {assignee && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {getInitials(assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignee}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                {isReadOnly ? (
                  <Badge variant="outline" className={`w-fit ${priorityColors[priority]}`}>
                    <Flag className="h-3 w-3 mr-1" />
                    {priority}
                  </Badge>
                ) : (
                  <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                {isReadOnly ? (
                  <div className="flex items-center gap-2 text-sm">
                    {dueDate ? (
                      <>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(dueDate)}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No due date</span>
                    )}
                  </div>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? formatDate(dueDate) : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Label>Progress ({progress}%)</Label>
                {isReadOnly ? (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t">
              {mode !== "create" && onDelete && (
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  {isReadOnly ? "Close" : "Cancel"}
                </Button>
                {!isReadOnly && (
                  <Button onClick={handleSave} disabled={!title.trim()} className="flex-1">
                    {mode === "create" ? "Create" : "Save"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
