import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Code, Trophy, Users } from "lucide-react"

const steps = [
  {
    icon: Calendar,
    title: "Commit 30 Minutes Daily",
    description: "Dedicate just 30 minutes each day to learning and building for 30 consecutive days.",
  },
  {
    icon: Code,
    title: "Log Your Progress",
    description: "Share your daily activities through text, images, or videos to track your journey.",
  },
  {
    icon: Trophy,
    title: "Build Real Projects",
    description: "Apply your learning by creating tangible projects that showcase your new skills.",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with fellow learners, get feedback, and celebrate achievements together.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            How the Challenge Works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A simple, proven framework to accelerate your learning and build momentum
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
