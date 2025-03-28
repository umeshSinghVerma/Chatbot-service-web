import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, PlusCircle, MessageSquare, Settings, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">AI Chatbot Dashboard</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Build, manage, and deploy AI chatbots effortlessly with powerful features.
        </p>
      </header>

      {/* Main content */}
      <main className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Services</h2>
          <Link href="/create">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Chatbot
            </Button>
          </Link>
        </div>

        {/* Services Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 text-center">
            <CardHeader>
              <Bot className="h-10 w-10 text-primary mx-auto" />
              <CardTitle>AI Chatbots</CardTitle>
              <CardDescription>Create and customize AI-powered chatbots easily.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6 text-center">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mx-auto" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Engage with users in real-time with smart automation.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6 text-center">
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mx-auto" />
              <CardTitle>Customizable</CardTitle>
              <CardDescription>Configure chatbot behavior, responses, and integrations.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6 text-center">
            <CardHeader>
              <BarChart className="h-10 w-10 text-primary mx-auto" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Monitor performance with detailed insights and metrics.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
