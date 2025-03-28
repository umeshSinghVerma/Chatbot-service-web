"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, Code } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  );
}

export default function CreateChatbot() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<"details" | "script">("details");
  const [botName, setBotName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [botColor, setBotColor] = useState("blue");
  const [embedScript, setEmbedScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChatbot = async () => {
    if (!botName || !systemPrompt || !user) return;
    setIsLoading(true);

    // Insert chatbot into Supabase
    const { data, error } = await supabase
      .from("chatbots")
      .insert([
        {
          user_id: user.id, // Clerk user ID
          name: botName,
          prompt: systemPrompt,
          color: botColor,
        },
      ])
      .select("id") // Get the chatbot ID
      .single();

    setIsLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    const uniqueScript = `<script id="${data.id}" src="${process.env.NEXT_PUBLIC_BACKEND_URL}/script.js"></script>`;
    setEmbedScript(uniqueScript);

    // Switch to script view
    setStep("script");

    toast({
      title: "Chatbot created successfully!",
      description: `${botName} has been added.`,
    });
  };

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RedirectToSignIn redirectUrl={"/create"} />;
  }

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
        <h1 className="mb-6 text-3xl font-bold">Create New Chatbot</h1>

        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="script" disabled={step === "details"}>
              Embed Script
            </TabsTrigger>
          </TabsList>

          {/* Chatbot Details Form */}
          <TabsContent value="details">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Chatbot Details</CardTitle>
                <CardDescription>Configure your chatbot&apos;s name and behavior</CardDescription>
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
                            <div className={`h-4 w-4 rounded-full bg-${color}-600 mr-2`} />
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
                    placeholder="You are a helpful assistant..."
                    className="min-h-32"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChatbot} disabled={!botName || !systemPrompt} className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Save Chatbot
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Embed Script Section */}
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
                      navigator.clipboard.writeText(embedScript);
                      toast({
                        title: "Copied to clipboard",
                        description: "The embed script has been copied.",
                      });
                    }}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => router.push("/chatbots")}>
                  Done
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
