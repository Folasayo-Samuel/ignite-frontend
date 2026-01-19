"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, Command, Menu, MessageSquare, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GrowthPartnerSidebar } from "./sidebar"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/api/auth"
import { toast } from "sonner"
import { NotificationsPanel } from "@/components/notifications-panel"

export function GrowthPartnerHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const { currentUser, logout } = useAuthStore()
    const { logoutUser } = useAuth()
    const { mutateAsync } = logoutUser

    const handleLogout = async () => {
        await mutateAsync(
            {},
            {
                onSuccess: () => {
                    toast.success("Logged out successfully");

                    // Force clear cookies client-side
                    document.cookie = "accessToken=; Max-Age=0; path=/; domain=" + window.location.hostname;
                    document.cookie = "accessToken=; Max-Age=0; path=/";
                    document.cookie = "refreshToken=; Max-Age=0; path=/; domain=" + window.location.hostname;
                    document.cookie = "refreshToken=; Max-Age=0; path=/";

                    logout();
                    window.location.href = "/auth/login";
                },
                onError: () => {
                    logout();
                    window.location.href = "/auth/login";
                },
            }
        );
    };

    const getPageTitle = () => {
        if (pathname.includes("/dashboard")) return "Dashboard"
        if (pathname.includes("/referrals")) return "My Referrals"
        if (pathname.includes("/earnings")) return "Earnings Report"
        if (pathname.includes("/transactions")) return "Transaction History"
        if (pathname.includes("/withdrawals")) return "Withdrawals"
        if (pathname.includes("/settings")) return "Settings"
        return "Growth Partner"
    }

    return (
        <div className="flex items-center p-4 border-b bg-background">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden mr-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-900 w-72">
                        <GrowthPartnerSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-x-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('search') as string;
                        if (query?.trim()) {
                            router.push(`/growth-partner/referrals?search=${encodeURIComponent(query.trim())}`);
                        }
                    }}
                    className="hidden md:flex items-center relative"
                >
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="search"
                        type="search"
                        placeholder="Search referrals..."
                        className="pl-9 w-[200px] lg:w-[300px] h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <kbd className="pointer-events-none absolute right-2.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </form>

                <NotificationsPanel />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUser?.avatar} />
                                <AvatarFallback>{currentUser?.name?.[0]?.toUpperCase() || 'P'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {currentUser?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.location.href = "/profile"} className="cursor-pointer">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = "/growth-partner/withdrawals"} className="cursor-pointer">
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = "/growth-partner/settings"} className="cursor-pointer">
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
