import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Stethoscope, HeartHandshake, Sparkles } from 'lucide-react'

const team = [
  {
    name: "Dr. Amita Tiwari",
    title: "Associate Professor, Department of Veterinary Medicine, CVSc & AH, NDVSU, Jabalpur",
    initials: "AT",
  },
  {
    name: "Dr. Devendra Kumar Gupta",
    title: "Professor & Head, Department of Veterinary Medicine, CVSc & AH, NDVSU, Jabalpur",
    initials: "DG",
  },
  {
    name: "Dr. Aditya Pratap",
    title: "PhD, Department of Veterinary Medicine, CVSc & AH, NDVSU, Jabalpur",
    initials: "AP",
  },
]

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 via-background to-background/80">
        <div className="container mx-auto max-w-7xl px-6 py-20 md:py-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 rounded-full border px-5 py-2.5 bg-background/80 backdrop-blur shadow-sm mb-6">
            <div className="bg-primary/10 p-2 rounded-full">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground tracking-wide">About VetAnaemIA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground text-center mb-6">
            Empowering Veterinary Anaemia Care
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl text-center mb-8">
            Harnessing artificial intelligence, clinical expertise, and research to transform the diagnosis and management of anaemia in companion animals.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="#mission"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow hover:bg-primary/90 transition"
            >
              Our Mission
            </a>
            <a
              href="#team"
              className="bg-background border border-primary text-primary px-8 py-3 rounded-full font-semibold shadow hover:bg-primary/10 transition"
            >
              Meet the Team
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="container mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We unite clinical expertise with AI-driven tools to empower veterinarians, students, researchers, and pet owners. Our platform delivers reliable resources, educational content, and the latest updates on diagnostics, therapies, and anaemia management. Collaboration, innovation, and compassion are at our core as we build a supportive community and advance veterinary medicine for healthier, happier pets.
            </p>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="text-base text-muted-foreground">
                  Science + technology to empower clinical decision-making and improve outcomes in veterinary anaemia.
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="bg-primary/10 rounded-2xl p-8 flex flex-col items-center shadow">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">What Drives Us</h3>
              <p className="text-muted-foreground text-center">
                Passion for animal health, commitment to innovation, and a vision for accessible, data-driven veterinary care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <Card className="shadow-xl bg-background/80">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold mb-4 text-primary">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  VetAnaemIA was envisioned by <span className="font-medium">Dr. Devendra Kumar Gupta</span> and
                  <span className="font-medium"> Dr. Amita Tiwari</span>, inspired by their dedication to addressing the clinical and research challenges of veterinary anaemia. The platform was brought to life under the leadership of founder <span className="font-medium">Dr. Aditya Pratap</span>, whose expertise in academic research (Canine Anaemia), clinical innovation, and AI-driven solutions drives our mission forward. Technical development and creative design are managed by <span className="font-medium">Aryan Tyagi</span>, ensuring VetAnaemIA remains accessible, informative, and seamless for all users.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-xs h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center shadow-lg">
              <Stethoscope className="h-24 w-24 text-primary/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="container mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-4xl font-bold mb-12 text-center text-primary">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-background/90">
              <CardContent className="flex flex-col items-center p-8">
                <Avatar className="h-16 w-16 mb-4 text-2xl">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-2 text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground text-center">{member.title}</p>
              </CardContent>
            </Card>
          ))}
          {/* Aryan Tyagi Card */}
          <Card className="col-span-1 sm:col-span-2 lg:col-span-4 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="rounded-lg p-3 bg-primary/10">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-foreground">Design & Engineering</h3>
                  <h4 className="font-semibold text-lg">Aryan Tyagi</h4>
                  <p className="text-sm text-muted-foreground">Technical development and creative design</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    
    </div>
  )
}

export default AboutPage