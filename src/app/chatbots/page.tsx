"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Code, Edit, MoreHorizontal, PlusCircle, Trash, MessageSquare, Activity, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RedirectToSignIn, useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient";

// Type definition for a chatbot
type Chatbot = {
  id: string
  name: string
  createdAt: string
  prompt: string
  color?: string
  interactions?: number
}


export default function ChatbotsPage() {
  const router = useRouter()
  const { user,isLoaded } = useUser();
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatbotToDelete, setChatbotToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);


  // Load chatbots from localStorage on component mount
  useEffect(() => {
    const fetchChatbots = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase.from("chatbots").select("*").eq("user_id", user.id);
      if (error) {
        console.error("Error fetching chatbots:", error);
      } else {
        setChatbots(data || []);
      }
      setLoading(false);
    };
    if (user) fetchChatbots();
  }, [user]);

  

  // Function to handle chatbot deletion
  const handleDeleteChatbot = (id: string) => {
    setChatbotToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Function to confirm chatbot deletion
  const confirmDelete = async () => {
    if (chatbotToDelete) {
      const { error } = await supabase.from("chatbots").delete().eq("id", chatbotToDelete);
      if (error) {
        console.error("Error deleting chatbot:", error);
      } else {
        setChatbots(chatbots.filter((bot) => bot.id !== chatbotToDelete));
      }
      setDeleteDialogOpen(false);
      setChatbotToDelete(null);
    }
  }

  // Function to handle editing a chatbot
  const handleEditChatbot = (id: string) => {
    router.push(`/edit/${id}`)
  }

  // Function to get embed code
  const handleGetEmbedCode = (id: string) => {
    const embedCode = `<script id="${id}" src="${process.env.NEXT_PUBLIC_FRONTEND_URL}/script.js"></script>`;
    navigator.clipboard.writeText(embedCode).then(() => {
      alert("Embed code copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy:", err);
    });
  }

  // Get a contrasting text color based on background
  const getTextColor = (color: string) => {
    switch (color) {
      case "blue":
      case "green":
      case "purple":
      case "indigo":
        return "text-white"
      default:
        return "text-gray-900"
    }
  }

  // Get background color class
  const getBgColorClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-600"
      case "green":
        return "bg-green-600"
      case "purple":
        return "bg-purple-600"
      case "indigo":
        return "bg-indigo-600"
      case "amber":
        return "bg-amber-500"
      default:
        return "bg-gray-600"
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return <RedirectToSignIn redirectUrl={"/chatbots"} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }



  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Chatbots</h1>
          <p className="text-muted-foreground mt-1">Manage and customize your AI chatbots</p>
        </div>
        <Link href="/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Chatbot
          </Button>
        </Link>
      </div>

      {chatbots.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No chatbots yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Get started by creating your first chatbot. You can customize its behavior with a system prompt and embed it
            on your website.
          </p>
          <Link href="/create" className="mt-6">
            <Button>Create Your First Chatbot</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id} className="overflow-hidden transition-all duration-200 -py-6 hover:shadow-md group">
              <div className={`h-2 w-full ${getBgColorClass(chatbot.color)}`} />
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    {chatbot.name}
                    <Badge variant="outline" className="ml-2 text-xs">
                      AI
                    </Badge>
                  </CardTitle>
                  <CardDescription>Created on {chatbot.createdAt}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditChatbot(chatbot.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGetEmbedCode(chatbot.id)}>
                      <Code className="mr-2 h-4 w-4" />
                      <span>Get Embed Code</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteChatbot(chatbot.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{chatbot.prompt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${getBgColorClass(chatbot.color)} ${getTextColor(chatbot.color || "")}`}
                      >
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Active</span>
                    </div>

                    {chatbot.interactions && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        <span>{chatbot.interactions.toLocaleString()} interactions</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Activity className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => handleEditChatbot(chatbot.id)}>
                    Manage
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

