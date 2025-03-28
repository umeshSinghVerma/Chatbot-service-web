"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Trash } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Chatbot = {
  id: string
  name: string
  createdAt: string
  prompt: string
  color?: string
  interactions?: number
}

export default function EditChatbot() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [botName, setBotName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [botColor, setBotColor] = useState("blue")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load chatbots from localStorage
    const storedChatbots = localStorage.getItem("chatbots")
    if (storedChatbots) {
      const chatbots: Chatbot[] = JSON.parse(storedChatbots)
      const chatbot = chatbots.find((bot) => bot.id === id)

      if (chatbot) {
        setBotName(chatbot.name)
        setSystemPrompt(chatbot.prompt)
        setBotColor(chatbot.color || "blue")
      } else {
        // Chatbot not found, redirect to chatbots page
        toast({
          title: "Chatbot not found",
          description: "The chatbot you're trying to edit doesn't exist.",
          variant: "destructive",
        })
        router.push("/chatbots")
      }
    }
    setIsLoading(false)
  }, [id, router])

  const handleSaveChatbot = () => {
    if (!botName || !systemPrompt) return

    // Get existing chatbots from localStorage
    const existingChatbotsJSON = localStorage.getItem("chatbots")
    const existingChatbots: Chatbot[] = existingChatbotsJSON ? JSON.parse(existingChatbotsJSON) : []

    // Find and update the chatbot
    const updatedChatbots = existingChatbots.map((bot) => {
      if (bot.id === id) {
        return {
          ...bot,
          name: botName,
          prompt: systemPrompt,
          color: botColor,
        }
      }
      return bot
    })

    // Save to localStorage
    localStorage.setItem("chatbots", JSON.stringify(updatedChatbots))

    // Show success toast
    toast({
      title: "Chatbot updated successfully!",
      description: `${botName} has been updated.`,
    })

    // Redirect to chatbots page
    router.push("/chatbots")
  }

  const handleDeleteChatbot = () => {
    // Get existing chatbots from localStorage
    const existingChatbotsJSON = localStorage.getItem("chatbots")
    const existingChatbots: Chatbot[] = existingChatbotsJSON ? JSON.parse(existingChatbotsJSON) : []

    // Filter out the chatbot to delete
    const updatedChatbots = existingChatbots.filter((bot) => bot.id !== id)

    // Save to localStorage
    localStorage.setItem("chatbots", JSON.stringify(updatedChatbots))

    // Show success toast
    toast({
      title: "Chatbot deleted",
      description: "The chatbot has been deleted successfully.",
    })

    // Redirect to chatbots page
    router.push("/chatbots")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-[200px] bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-[150px] bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/chatbots"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Chatbots
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Chatbot</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the chatbot and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteChatbot}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Chatbot Details</CardTitle>
            <CardDescription>Update your chatbot's name and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Chatbot"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Chatbot Color</Label>
              <Select value={botColor} onValueChange={setBotColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-600 mr-2"></div>
                      <span>Blue</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="green">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-green-600 mr-2"></div>
                      <span>Green</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="purple">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-purple-600 mr-2"></div>
                      <span>Purple</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="indigo">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-indigo-600 mr-2"></div>
                      <span>Indigo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="amber">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                      <span>Amber</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="You are a helpful assistant that answers questions about our products..."
                className="min-h-32"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The system prompt controls how your chatbot behaves and responds to user queries.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/chatbots")}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveChatbot}
              disabled={!botName || !systemPrompt}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

