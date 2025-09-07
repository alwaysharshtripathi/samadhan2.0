"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react"

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

interface ProgressDashboardProps {
  columns: BoardColumn[]
}

const priorityColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
}

export function ProgressDashboard({ columns }: ProgressDashboardProps) {
  // Calculate overall statistics
  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0)
  const completedTasks = columns.reduce((sum, col) => sum + col.tasks.filter((task) => task.progress === 100).length, 0)
  const inProgressTasks = columns.reduce(
    (sum, col) => sum + col.tasks.filter((task) => (task.progress || 0) > 0 && task.progress !== 100).length,
    0,
  )
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate overdue tasks
  const today = new Date()
  const overdueTasks = columns.reduce((sum, col) => {
    return (
      sum +
      col.tasks.filter((task) => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return dueDate < today && task.progress !== 100
      }).length
    )
  }, 0)

  // Get unique assignees
  const assignees = Array.from(
    new Set(columns.flatMap((col) => col.tasks.map((task) => task.assignee).filter(Boolean))),
  )

  // Column progress data for chart
  const columnData = columns.map((col) => {
    const completed = col.tasks.filter((task) => task.progress === 100).length
    const total = col.tasks.length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      name: col.title,
      completed,
      total,
      progress,
      remaining: total - completed,
    }
  })

  // Priority distribution data
  const priorityData = [
    {
      name: "High",
      value: columns.reduce((sum, col) => sum + col.tasks.filter((task) => task.priority === "high").length, 0),
      color: priorityColors.high,
    },
    {
      name: "Medium",
      value: columns.reduce((sum, col) => sum + col.tasks.filter((task) => task.priority === "medium").length, 0),
      color: priorityColors.medium,
    },
    {
      name: "Low",
      value: columns.reduce((sum, col) => sum + col.tasks.filter((task) => task.priority === "low").length, 0),
      color: priorityColors.low,
    },
  ].filter((item) => item.value > 0)

  // Assignee progress data
  const assigneeData = assignees.map((assignee) => {
    const assigneeTasks = columns.flatMap((col) => col.tasks).filter((task) => task.assignee === assignee)
    const completed = assigneeTasks.filter((task) => task.progress === 100).length
    const total = assigneeTasks.length
    const avgProgress =
      total > 0 ? Math.round(assigneeTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / total) : 0

    return {
      assignee,
      completed,
      total,
      avgProgress,
    }
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Simple bar chart component using CSS
  const SimpleBarChart = ({ data }: { data: Array<{ name: string; completed: number; total: number }> }) => {
    const maxTotal = Math.max(...data.map((d) => d.total))

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">
                {item.completed}/{item.total}
              </span>
            </div>
            <div className="flex gap-1 h-6">
              <div
                className="bg-primary rounded-sm flex items-center justify-center text-xs text-primary-foreground font-medium"
                style={{ width: `${(item.completed / maxTotal) * 100}%` }}
              >
                {item.completed > 0 && item.completed}
              </div>
              <div
                className="bg-muted rounded-sm"
                style={{ width: `${((item.total - item.completed) / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Simple pie chart component using CSS
  const SimplePieChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {
                data.reduce(
                  (acc, item, index) => {
                    const percentage = (item.value / total) * 100
                    const strokeDasharray = `${percentage} ${100 - percentage}`
                    const strokeDashoffset = -acc
                    acc += percentage

                    return [
                      ...acc.segments,
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="15.915"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                      />,
                    ]
                  },
                  { segments: [] as React.ReactNode[], total: 0 },
                ).segments
              }
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed, {inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignees.length}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Column</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={columnData} />
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={priorityData} />
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assigneeData.map((member) => (
              <div key={member.assignee} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(member.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.assignee}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.completed}/{member.total} tasks completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.avgProgress}%</p>
                    <p className="text-xs text-muted-foreground">Avg Progress</p>
                  </div>
                  <Progress value={member.avgProgress} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Column Details */}
      <Card>
        <CardHeader>
          <CardTitle>Column Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => {
              const completed = column.tasks.filter((task) => task.progress === 100).length
              const total = column.tasks.length
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0

              return (
                <div key={column.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{column.title}</h4>
                    <Badge variant="outline">{total} tasks</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="text-xs text-muted-foreground">
                      {completed} completed, {total - completed} remaining
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
