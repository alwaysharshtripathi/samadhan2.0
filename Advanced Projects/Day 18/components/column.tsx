"use client"

import type React from "react"

import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, MoreHorizontal, TrendingUp } from "lucide-react"
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

interface BoardColumn {
  id: string
  title: string
  tasks: Task[]
}

interface ColumnProps {
  column: BoardColumn
  onUpdateColumn: (column: BoardColumn) => void
  onDragStart: (task: Task, columnId: string) => void
  onDragEnd: () => void
  onDrop: (columnId: string, dropIndex?: number) => void
  draggedTask: Task | null
}

export function Column({ column, onUpdateColumn, onDragStart, onDragEnd, onDrop, draggedTask }: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const completedTasks = column.tasks.filter((task) => task.progress === 100).length
  const totalTasks = column.tasks.length
  const columnProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const avgProgress =
    totalTasks > 0 ? Math.round(column.tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalTasks) : 0

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        progress: 0,
        priority: "medium",
      }

      onUpdateColumn({
        ...column,
        tasks: [...column.tasks, newTask],
      })

      setNewTaskTitle("")
      setIsAddingTask(false)
    }
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
    }

    onUpdateColumn({
      ...column,
      tasks: [...column.tasks, newTask],
    })
  }

  const handleEditTask = (updatedTask: Task) => {
    onUpdateColumn({
      ...column,
      tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    })
  }

  const updateColumnTitle = () => {
    if (editTitle.trim()) {
      onUpdateColumn({
        ...column,
        title: editTitle.trim(),
      })
    }
    setIsEditingTitle(false)
  }

  const deleteTask = (taskId: string) => {
    onUpdateColumn({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverIndex(null)
    onDrop(column.id, dragOverIndex ?? undefined)
  }

  const handleTaskDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  return (
    <div className="flex-shrink-0 w-72">
      <Card
        className={`bg-muted/50 border-border transition-colors ${isDragOver ? "border-primary bg-primary/5" : ""}`}
      >
        <div className="p-4" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <div className="flex items-center justify-between mb-4">
            {isEditingTitle ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={updateColumnTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateColumnTitle()
                  if (e.key === "Escape") {
                    setEditTitle(column.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-sm font-semibold"
                autoFocus
              />
            ) : (
              <h3
                className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary"
                onClick={() => setIsEditingTitle(true)}
              >
                {column.title}
              </h3>
            )}

            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{column.tasks.length}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>Edit list name</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete list</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {totalTasks > 0 && (
            <div className="mb-4 p-2 bg-background/50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Progress</span>
                </div>
                <span className="text-xs font-medium">{columnProgress}%</span>
              </div>
              <Progress value={columnProgress} className="h-1 mb-1" />
              <div className="text-xs text-muted-foreground">
                {completedTasks}/{totalTasks} completed • Avg: {avgProgress}%
              </div>
            </div>
          )}

          <div className="space-y-3 mb-3">
            {column.tasks.map((task, index) => (
              <div key={task.id}>
                {draggedTask && dragOverIndex === index && (
                  <div className="h-2 bg-primary/20 rounded-sm mb-2 border-2 border-dashed border-primary" />
                )}
                <div onDragOver={(e) => handleTaskDragOver(e, index)}>
                  <TaskCard
                    task={task}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={handleEditTask}
                    onDragStart={() => onDragStart(task, column.id)}
                    onDragEnd={onDragEnd}
                    isDragging={draggedTask?.id === task.id}
                  />
                </div>
              </div>
            ))}
            {draggedTask && dragOverIndex === column.tasks.length && (
              <div className="h-2 bg-primary/20 rounded-sm border-2 border-dashed border-primary" />
            )}
            {draggedTask && <div className="h-8" onDragOver={(e) => handleTaskDragOver(e, column.tasks.length)} />}
          </div>

          {isAddingTask ? (
            <div className="space-y-2">
              <Input
                placeholder="Enter a title for this card..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask()
                  if (e.key === "Escape") {
                    setNewTaskTitle("")
                    setIsAddingTask(false)
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addTask}>
                  Add card
                </Button>
                <TaskDialog
                  mode="create"
                  trigger={
                    <Button variant="outline" size="sm">
                      Add detailed card
                    </Button>
                  }
                  onSave={handleCreateTask}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNewTaskTitle("")
                    setIsAddingTask(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a card
              </Button>
              <TaskDialog
                mode="create"
                trigger={
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground hover:text-foreground bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add detailed card
                  </Button>
                }
                onSave={handleCreateTask}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
