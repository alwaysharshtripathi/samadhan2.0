"use client"

import { useState } from "react"
import { Column } from "@/components/column"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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

const initialColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design new landing page",
        description: "Create wireframes and mockups for the new landing page",
        assignee: "John Doe",
        dueDate: "2024-01-15",
        progress: 0,
        priority: "high",
      },
      {
        id: "2",
        title: "Set up authentication",
        description: "Implement user login and registration system",
        assignee: "Jane Smith",
        dueDate: "2024-01-20",
        progress: 0,
        priority: "medium",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Build API endpoints",
        description: "Create REST API for user management",
        assignee: "Mike Johnson",
        dueDate: "2024-01-18",
        progress: 65,
        priority: "high",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "4",
        title: "Code review for payment system",
        description: "Review and test the new payment integration",
        assignee: "Sarah Wilson",
        dueDate: "2024-01-12",
        progress: 90,
        priority: "medium",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "5",
        title: "Database migration",
        description: "Migrate user data to new schema",
        assignee: "Tom Brown",
        dueDate: "2024-01-10",
        progress: 100,
        priority: "low",
      },
    ],
  },
]

export function Board() {
  const [columns, setColumns] = useState<BoardColumn[]>(initialColumns)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null)

  const addColumn = () => {
    const newColumn: BoardColumn = {
      id: `column-${Date.now()}`,
      title: "New List",
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task)
    setDraggedFromColumn(columnId)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedFromColumn(null)
  }

  const handleDrop = (targetColumnId: string, dropIndex?: number) => {
    if (!draggedTask || !draggedFromColumn) return

    if (draggedFromColumn === targetColumnId) {
      const sourceColumn = columns.find((col) => col.id === draggedFromColumn)
      if (sourceColumn && dropIndex !== undefined) {
        const currentIndex = sourceColumn.tasks.findIndex((task) => task.id === draggedTask.id)
        if (currentIndex === dropIndex) return
      }
    }

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns]

      const sourceColumnIndex = newColumns.findIndex((col) => col.id === draggedFromColumn)
      if (sourceColumnIndex !== -1) {
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          tasks: newColumns[sourceColumnIndex].tasks.filter((task) => task.id !== draggedTask.id),
        }
      }

      const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId)
      if (targetColumnIndex !== -1) {
        const targetTasks = [...newColumns[targetColumnIndex].tasks]
        if (dropIndex !== undefined && dropIndex >= 0) {
          targetTasks.splice(dropIndex, 0, draggedTask)
        } else {
          targetTasks.push(draggedTask)
        }

        newColumns[targetColumnIndex] = {
          ...newColumns[targetColumnIndex],
          tasks: targetTasks,
        }
      }

      return newColumns
    })
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onUpdateColumn={(updatedColumn) => {
            setColumns(columns.map((col) => (col.id === updatedColumn.id ? updatedColumn : col)))
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          draggedTask={draggedTask}
        />
      ))}

      <div className="flex-shrink-0">
        <Button
          variant="outline"
          className="h-12 w-72 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary bg-transparent"
          onClick={addColumn}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another list
        </Button>
      </div>
    </div>
  )
}
