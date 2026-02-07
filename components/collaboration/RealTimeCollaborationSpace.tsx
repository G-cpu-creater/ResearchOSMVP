'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  MessageSquare,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Pin,
  Clock,
  Globe,
  Zap,
  Send,
  FileText,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CollaboratorPresence {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'offline'
  location: string
  timezone: string
  lastSeen: Date
  currentView?: string
}

interface ChatMessage {
  id: string
  author: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'mention'
  attachments?: string[]
}

// Solves: Communication #1 challenge for remote workers (32.6M Americans remote by 2025)
// Async delays across time zones, documentation gaps, information silos
export function RealTimeCollaborationSpace({ projectId }: { projectId?: string }) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([
    {
      id: '1',
      name: 'You',
      role: 'Lead Researcher',
      status: 'active',
      location: 'Boston, MA',
      timezone: 'EST (UTC-5)',
      lastSeen: new Date(),
      currentView: 'Data Analysis',
    },
    {
      id: '2',
      name: 'Dr. Sarah Chen',
      role: 'Collaborator',
      status: 'active',
      location: 'Singapore',
      timezone: 'SGT (UTC+8)',
      lastSeen: new Date(Date.now() - 1000 * 30),
      currentView: 'Data Analysis',
    },
    {
      id: '3',
      name: 'Prof. James Wilson',
      role: 'Advisor',
      status: 'idle',
      location: 'London, UK',
      timezone: 'GMT (UTC+0)',
      lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    },
  ])

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      content: 'I just uploaded the latest EIS data from our Singapore facility. Can you review?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'message',
    },
    {
      id: '2',
      author: 'System',
      content: 'Prof. James Wilson joined the collaboration space',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      type: 'system',
    },
    {
      id: '3',
      author: 'You',
      content: '@Dr. Sarah Chen Looks great! The impedance values are consistent with our Boston runs.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'mention',
    },
  ])

  const [newMessage, setNewMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev =>
        prev.map(collab =>
          collab.status === 'active'
            ? { ...collab, lastSeen: new Date() }
            : collab
        )
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      author: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: newMessage.includes('@') ? 'mention' : 'message',
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Auto-scroll to bottom
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const startVideoCall = () => {
    setIsVideoOn(!isVideoOn)
    toast({
      title: isVideoOn ? 'Video stopped' : 'Video started',
      description: isVideoOn ? 'Camera disabled' : 'Camera enabled - sharing with team',
    })
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    toast({
      title: isMicOn ? 'Mic muted' : 'Mic unmuted',
      description: isMicOn ? 'Audio muted' : 'Audio enabled',
    })
  }

  const shareScreen = () => {
    toast({
      title: 'Screen sharing started',
      description: 'Team can now see your screen in real-time',
    })
  }

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getLocalTime = (timezone: string) => {
    // Simplified - in production would use actual timezone conversion
    const match = timezone.match(/UTC([+-]\d+)/)
    if (!match) return 'N/A'
    const offset = parseInt(match[1])
    const now = new Date()
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const local = new Date(utc + 3600000 * offset)
    return local.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const activeCount = collaborators.filter(c => c.status === 'active').length
  const totalCount = collaborators.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Real-Time Collaboration Space
            </CardTitle>
            <CardDescription>
              Solve async delays - 32.6M remote workers need instant collaboration across time zones
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              {activeCount} Live
            </Badge>
            <Badge variant="outline">{totalCount} Total</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active collaborators */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Active Collaborators</h3>
          <div className="space-y-2">
            {collaborators.map(collab => (
              <div
                key={collab.id}
                className={`p-3 border rounded-lg flex items-center gap-3 ${
                  collab.status === 'active'
                    ? 'bg-green-50 border-green-200'
                    : collab.status === 'idle'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {collab.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      collab.status === 'active'
                        ? 'bg-green-500'
                        : collab.status === 'idle'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{collab.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {collab.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {collab.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getLocalTime(collab.timezone)} local
                    </span>
                    {collab.currentView && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {collab.currentView}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeSince(collab.lastSeen)}</p>
                </div>

                {collab.status === 'active' && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video controls */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border">
          <Button
            variant={isVideoOn ? 'default' : 'outline'}
            size="sm"
            onClick={startVideoCall}
          >
            {isVideoOn ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
            {isVideoOn ? 'Stop Video' : 'Start Video'}
          </Button>
          <Button
            variant={isMicOn ? 'default' : 'outline'}
            size="sm"
            onClick={toggleMic}
          >
            {isMicOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
            {isMicOn ? 'Mute' : 'Unmute'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareScreen}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Screen
          </Button>
          <div className="ml-auto text-sm text-gray-600">
            {isVideoOn && '🔴 Recording'}
          </div>
        </div>

        {/* Chat */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Team Chat</h3>
          <div className="border rounded-lg">
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`${
                    msg.type === 'system'
                      ? 'text-center text-xs text-gray-500 italic'
                      : msg.type === 'mention'
                      ? 'bg-blue-50 p-3 rounded-lg border border-blue-200'
                      : 'p-3 bg-gray-50 rounded-lg'
                  }`}
                >
                  {msg.type !== 'system' && (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{msg.author}</span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      {msg.type === 'mention' && (
                        <Badge variant="outline" className="mt-2 bg-blue-100 text-blue-800 text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Mentioned you
                        </Badge>
                      )}
                    </>
                  )}
                  {msg.type === 'system' && <p>{msg.content}</p>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Type a message... (use @ to mention)"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-xs text-gray-600 mt-1">Active Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
              <p className="text-xs text-gray-600 mt-1">Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-purple-600">13h</p>
              <p className="text-xs text-gray-600 mt-1">Max Time Diff</p>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-emerald-900 mb-1">Why Real-Time Collaboration?</p>
              <ul className="text-emerald-700 text-xs space-y-1">
                <li>• <strong>32.6 million Americans</strong> will work remotely by 2025 (22% of workforce)</li>
                <li>• <strong>Communication #1 challenge</strong> for distributed teams</li>
                <li>• <strong>Async delays</strong> across time zones waste hours daily</li>
                <li>• <strong>Documentation gaps</strong> and information silos hurt productivity</li>
                <li>• <strong>Real-time presence</strong> shows who's viewing what, prevents duplicated work</li>
                <li>• <strong>Instant messaging</strong> with @mentions eliminates email delays</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
