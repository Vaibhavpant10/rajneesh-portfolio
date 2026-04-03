import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Linkedin,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Calendar,
  MapPin,
  Send,
  ChevronDown,
  ExternalLink,
  Pencil,
} from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";

gsap.registerPlugin(ScrollTrigger);

// Education Logo Component
function EduLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-md">
        <GraduationCap size={20} className="text-primary-foreground" />
      </div>
      <span className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        RP
      </span>
    </div>
  );
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const teachingSkills = [
  "Classroom Management",
  "Lesson Planning",
  "Student Assessment",
  "Communication",
  "Curriculum Design",
  "Differentiated Instruction",
];

const technicalSkills = [
  "MS Office Suite",
  "Google Workspace",
  "EdTech Tools",
  "Presentation Design",
  "Basic Data Analysis",
  "Digital Content Creation",
];

const projects = [
  {
    title: "Teaching Internship",
    org: "Government Higher Primary School, Bangalore",
    date: "Jan 2024 – Mar 2024",
    description:
      "Completed a 10-week teaching internship working with Grade 5 students. Designed and delivered lesson plans in Science and Mathematics, incorporating activity-based learning.",
    icon: BookOpen,
    gradient: "from-primary to-secondary",
  },
  {
    title: "Community Volunteer Teaching",
    org: "Teach For Change Foundation",
    date: "Jun 2023 – Aug 2023",
    description:
      "Volunteered as a teaching assistant in an after-school program for underprivileged children. Conducted remedial classes in English and helped students improve reading skills.",
    icon: Users,
    gradient: "from-secondary to-accent",
  },
  {
    title: "Curriculum Development Project",
    org: "Azim Premji University",
    date: "Sep 2023 – Nov 2023",
    description:
      "Collaborated with peers to design an integrated Science-EVS curriculum unit for Grade 4. Focused on local environmental themes and hands-on learning experiences.",
    icon: Pencil,
    gradient: "from-accent to-primary",
  },
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP Hero animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-image", {
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.2,
    })
      .from(
        ".hero-badge",
        { y: 20, opacity: 0, duration: 0.6 },
        "-=0.5"
      )
      .from(
        ".hero-title",
        { x: 60, opacity: 0, duration: 0.8 },
        "-=0.4"
      )
      .from(
        ".hero-tagline",
        { x: 60, opacity: 0, duration: 0.6 },
        "-=0.4"
      )
      .from(
        ".hero-desc",
        { x: 60, opacity: 0, duration: 0.6 },
        "-=0.3"
      )
      .from(
        ".hero-buttons",
        { y: 30, opacity: 0, duration: 0.6 },
        "-=0.3"
      );
  }, { scope: heroRef });

  // GSAP Scroll animations
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".gsap-section");
    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    // Stagger cards
    gsap.utils.toArray<HTMLElement>(".gsap-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: "power2.out",
      });
    });

    // Skill chips stagger
    gsap.utils.toArray<HTMLElement>(".gsap-chip").forEach((chip, i) => {
      gsap.from(chip, {
        scrollTrigger: {
          trigger: chip,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        scale: 0,
        opacity: 0,
        duration: 0.4,
        delay: i * 0.05,
        ease: "back.out(1.7)",
      });
    });
  }, { scope: mainRef });

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo("#hero")}>
              <EduLogo />
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary rounded-lg transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </button>
              ))}
            </div>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(221 83% 53% / 0.08) 0%, hsl(270 60% 55% / 0.08) 50%, hsl(25 95% 60% / 0.06) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-accent/10 to-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image LEFT */}
            <div className="hero-image flex justify-center lg:justify-start order-1 lg:order-1">
              <div className="relative">
                <div className="w-72 h-80 sm:w-80 sm:h-[26rem] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                  <img
                    src={heroPhoto}
                    alt="Rajneesh Pant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 -z-10" />
                <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 -z-10" />
                <div className="absolute top-6 -right-6 w-12 h-12 rounded-full bg-accent/30 animate-pulse" />
              </div>
            </div>

            {/* Text RIGHT */}
            <div className="space-y-6 order-2 lg:order-2">
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium border border-primary/20">
                <GraduationCap size={16} />
                B.Sc B.Ed Student
              </div>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Rajneesh Pant
                </span>
              </h1>
              <p className="hero-tagline text-lg sm:text-xl font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Aspiring Educator | Passionate About Teaching
              </p>
              <p className="hero-desc text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed">
                A dedicated education student committed to creating meaningful
                learning experiences and inspiring young minds through innovative
                and inclusive teaching practices.
              </p>
              <div className="hero-buttons flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => scrollTo("#projects")}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  View Portfolio
                  <ChevronDown size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/5"
                >
                  Download Resume
                  <ExternalLink size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-section max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full" />
            <Card className="glass-card hover-lift">
              <CardContent className="p-8 sm:p-10">
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  I am a passionate education student pursuing my B.Sc B.Ed at
                  Azim Premji University, Bangalore. My journey in education is
                  driven by a deep belief that every child deserves access to
                  quality, inclusive, and engaging learning experiences. I am
                  particularly interested in activity-based pedagogies,
                  science education, and building strong teacher-student
                  relationships. Through my coursework and field experiences, I
                  have developed a strong foundation in child psychology,
                  curriculum design, and reflective teaching practices. I aspire
                  to become an educator who not only imparts knowledge but also
                  nurtures curiosity, critical thinking, and empathy in young
                  learners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, hsl(270 60% 55% / 0.04) 0%, hsl(221 83% 53% / 0.04) 50%, transparent 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Education
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full" />
          </div>

          <div className="gsap-card max-w-2xl mx-auto">
            <Card className="glass-card hover-lift border-l-4 border-l-primary">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <GraduationCap size={28} className="text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      B.Sc B.Ed (Integrated)
                    </h3>
                    <p className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Azim Premji University
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> Bangalore, Karnataka
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> 2021 – 2025
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                      An integrated four-year program combining Science
                      education with teacher preparation. Coursework includes
                      pedagogy, child development, educational philosophy,
                      classroom practices, and extensive field engagement in
                      diverse school settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="gsap-card">
              <Card className="glass-card h-full hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                      <BookOpen size={20} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Teaching Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {teachingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="gsap-chip px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium border border-primary/20 hover:shadow-md transition-shadow cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="gsap-card">
              <Card className="glass-card h-full hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-md">
                      <Award size={20} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Technical Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {technicalSkills.map((skill) => (
                      <span
                        key={skill}
                        className="gsap-chip px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary text-sm font-medium border border-secondary/20 hover:shadow-md transition-shadow cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects / Experience */}
      <section
        id="projects"
        className="py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, hsl(25 95% 60% / 0.04) 0%, hsl(270 60% 55% / 0.04) 50%, transparent 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                Projects & Experience
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent via-secondary to-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((project) => (
              <div key={project.title} className="gsap-card">
                <Card className="glass-card h-full hover-lift group">
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <project.icon size={24} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {project.org}
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <Calendar size={12} /> {project.date}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="gsap-card space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I'd love to connect with fellow educators, mentors, and
                organizations. Feel free to reach out!
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:rajneesh@email.com"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                    <Mail size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      rajneesh@email.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-md">
                    <Phone size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
                <a
                  href="https://linkedin.com/in/rajneeshpant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                    <Linkedin size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <p className="font-medium text-foreground">
                      linkedin.com/in/rajneeshpant
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="gsap-card">
              <Card className="glass-card hover-lift">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Send a Message
                  </h3>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input placeholder="Your Name" className="bg-background/50" />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-background/50"
                    />
                    <Textarea
                      placeholder="Your Message"
                      rows={4}
                      className="bg-background/50 resize-none"
                    />
                    <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                      <Send size={16} /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t border-border"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(221 83% 53% / 0.03) 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rajneesh Pant. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:rajneesh@email.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+919876543210"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone size={18} />
              </a>
              <a
                href="https://linkedin.com/in/rajneeshpant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
