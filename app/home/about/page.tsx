import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Flame className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6 text-balance">
              About FolaIgnite
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're on a mission to empower the next generation of African
              developers through consistent, daily learning and community
              support.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Our Mission
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Make quality tech education accessible through bite-sized,
                    daily learning challenges
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Our Community
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    5,000+ learners across 15 countries building projects and
                    growing together
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Our Approach
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    30 minutes daily for 30 days - small steps that lead to big
                    transformations
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                The Story Behind FolaIgnite
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FolaIgnite was born from a simple observation: many aspiring
                developers struggle not because they lack resources, but because
                they lack structure and consistency. We created a platform that
                makes learning manageable through daily 30-minute commitments.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our 30-day challenge format helps learners build sustainable
                habits while creating real projects they can showcase. By
                partnering with tech schools and companies across Africa, we're
                creating pathways from learning to employment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, FolaIgnite serves thousands of learners and partners with
                dozens of organizations to create opportunities for the next
                generation of African tech talent.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
