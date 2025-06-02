"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageCircle, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline: boolean
  cursor?: { x: number; y: number }
  lastSeen: string
}

interface CollaborationProps {
  notebookId: string
  onInviteUser: (email: string) => void
}

export function Collaboration({ notebookId, onInviteUser }: CollaborationProps) {
  const { toast } = useToast()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      isOnline: true,
      lastSeen: "now",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      isOnline: false,
      lastSeen: "5 minutes ago",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      isOnline: true,
      lastSeen: "now",
    },
  ])
  const [inviteEmail, setInviteEmail] = useState("")
  const [showInvite, setShowInvite] = useState(false)

  // Simulate real-time collaboration updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((collaborator) => ({
          ...collaborator,
          isOnline: Math.random() > 0.3, // Randomly toggle online status
          cursor: collaborator.isOnline
            ? {
                x: Math.random() * 100,
                y: Math.random() * 100,
              }
            : undefined,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteUser(inviteEmail.trim())
      setInviteEmail("")
      setShowInvite(false)
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      })
    }
  }

  const onlineCollaborators = collaborators.filter((c) => c.isOnline)

  return (
    <div className="space-y-4">
      {/* Collaborators Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{onlineCollaborators.length} online</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowInvite(!showInvite)} className="gap-2">
          <UserPlus className="h-3 w-3" />
          Invite
        </Button>
      </div>

      {/* Online Collaborators */}
      <div className="flex -space-x-2">
        {onlineCollaborators.slice(0, 5).map((collaborator) => (
          <div key={collaborator.id} className="relative">
            <Avatar className="border-2 border-white dark:border-gray-800">
              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {collaborator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
        ))}
        {onlineCollaborators.length > 5 && (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-800">
            <span className="text-xs font-medium">+{onlineCollaborators.length - 5}</span>
          </div>
        )}
      </div>

      {/* Invite Section */}
      {showInvite && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Invite Collaborators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                className="text-sm"
              />
              <Button onClick={handleInvite} size="sm">
                Send
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Invited users will receive an email with access to this notebook.
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Collaborators List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">All Collaborators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{collaborator.name}</div>
                  <div className="text-xs text-gray-500">{collaborator.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={collaborator.isOnline ? "default" : "secondary"} className="text-xs">
                  {collaborator.isOnline ? "Online" : collaborator.lastSeen}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-gray-500">
            <span className="font-medium">Alice Johnson</span> edited a code cell • 2 minutes ago
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Carol Davis</span> added a markdown cell • 5 minutes ago
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">You</span> created this notebook • 1 hour ago
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
