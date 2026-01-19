"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Wallet,
    Settings,
    LogOut,
    ArrowLeftRight,
    TrendingUp
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function GrowthPartnerSidebar() {
    const pathname = usePathname()
    const { currentUser, logout } = useAuthStore()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/growth-partner/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Referrals",
            icon: Users,
            href: "/growth-partner/referrals",
            color: "text-violet-500",
        },
        {
            label: "Earnings",
            icon: TrendingUp,
            href: "/growth-partner/earnings",
            color: "text-green-500",
        },
        {
            label: "Transactions",
            icon: ArrowLeftRight,
            href: "/growth-partner/transactions",
            color: "text-orange-500",
        },
        {
            label: "Withdrawals",
            icon: Wallet,
            href: "/growth-partner/withdrawals",
            color: "text-emerald-500",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/growth-partner/settings",
            color: "text-gray-500",
        },
    ]

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/growth-partner/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-lg blur-sm opacity-75 animate-pulse" />
                        <div className="relative bg-background rounded-lg flex items-center justify-center w-full h-full border border-primary/20">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Growth Partner
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2">
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src={currentUser?.avatar} />
                            <AvatarFallback className="bg-indigo-500 text-white">
                                {currentUser?.name?.[0]?.toUpperCase() || 'P'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">
                                {currentUser?.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                                {currentUser?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    )
}
