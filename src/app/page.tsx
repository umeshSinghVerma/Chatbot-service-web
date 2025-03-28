import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Chatbot
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Empty state */}
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Create your first chatbot</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Get started by creating a new chatbot. You can customize its behavior with a system prompt and embed it on
              your website.
            </p>
            <Link href="/create" className="mt-6">
              <Button>Create Chatbot</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

