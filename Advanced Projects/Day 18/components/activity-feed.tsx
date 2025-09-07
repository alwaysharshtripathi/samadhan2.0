"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, MessageCircle, ArrowRight, Plus, Edit, UserPlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const activityIcons = {
  task_created: Plus,
  task_moved: ArrowRight,
  task_updated: Edit,
  comment_added: MessageCircle,
  user_assigned: UserPlus,
  task_completed: Activity,
}

const activityColors = {
  task_created: "text-green-600",
  task_moved: "text-blue-600",
  task_updated: "text-yellow-600",
  comment_added: "text-purple-600",
  user_assigned: "text-cyan-600",
  task_completed: "text-emerald-600",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getActivityDescription = (activity: ActivityItem) => {
    const { type, details } = activity

    switch (type) {
      case "task_created":
        return (
          <span>
            created task <strong>{details.taskTitle}</strong>
          </span>
        )
      case "task_moved":
        return (
          <span>
            moved <strong>{details.taskTitle}</strong> from{" "}
            <Badge variant="outline" className="mx-1">
              {details.fromColumn}
            </Badge>
            to
            <Badge variant="outline" className="mx-1">
              {details.toColumn}
            </Badge>
          </span>
        )
      case "task_updated":
        return (
          <span>
            updated <strong>{details.field}</strong> of <strong>{details.taskTitle}</strong>
            {details.oldValue && details.newValue && (
              <span>
                {" "}
                from <em>{details.oldValue}</em> to <em>{details.newValue}</em>
              </span>
            )}
          </span>
        )
      case "comment_added":
        return (
          <span>
            commented on <strong>{details.taskTitle}</strong>
            {details.comment && (
              <div className="mt-1 text-xs text-muted-foreground italic">
                "{details.comment.length > 50 ? details.comment.substring(0, 50) + "..." : details.comment}"
              </div>
            )}
          </span>
        )
      case "user_assigned":
        return (
          <span>
            assigned <strong>{details.assignee}</strong> to <strong>{details.taskTitle}</strong>
          </span>
        )
      case "task_completed":
        return (
          <span>
            completed task <strong>{details.taskTitle}</strong>
          </span>
        )
      default:
        return <span>performed an action</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = activityIcons[activity.type]
                const colorClass = activityColors[activity.type]

                return (
                  <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0">
                      <div className={`p-1.5 rounded-full bg-muted ${colorClass}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{activity.user}</span> {getActivityDescription(activity)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
