"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SearchBar } from "@/components/search-bar";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import UserDesc from "./navigations/UserDesc";
import logo from "@/public/images/ignitelogo.png";
import { useAuth } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/home/sponsors", label: "Sponsors" },
  { href: "/home/partners", label: "Learning Partners" },
  { href: "/home/showcase", label: "Showcase" },
  { href: "/home/impact", label: "Impact" },
  { href: "/home/resources", label: "Resources" },
];

export function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuthStore();
  const { logoutUser } = useAuth();
  const { mutateAsync } = logoutUser;

  const handleLogout = async () => {
    await mutateAsync(
      {},
      {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");

          logout;
        },
        onError: () => {
          toast.error("Something Went Wrong");
        },
      }
    );
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
              <Image
                src={logo}
                alt="Fola-Ignite"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              FolaIgnite
            </span>
          </Link>

          {/* Search bar - only visible for authenticated users */}
          {currentUser && (
            <div className="hidden md:block flex-1 max-w-sm ml-4">
              <SearchBar />
            </div>
          )}

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
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentUser && <NotificationsPanel />}

            <Button variant="outline" size="sm" asChild>
              <Link href="/home/become-mentor">Become a Mentor</Link>
            </Button>

            {currentUser ? (
              <UserDesc />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-10 w-10" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] px-5">
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
                    <Image
                      src={logo}
                      alt="Fola-Ignite"
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    FolaIgnite
                  </span>
                </Link>

                {/* <div className="md:hidden">
                  <SearchBar />
                </div> */}

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
                </nav>

                <div className="flex flex-col gap-3 pt-6 border-t">
                  <Button variant="outline" asChild>
                    <Link
                      href="/home/become-mentor"
                      onClick={() => setIsOpen(false)}
                    >
                      Become a Mentor
                    </Link>
                  </Button>

                  {currentUser ? (
                    <>
                      <div className="flex items-center gap-2 px-2">
                        <Image
                          src={currentUser?.avatar || "/default-avatar.png"}
                          alt={currentUser?.name || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">
                          {currentUser?.name}
                        </span>
                      </div>
                      <Button variant="ghost" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link
                          href="/auth/login"
                          onClick={() => setIsOpen(false)}
                        >
                          Log in
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
