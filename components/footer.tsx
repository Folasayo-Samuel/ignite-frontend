import Link from "next/link"
import { Flame } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">FolaIgnite</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of developers through daily learning and community support.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/showcase"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Project Showcase
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Impact Map
                </Link>
              </li>
              <li>
                <Link
                  href="/student/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Partners</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/partners"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partner Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FolaIgnite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
