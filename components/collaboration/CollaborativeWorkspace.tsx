'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  MessageSquare,
  Eye,
  Edit3,
  Clock,
  Send,
  AtSign,
  Paperclip,
  Image as ImageIcon,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
    role: 'owner' | 'editor' | 'viewer'
  }
  content: string
  timestamp: Date
  mentions: string[]
  attachments?: { name: string; type: string }[]
}

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  status: 'viewing' | 'editing'
  cursor?: { x: number; y: number }
}

export function CollaborativeWorkspace({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])

  useEffect(() => {
    // TODO: Connect to WebSocket for real-time collaboration
    // Simulated active users
    setActiveUsers([
      {
        id: '1',
        name: 'You',
        status: 'editing',
      },
    ])

    // Simulated comments (empty for new projects)
    setComments([])
  }, [projectId])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        role: 'owner',
      },
      content: newComment,
      timestamp: new Date(),
      mentions: [],
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const roleColors = {
    owner: 'bg-yellow-100 text-yellow-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800',
  }

  const statusIcons = {
    viewing: Eye,
    editing: Edit3,
  }

  return (
    <div className="space-y-6">
      {/* Active Collaborators */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Collaborators
              </CardTitle>
              <CardDescription>See who's working on this project in real-time</CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              {activeUsers.length} online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activeUsers.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No active collaborators</p>
              <p className="text-gray-400 text-xs mt-1">
                Invite team members to collaborate in real-time
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeUsers.map((user) => {
                const StatusIcon = statusIcons[user.status]
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusIcon className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 capitalize">{user.status}</span>
                        </div>
                      </div>
                    </div>
                    {user.status === 'editing' && (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-600">Live</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discussion Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion & Comments
          </CardTitle>
          <CardDescription>
            Collaborate with your team - Ask questions, share insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or mention someone with @..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="py-12 text-center border-t">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No comments yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Start a discussion with your team members
              </p>
            </div>
          ) : (
            <div className="space-y-4 border-t pt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <Badge className={roleColors[comment.author.role]} variant="outline">
                        {comment.author.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        {comment.attachments.map((attachment, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Track all changes made to this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Activity items would go here */}
            <div className="py-8 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs mt-1">
                Activity will appear as team members make changes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
