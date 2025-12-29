import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/ignitelogo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of developers through daily
              learning and community support.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home/showcase"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Project Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/home/impact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Impact Map
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/student/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Learner Dashboard
                </Link>
              </li> */}
              <li>
                <Link
                  href="/home/resources"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resources
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/home/achievements"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Achievements
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://bit.ly/FolaIgnite"
                  target="__blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join Community
                </Link>
              </li>
              <li>
                <Link
                  href="/home/forum"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link
                  href="/home/partners"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become a Partner
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/partner/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partner Dashboard
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/home/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/admin/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FolaIgnite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
