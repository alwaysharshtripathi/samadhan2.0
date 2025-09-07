"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Reply, Heart, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  mentions?: string[]
  replies?: Comment[]
  likes?: string[]
}

interface CommentsSectionProps {
  taskId: string
  comments: Comment[]
  onAddComment: (content: string, mentions: string[]) => void
  onReplyComment: (commentId: string, content: string, mentions: string[]) => void
  onLikeComment: (commentId: string) => void
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

export function CommentsSection({
  taskId,
  comments,
  onAddComment,
  onReplyComment,
  onLikeComment,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+\s?\w*)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1].trim()
      const fullName = teamMembers.find((member) => member.toLowerCase().includes(mentionedName.toLowerCase()))
      if (fullName && !mentions.includes(fullName)) {
        mentions.push(fullName)
      }
    }

    return mentions
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const mentions = extractMentions(newComment)
      onAddComment(newComment.trim(), mentions)
      setNewComment("")
    }
  }

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      const mentions = extractMentions(replyContent)
      onReplyComment(commentId, replyContent.trim(), mentions)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const renderCommentContent = (content: string, mentions: string[] = []) => {
    let processedContent = content

    mentions.forEach((mention) => {
      const regex = new RegExp(`@${mention.split(" ").join("\\s?")}`, "gi")
      processedContent = processedContent.replace(
        regex,
        `<span class="bg-primary/10 text-primary px-1 rounded">@${mention}</span>`,
      )
    })

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MessageCircle className="h-4 w-4" />
        <span>Comments ({comments.length})</span>
      </div>

      {/* Add new comment */}
      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment... Use @name to mention team members"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Tip: Use @name to mention team members</div>
          <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-3 w-3 mr-1" />
            Comment
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials(comment.author)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </span>
                  {comment.mentions && comment.mentions.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      mentioned {comment.mentions.length} member{comment.mentions.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-card-foreground">
                  {renderCommentContent(comment.content, comment.mentions)}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onLikeComment(comment.id)}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${comment.likes?.length ? "fill-red-500 text-red-500" : ""}`} />
                    {comment.likes?.length || 0}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit comment</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete comment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={!replyContent.trim()}>
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                            {getInitials(reply.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <div className="text-xs text-card-foreground">
                            {renderCommentContent(reply.content, reply.mentions)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
