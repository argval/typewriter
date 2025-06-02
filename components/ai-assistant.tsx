"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Send, Loader2, Lightbulb, FileText, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  onCodeOptimize: (code: string) => Promise<string>
  onCodeExplain: (code: string) => Promise<string>
  onMarkdownEnhance: (content: string) => Promise<string>
  onGenerateContent: (prompt: string) => Promise<string>
}

export function AIAssistant({ onCodeOptimize, onCodeExplain, onMarkdownEnhance, onGenerateContent }: AIAssistantProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const handleAIAction = async (action: string, input: string) => {
    setIsLoading(true)
    setActiveFeature(action)

    try {
      let result = ""
      switch (action) {
        case "optimize":
          result = await onCodeOptimize(input)
          break
        case "explain":
          result = await onCodeExplain(input)
          break
        case "enhance":
          result = await onMarkdownEnhance(input)
          break
        case "generate":
          result = await onGenerateContent(input)
          break
      }
      setResponse(result)
      toast({
        title: "AI Assistant",
        description: "Task completed successfully!",
      })
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setActiveFeature(null)
    }
  }

  const quickActions = [
    {
      id: "explain",
      label: "Explain Code",
      icon: <Lightbulb className="h-4 w-4" />,
      description: "Get detailed explanations of code snippets",
    },
    {
      id: "optimize",
      label: "Optimize Code",
      icon: <Zap className="h-4 w-4" />,
      description: "Improve code performance and readability",
    },
    {
      id: "enhance",
      label: "Enhance Markdown",
      icon: <FileText className="h-4 w-4" />,
      description: "Improve markdown content structure and clarity",
    },
    {
      id: "generate",
      label: "Generate Content",
      icon: <Wand2 className="h-4 w-4" />,
      description: "Create new content based on your prompt",
    },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
        size="icon"
      >
        <Zap className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className="h-auto p-3 flex flex-col items-start gap-1"
              onClick={() => handleAIAction(action.id, prompt)}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
              </div>
              <span className="text-xs text-gray-500 text-left">{action.description}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Ask me anything or paste code/content to analyze..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <Button
            onClick={() => handleAIAction("generate", prompt)}
            disabled={isLoading || !prompt.trim()}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>

        {response && (
          <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">AI Response</Badge>
            </div>
            <div className="text-sm whitespace-pre-wrap">{response}</div>
          </div>
        )}

        {isLoading && activeFeature && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI is working on your request...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
