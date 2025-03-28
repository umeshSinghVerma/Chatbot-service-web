"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Trash } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
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
} from "@/components/ui/alert-dialog";

// A simple loading spinner (reused from CreateChatbot)
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  );
}

export default function EditChatbot() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const id = params.id as string;

  const [botName, setBotName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [botColor, setBotColor] = useState("blue");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChatbot = async () => {
      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast({
          title: "Chatbot not found",
          description: "The chatbot you're trying to edit doesn't exist.",
          variant: "destructive",
        });
        router.push("/chatbots");
        return;
      }

      setBotName(data.name);
      setSystemPrompt(data.prompt);
      setBotColor(data.color || "blue");
      setIsLoading(false);
    };

    fetchChatbot();
  }, [id, user, router]);

  const handleSaveChatbot = async () => {
    if (!botName || !systemPrompt || !user) return;

    const { error } = await supabase
      .from("chatbots")
      .update({ name: botName, prompt: systemPrompt, color: botColor })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Chatbot updated successfully!", description: `${botName} has been updated.` });
    router.push("/chatbots");
  };

  const handleDeleteChatbot = async () => {
    const { error } = await supabase
      .from("chatbots")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Chatbot deleted", description: "The chatbot has been deleted successfully." });
    router.push("/chatbots");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/chatbots" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
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
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteChatbot} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              <Input id="name" placeholder="My Awesome Chatbot" value={botName} onChange={(e) => setBotName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Chatbot Color</Label>
              <Select value={botColor} onValueChange={setBotColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {["blue", "green", "purple", "indigo", "amber"].map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full bg-${color}-600 mr-2`}></div>
                        <span>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="Enter chatbot instructions..."
                className="min-h-32"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/chatbots")}>Cancel</Button>
            <Button onClick={handleSaveChatbot} disabled={!botName || !systemPrompt} className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
