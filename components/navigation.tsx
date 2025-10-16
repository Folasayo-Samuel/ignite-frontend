"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Flame, Menu, Shield, GraduationCap } from "lucide-react"
import { NotificationsPanel } from "@/components/notifications-panel"
import { SearchBar } from "@/components/search-bar"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/home/sponsors", label: "Sponsors" },
    { href: "/home/partners", label: "Partners" },
    { href: "/home/showcase", label: "Showcase" },
    { href: "/home/impact", label: "Impact" },
    { href: "/home/resources", label: "Resources" },
    // { href: "/mentors", label: "Mentors" },
    // { href: "/achievements", label: "Achievements" },
  ]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FolaIgnite</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* <Link
              href="/mentor/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              Mentor
            </Link> */}
            {/* <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link> */}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <NotificationsPanel />
            <Button variant="outline" size="sm" asChild>
              <Link href="/home/become-mentor">Become a Mentor</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Flame className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">FolaIgnite</span>
                </Link>

                <div className="md:hidden">
                  <SearchBar />
                </div>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* <Link
                    href="/mentor/dashboard"
                    className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Mentor Dashboard
                  </Link> */}
                  {/* <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </Link> */}
                </nav>

                <div className="flex flex-col gap-3 pt-6 border-t">
                  <Button variant="outline" asChild>
                    <Link href="/home/become-mentor" onClick={() => setIsOpen(false)}>
                      Become a Mentor
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
