import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function AnimatedSection({
  children,
  className = "",
  animation = "animate-fade-in",
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animation : "opacity-0"}`}
    >
      {children}
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
      "Completed a 10-week teaching internship working with Grade 5 students. Designed and delivered lesson plans in Science and Mathematics, incorporating activity-based learning and formative assessments.",
    icon: BookOpen,
  },
  {
    title: "Community Volunteer Teaching",
    org: "Teach For Change Foundation",
    date: "Jun 2023 – Aug 2023",
    description:
      "Volunteered as a teaching assistant in an after-school program for underprivileged children. Conducted remedial classes in English and helped students improve reading comprehension skills.",
    icon: Users,
  },
  {
    title: "Curriculum Development Project",
    org: "Azim Premji University",
    date: "Sep 2023 – Nov 2023",
    description:
      "Collaborated with peers to design an integrated Science-EVS curriculum unit for Grade 4. Focused on local environmental themes and hands-on learning experiences aligned with NCF guidelines.",
    icon: Award,
  },
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => scrollTo("#hero")}
              className="text-lg font-bold text-primary"
            >
              Your Name
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent rounded-md transition-colors"
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
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(221 83% 53% / 0.05) 0%, hsl(221 83% 53% / 0.12) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6 animate-fade-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <GraduationCap size={16} />
                B.Sc B.Ed Student
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Name
              </h1>
              <p className="text-lg sm:text-xl text-primary font-medium">
                Aspiring Educator | Passionate About Teaching and Learning
              </p>
              <p className="text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed">
                A dedicated education student committed to creating meaningful
                learning experiences and inspiring young minds through innovative
                and inclusive teaching practices.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => scrollTo("#projects")}
                  className="gap-2"
                >
                  View Portfolio
                  <ChevronDown size={18} />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Download Resume
                  <ExternalLink size={18} />
                </Button>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="flex justify-center lg:justify-end animate-fade-in-right">
              <div className="relative">
                <div className="w-72 h-80 sm:w-80 sm:h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shadow-xl">
                  <div className="text-center p-6 space-y-3">
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={40} className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your Professional Photo
                    </p>
                  </div>
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-primary/10 -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-primary/5 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              About Me
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <Card className="border-primary/10 shadow-md">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, hsl(221 83% 53% / 0.03) 0%, transparent 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Education
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </AnimatedSection>

          <AnimatedSection className="max-w-2xl mx-auto" animation="animate-scale-in">
            <Card className="border-primary/10 shadow-md hover-lift">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap size={28} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      B.Sc B.Ed (Integrated)
                    </h3>
                    <p className="text-primary font-medium">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Skills
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedSection animation="animate-fade-in-left">
              <Card className="border-primary/10 shadow-md h-full hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen size={20} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Teaching Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {teachingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in-right">
              <Card className="border-primary/10 shadow-md h-full hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award size={20} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Technical Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {technicalSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Projects / Experience Section */}
      <section
        id="projects"
        className="py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, hsl(221 83% 53% / 0.03) 0%, transparent 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Projects & Experience
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <AnimatedSection
                key={project.title}
                animation="animate-fade-in"
                className={`[animation-delay:${i * 150}ms]`}
              >
                <Card className="border-primary/10 shadow-md h-full hover-lift">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <project.icon size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-primary text-sm font-medium">
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <AnimatedSection animation="animate-fade-in-left">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  I'd love to connect with fellow educators, mentors, and
                  organizations. Feel free to reach out!
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:yourname@email.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/10 shadow-sm hover-lift"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        yourname@email.com
                      </p>
                    </div>
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/10 shadow-sm hover-lift"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">
                        +91 98765 43210
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://linkedin.com/in/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/10 shadow-sm hover-lift"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Linkedin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">LinkedIn</p>
                      <p className="font-medium text-foreground">
                        linkedin.com/in/yourprofile
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in-right">
              <Card className="border-primary/10 shadow-md">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Send a Message
                  </h3>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div>
                      <Input
                        placeholder="Your Name"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        rows={4}
                        className="bg-background resize-none"
                      />
                    </div>
                    <Button className="w-full gap-2">
                      <Send size={16} /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Your Name. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:yourname@email.com"
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
                href="https://linkedin.com/in/yourprofile"
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
