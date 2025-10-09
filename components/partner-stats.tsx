import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    value: "5,000+",
    label: "Active Learners",
    description: "Across 15 African countries",
  },
  {
    value: "12,000+",
    label: "Projects Completed",
    description: "Real-world applications built",
  },
  {
    value: "85%",
    label: "Completion Rate",
    description: "Students finish the challenge",
  },
  {
    value: "50+",
    label: "Partner Organizations",
    description: "Tech schools and companies",
  },
]

export function PartnerStats() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Our Impact in Numbers</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join a thriving ecosystem of learners and partners making a difference
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
