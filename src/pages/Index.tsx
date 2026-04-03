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
  Github,
  Twitter,
} from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";

gsap.registerPlugin(ScrollTrigger);

// Typing effect hook
function useTypingEffect(texts: string[], speed = 80, pause = 1500) {
  const [display, setDisplay] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplay(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause);
          } else {
            setCharIndex(charIndex + 1);
          }
        } else {
          setDisplay(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setCharIndex(0);
            setTextIndex((textIndex + 1) % texts.length);
          } else {
            setCharIndex(charIndex - 1);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return display;
}

// Education Logo
function EduLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
        <GraduationCap size={22} className="text-primary-foreground" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
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

  const typedText = useTypingEffect([
    "Teaching",
    "Education",
    "Science",
    "Inspiring Young Minds",
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP Hero animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-text-block", { x: -80, opacity: 0, duration: 1, delay: 0.3 })
      .from(".hero-avatar", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5")
      .from(".hero-social", { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");
  }, { scope: heroRef });

  // GSAP Scroll animations
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" },
        y: 60, opacity: 0, duration: 0.8, ease: "power2.out",
      });
    });
    gsap.utils.toArray<HTMLElement>(".gsap-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        y: 50, opacity: 0, duration: 0.6, delay: i * 0.15, ease: "power2.out",
      });
    });
    gsap.utils.toArray<HTMLElement>(".gsap-chip").forEach((chip, i) => {
      gsap.from(chip, {
        scrollTrigger: { trigger: chip, start: "top 90%", toggleActions: "play none none none" },
        scale: 0, opacity: 0, duration: 0.4, delay: i * 0.05, ease: "back.out(1.7)",
      });
    });
  }, { scope: mainRef });

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo("#hero")}><EduLogo /></button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="px-4 py-2 text-sm font-medium text-foreground/60 hover:text-accent rounded-lg transition-colors relative group">
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </button>
              ))}
            </div>
            <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground/60 hover:text-accent hover:bg-muted rounded-lg transition-colors">
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, hsl(221 83% 53% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(270 60% 55% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, hsl(38 95% 55% / 0.08) 0%, transparent 50%)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(210 40% 95%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 40% 95%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Floating shapes */}
        <div className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-accent/40 animate-pulse" />
        <div className="absolute top-[30%] right-[15%] w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[20%] left-[20%] w-4 h-4 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[60%] right-[30%] w-2 h-2 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text LEFT */}
            <div className="hero-text-block space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 glow-primary">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Available for Teaching Opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Hi There,</span>
                <br />
                <span className="text-foreground">I'm </span>
                <span className="text-accent text-glow">Rajneesh Pant</span>
              </h1>

              <div className="text-xl sm:text-2xl font-medium text-muted-foreground h-8">
                I am into{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                  {typedText}
                </span>
                <span className="animate-pulse text-accent">|</span>
              </div>

              <p className="text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed">
                A dedicated education student committed to creating meaningful
                learning experiences and inspiring young minds through innovative
                and inclusive teaching practices.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" onClick={() => scrollTo("#projects")} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg glow-primary">
                  View Portfolio <ChevronDown size={18} />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent transition-all">
                  Download Resume <ExternalLink size={18} />
                </Button>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-2">
                {[
                  { icon: Linkedin, href: "https://linkedin.com/in/rajneeshpant", color: "hover:text-primary hover:glow-primary" },
                  { icon: Github, href: "#", color: "hover:text-accent hover:glow-accent" },
                  { icon: Twitter, href: "#", color: "hover:text-secondary hover:glow-secondary" },
                  { icon: Mail, href: "mailto:rajneesh@email.com", color: "hover:text-accent hover:glow-accent" },
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className={`hero-social w-11 h-11 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}>
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Avatar RIGHT */}
            <div className="hero-avatar flex justify-center order-1 lg:order-2">
              <div className="relative">
                {/* Yellow glow circle behind */}
                <div className="absolute inset-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-accent/20 blur-2xl" />
                {/* Outer ring */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-1.5 bg-gradient-to-br from-accent via-primary to-secondary">
                  <div className="w-full h-full rounded-full overflow-hidden bg-background p-1">
                    <img src={heroPhoto} alt="Rajneesh Pant" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                {/* Orbiting dots */}
                <div className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-accent glow-accent" />
                <div className="absolute bottom-4 -left-2 w-3 h-3 rounded-full bg-primary glow-primary" />
                <div className="absolute top-1/2 -right-3 w-3 h-3 rounded-full bg-secondary glow-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(270 60% 55% / 0.06) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="gsap-section max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">About </span>
              <span className="text-accent text-glow">Me</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mb-8 rounded-full" />
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
      <section id="education" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(221 83% 53% / 0.06) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">My </span>
              <span className="text-accent text-glow">Education</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>
          <div className="gsap-card max-w-2xl mx-auto">
            <Card className="glass-card hover-lift border-l-4 border-l-accent">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg glow-accent">
                    <GraduationCap size={28} className="text-accent-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">B.Sc B.Ed (Integrated)</h3>
                    <p className="font-medium text-accent">Azim Premji University</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> Bangalore, Karnataka</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> 2021 – 2025</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                      An integrated four-year program combining Science education with teacher preparation. Coursework includes pedagogy, child development, educational philosophy, classroom practices, and extensive field engagement in diverse school settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, hsl(270 60% 55% / 0.06) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">My </span>
              <span className="text-accent text-glow">Skills</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary via-accent to-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="gsap-card">
              <Card className="glass-card h-full hover-lift group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md glow-primary group-hover:scale-110 transition-transform">
                      <BookOpen size={20} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Teaching Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {teachingSkills.map((skill) => (
                      <span key={skill} className="gsap-chip px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 hover:glow-primary transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="gsap-card">
              <Card className="glass-card h-full hover-lift group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-md glow-secondary group-hover:scale-110 transition-transform">
                      <Award size={20} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Technical Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {technicalSkills.map((skill) => (
                      <span key={skill} className="gsap-chip px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20 hover:bg-secondary/20 hover:glow-secondary transition-all cursor-default">
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
      <section id="projects" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(38 95% 55% / 0.05) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">Projects & </span>
              <span className="text-accent text-glow">Experience</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-secondary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((project) => (
              <div key={project.title} className="gsap-card">
                <Card className="glass-card h-full hover-lift group">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <project.icon size={24} className="text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                    <p className="text-sm font-medium text-accent">{project.org}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <Calendar size={12} /> {project.date}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(221 83% 53% / 0.08) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="gsap-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">Get In </span>
              <span className="text-accent text-glow">Touch</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="gsap-card space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I'd love to connect with fellow educators, mentors, and organizations. Feel free to reach out!
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "rajneesh@email.com", href: "mailto:rajneesh@email.com", gradient: "from-primary to-secondary" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210", gradient: "from-secondary to-accent" },
                  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/rajneeshpant", href: "https://linkedin.com/in/rajneeshpant", gradient: "from-accent to-primary" },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl glass-card hover-lift group">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <item.icon size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="gsap-card">
              <Card className="glass-card hover-lift">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">Send a Message</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <Input placeholder="Your Name" className="bg-muted/30 border-border/50 focus:border-accent" />
                    <Input type="email" placeholder="Your Email" className="bg-muted/30 border-border/50 focus:border-accent" />
                    <Textarea placeholder="Your Message" rows={4} className="bg-muted/30 border-border/50 focus:border-accent resize-none" />
                    <Button className="w-full gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all shadow-lg glow-accent text-accent-foreground">
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
      <footer className="py-8 border-t border-border relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Rajneesh Pant. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[
                { icon: Mail, href: "mailto:rajneesh@email.com" },
                { icon: Phone, href: "tel:+919876543210" },
                { icon: Linkedin, href: "https://linkedin.com/in/rajneeshpant" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
