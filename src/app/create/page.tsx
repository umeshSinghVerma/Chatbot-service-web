"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Code } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function CreateChatbot() {
  const router = useRouter()
  const [step, setStep] = useState<"details" | "script">("details")
  const [botName, setBotName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [botColor, setBotColor] = useState("blue")

  const handleGenerateScript = () => {
    if (!botName || !systemPrompt) return
    setStep("script")
  }

  const handleSaveChatbot = () => {
    if (!botName || !systemPrompt) return

    // Generate a unique ID
    const newId = Date.now().toString()

    // Create new chatbot object
    const newChatbot = {
      id: newId,
      name: botName,
      createdAt: new Date().toISOString().split("T")[0],
      prompt: systemPrompt,
      color: botColor,
      interactions: 0,
    }

    // Get existing chatbots from localStorage
    const existingChatbotsJSON = localStorage.getItem("chatbots")
    const existingChatbots = existingChatbotsJSON ? JSON.parse(existingChatbotsJSON) : []

    // Add new chatbot to the list
    const updatedChatbots = [...existingChatbots, newChatbot]

    // Save to localStorage
    localStorage.setItem("chatbots", JSON.stringify(updatedChatbots))

    // Show success toast
    toast({
      title: "Chatbot created successfully!",
      description: `${botName} has been added to your chatbots.`,
      action: (
        <ToastAction altText="View Chatbots">
          <Link href="/chatbots">View Chatbots</Link>
        </ToastAction>
      ),
    })

    // Redirect to chatbots page
    router.push("/chatbots")
  }

  const embedScript = `<script>
  window.chatbotConfig = {
    name: "${botName}",
    systemPrompt: "${systemPrompt.replace(/"/g, '\\"')}"
  };
</script>
<script src="https://chatbot-creator.example.com/embed.js" async></script>
<div id="chatbot-container"></div>`

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
        <h1 className="mb-6 text-3xl font-bold">Create New Chatbot</h1>

        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="script" disabled={step === "details"}>
              Embed Script
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Chatbot Details</CardTitle>
                <CardDescription>Configure your chatbot's name and behavior</CardDescription>
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
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveChatbot}
                    disabled={!botName || !systemPrompt}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save Chatbot
                  </Button>
                  <Button onClick={handleGenerateScript} disabled={!botName || !systemPrompt}>
                    Generate Script
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="script">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Embed Script</CardTitle>
                <CardDescription>Copy this script and paste it into your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-md bg-muted p-4">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{embedScript}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-4"
                    onClick={() => {
                      navigator.clipboard.writeText(embedScript)
                      toast({
                        title: "Copied to clipboard",
                        description: "The embed script has been copied to your clipboard.",
                      })
                    }}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Back to Details
                </Button>
                <Button onClick={handleSaveChatbot} className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Save & Finish
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

