import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, Award, Megaphone, Star, Zap } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Access to Top Student Talent",
    description:
      "Connect directly with motivated learners who have completed the 30-day challenge. Review their projects, track records, and hire the best talent for your organization.",
    color: "bg-primary",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics Dashboard",
    description:
      "Monitor student progress, engagement metrics, and project outcomes. Get detailed insights into skills, technologies, and learning patterns across your sponsored cohorts.",
    color: "bg-accent",
  },
  {
    icon: Megaphone,
    title: "Brand Visibility on Public Showcases",
    description:
      "Your logo and brand appear on student project showcases, giving you exposure to thousands of developers and tech enthusiasts across the platform.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Create Custom Learning Cohorts",
    description:
      "Sponsor specific learning tracks aligned with your hiring needs. Design custom challenges and curricula that prepare students for roles in your organization.",
    color: "bg-accent",
  },
  {
    icon: Award,
    title: "Recognition Badge and Spotlight",
    description:
      "Receive an official partner badge displayed across the platform. Get featured in our partner spotlight section and monthly impact reports.",
    color: "bg-primary",
  },
  {
    icon: Star,
    title: "Downloadable Impact Reports",
    description:
      "Access comprehensive reports showing your partnership's impact: students reached, projects completed, skills developed, and community growth metrics.",
    color: "bg-accent",
  },
]

export function PartnerBenefitsGrid() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Why Partner with FolaIgnite?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Comprehensive benefits designed to help you find talent, build your brand, and create lasting impact
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${benefit.color}`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
