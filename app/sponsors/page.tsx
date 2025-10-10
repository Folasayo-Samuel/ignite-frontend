import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, Users, Award } from "lucide-react"
import Image from "next/image"

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 1,
      name: "TechCorp Africa",
      logo: "/techcorp-logo.png",
      tier: "Platinum",
      description: "Leading technology company empowering African developers",
      cohorts: 5,
      students: 150,
      website: "https://techcorp.africa",
      country: "Nigeria",
    },
    {
      id: 2,
      name: "CodeAcademy Lagos",
      logo: "/codeacademy-logo.jpg",
      tier: "Gold",
      description: "Premier coding bootcamp training the next generation",
      cohorts: 3,
      students: 90,
      website: "https://codeacademy.ng",
      country: "Nigeria",
    },
    {
      id: 3,
      name: "DevHub Kenya",
      logo: "/devhub-logo.jpg",
      tier: "Gold",
      description: "Innovation hub supporting tech talent across East Africa",
      cohorts: 4,
      students: 120,
      website: "https://devhub.ke",
      country: "Kenya",
    },
    {
      id: 4,
      name: "StartupGH",
      logo: "/startupgh-logo.jpg",
      tier: "Silver",
      description: "Accelerator program for Ghanaian tech entrepreneurs",
      cohorts: 2,
      students: 60,
      website: "https://startup.gh",
      country: "Ghana",
    },
    {
      id: 5,
      name: "InnovateSA",
      logo: "/innovatesa-logo.jpg",
      tier: "Silver",
      description: "South African innovation and skills development partner",
      cohorts: 2,
      students: 75,
      website: "https://innovate.co.za",
      country: "South Africa",
    },
    {
      id: 6,
      name: "TechBridge Rwanda",
      logo: "/techbridge-logo.jpg",
      tier: "Bronze",
      description: "Bridging the tech skills gap in Rwanda",
      cohorts: 1,
      students: 30,
      website: "https://techbridge.rw",
      country: "Rwanda",
    },
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-slate-100 text-slate-900 border-slate-300"
      case "Gold":
        return "bg-amber-100 text-amber-900 border-amber-300"
      case "Silver":
        return "bg-gray-100 text-gray-900 border-gray-300"
      case "Bronze":
        return "bg-orange-100 text-orange-900 border-orange-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Partners & Sponsors</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the organizations making FolaIgnite possible and empowering the next generation of African developers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-16 flex items-center mb-3">
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={`${sponsor.name} logo`}
                        width={160}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{sponsor.name}</h3>
                  </div>
                  <Badge className={getTierColor(sponsor.tier)} variant="outline">
                    {sponsor.tier}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{sponsor.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{sponsor.students} Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{sponsor.cohorts} Cohorts</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {sponsor.country}
                  </div>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Visit
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">Become a Partner</h2>
              <p className="text-muted-foreground mb-6">
                Join our growing network of partners and help shape the future of tech education in Africa
              </p>
              <a
                href="/partners"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Learn More About Partnership
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
