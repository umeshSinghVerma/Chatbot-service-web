"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"

const navItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "My Chatbots",
        href: "/chatbots",
        icon: Bot,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { user } = useUser();
    return (
        <div className="hidden border-r bg-background md:block md:w-64">
            <div className="flex h-full flex-col">
                <div className="border-b px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Bot className="h-6 w-6" />
                        <span>ChatBot Creator</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                                    pathname === item.href && "bg-accent text-foreground",
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <SignedOut>
                    <SignInButton>
                        <Button className="m-2 cursor-pointer">Sign in</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div className="mt-auto border-t p-4">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <UserButton />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user?.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {user?.emailAddresses?.[0]?.emailAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                </SignedIn>
            </div>
        </div>
    )
}

