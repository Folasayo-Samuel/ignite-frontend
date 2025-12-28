import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"

export function PartnerBenefitsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            <Building2 className="h-4 w-4" />
            <span>For Tech Schools and Sponsors</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl text-balance">
            Partner with FolaIgnite
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 leading-relaxed">
            Connect with Africa's next generation of tech talent. Access motivated learners, showcase your brand, and
            make a lasting impact on the tech ecosystem.
          </p>

          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <a href="#partner-inquiry">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
    </section>
  )
}
