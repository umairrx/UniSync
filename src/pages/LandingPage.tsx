import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Layout,
  Clock,
  Download,
  ArrowRight,
  BookOpen,
  Sparkles,
  Github,
  Star,
  Zap,
  Shield,
  Heart,
  ChevronDown,
  ChevronUp,
  Mail,
  MousePointerClick,
  Palette,
  Share2,
  Gift,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import ModeToggle from "@/components/mode-toggle";
import { SEO } from "@/components/SEO";
import { useState } from "react";

// Feature data
const FEATURES = [
  {
    icon: Layout,
    title: "Drag & Drop Interface",
    description:
      "Intuitively place courses into time slots with our smooth drag-and-drop system. No technical knowledge required.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Clock,
    title: "Smart Conflict Detection",
    description: "Never double-book yourself again. Real-time warnings when courses overlap or conflict.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    icon: BookOpen,
    title: "Easy Course Management",
    description: "Add, edit, and organize your courses with all critical details like sections, credits, and locations.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Download your finalized timetable as a high-quality PNG image to share or print.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: CheckCircle2,
    title: "Credit Calculator",
    description: "Automatically track your total credits as you build your schedule. Stay within limits effortlessly.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Calendar,
    title: "Visual Clarity",
    description: "Color-coded blocks and clear layouts make your schedule easy to read at a glance.",
    gradient: "from-cyan-500/20 to-sky-500/20",
  },
] as const;

// How it works steps
const STEPS = [
  {
    step: "01",
    icon: BookOpen,
    title: "Add Your Courses",
    description: "Enter your course details including name, code, section, credits, and preferred times.",
  },
  {
    step: "02",
    icon: MousePointerClick,
    title: "Drag & Arrange",
    description: "Simply drag courses onto your timetable grid. Our smart system handles the rest.",
  },
  {
    step: "03",
    icon: Palette,
    title: "Customize & Perfect",
    description: "Adjust colors, resolve conflicts, and fine-tune your schedule until it's perfect.",
  },
  {
    step: "04",
    icon: Share2,
    title: "Export & Share",
    description: "Download as an image or share directly with classmates and advisors.",
  },
] as const;

// Benefits/Stats
const STATS = [
  { value: "100%", label: "Free Forever", icon: Gift },
  { value: "Open", label: "Source Code", icon: Github },
  { value: "0", label: "Ads or Trackers", icon: Shield },
  { value: "∞", label: "Timetables", icon: Calendar },
] as const;

// FAQ data
const FAQS = [
  {
    question: "Is UniSync really free?",
    answer: "Yes! UniSync is completely free and open-source. There are no hidden fees, premium tiers, or paywalls. We believe every student deserves access to quality scheduling tools.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required! Your timetable data is stored locally in your browser. You can start scheduling immediately without any sign-up process.",
  },
  {
    question: "Can I use UniSync on my phone?",
    answer: "UniSync is built with a responsive design that works on tablets and mobile devices. However, for the best experience with drag-and-drop, we recommend using a desktop or laptop.",
  },
  {
    question: "How do I export my timetable?",
    answer: "Simply click the 'Export' button in the timetable view. You can download your schedule as a high-quality PNG image that's perfect for printing or sharing.",
  },
  {
    question: "Is my data secure?",
    answer: "Your data never leaves your device. Everything is stored locally in your browser's storage. We don't collect, track, or store any personal information on our servers.",
  },
  {
    question: "Can I contribute to UniSync?",
    answer: "Absolutely! UniSync is open-source and we welcome contributions. Check out our GitHub repository to report issues, suggest features, or submit pull requests.",
  },
] as const;

// Testimonials placeholder
const TESTIMONIALS = [
  {
    quote: "UniSync saved me hours of planning. The drag-and-drop interface is incredibly intuitive!",
    author: "Alex Chen",
    role: "Computer Science Student",
    avatar: "AC",
  },
  {
    quote: "Finally, a timetable tool that just works. No sign-ups, no ads, just pure functionality.",
    author: "Sarah Miller",
    role: "Engineering Major",
    avatar: "SM",
  },
  {
    quote: "The conflict detection feature is a lifesaver. I caught so many overlapping classes!",
    author: "Jordan Lee",
    role: "Business Administration",
    avatar: "JL",
  },
] as const;

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="UniSync - Free University Timetable Scheduler"
        description="Effortlessly plan your semester with UniSync. Drag-and-drop courses, manage conflicts, and export your perfect timetable in seconds. 100% free and open-source."
      />
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-xl fixed top-0 w-full z-50">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={resolvedTheme === "dark" ? "/unisync-full-white.svg" : "/unisync-full-dark.svg"}
                alt="UniSync Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a 
                href="https://github.com/umairrx/UniSync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <Button asChild size="sm" className="sm:h-10 sm:px-6 font-semibold">
                <Link to="/table">
                  Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 lg:pb-36 px-4 overflow-hidden">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 -z-10"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/12" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-secondary/25 via-transparent to-transparent rounded-full blur-3xl opacity-50" />
              <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-accent/20 via-transparent to-transparent rounded-full blur-3xl opacity-40" />
            </div>

            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
              aria-hidden="true"
            />

            <div className="container mx-auto max-w-5xl text-center relative">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Badge
                  variant="secondary"
                  className="gap-1.5 px-4 py-2 text-sm font-medium border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-default"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Free & Open Source</span>
                  <span className="mx-1.5 text-muted-foreground/50">•</span>
                  <span className="text-muted-foreground">No Sign-up Required</span>
                </Badge>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Plan Your Perfect
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-amber-500 bg-clip-text text-transparent">
                    University Schedule
                  </span>
                  <span className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-[90%] sm:w-full h-1.5 sm:h-3 bg-primary/20 -rotate-1 rounded-sm -z-0" aria-hidden="true" />
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                The intuitive drag-and-drop timetable builder that helps you create, visualize, 
                and export your course schedule in minutes—not hours.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold w-full sm:w-auto gap-2 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                  asChild
                >
                  <Link to="/table">
                    Start Building Now <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-medium w-full sm:w-auto border-2 hover:bg-accent/50 transition-all duration-300"
                  asChild
                >
                  <a 
                    href="https://github.com/umairrx/UniSync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-5 w-5" /> View on GitHub
                  </a>
                </Button>
              </div>

              {/* Social proof indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <span>Loved by students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10">
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span>Privacy-first</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                    <Zap className="h-4 w-4 text-blue-500" />
                  </div>
                  <span>Lightning fast</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats/Benefits Bar */}
          <section className="py-12 sm:py-16 bg-muted/40 border-y">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 sm:py-28 px-4 scroll-mt-20">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 px-3 py-1">
                  Features
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Everything You Need to
                  <br />
                  <span className="text-primary">Master Your Schedule</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Designed with students in mind. Simple, powerful, and completely free.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, index) => (
                  <Card 
                    key={feature.title} 
                    className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="relative p-6 sm:p-8">
                      <div className="mb-5 bg-primary/10 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-muted/30 scroll-mt-20">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 px-3 py-1">
                  How It Works
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Build Your Schedule in
                  <br />
                  <span className="text-primary">Four Simple Steps</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  No learning curve. No complicated setup. Just start scheduling.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {STEPS.map((step, index) => (
                  <div key={step.title} className="relative group">
                    {/* Connector line */}
                    {index < STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                    )}
                    
                    <Card className="h-full border-0 bg-card/50 backdrop-blur-sm group-hover:bg-card group-hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="relative inline-flex mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <step.icon className="h-8 w-8 text-primary" />
                          </div>
                          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                            {step.step}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 sm:py-28 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 px-3 py-1">
                  Testimonials
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  What Students Are
                  <br />
                  <span className="text-primary">Saying About Us</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join hundreds of students who've simplified their scheduling process.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial, index) => (
                  <Card key={index} className="h-full border-0 bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <blockquote className="text-foreground mb-6 flex-grow italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Open Source Section */}
          <section className="py-20 sm:py-28 px-4 bg-muted/30">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden shadow-xl">
                <CardContent className="p-8 sm:p-12 text-center relative">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 mb-6">
                      <Heart className="h-8 w-8 text-rose-500" />
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      Built With Love,
                      <br />
                      <span className="text-primary">Open for Everyone</span>
                    </h2>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                      UniSync is proudly open-source. We believe in transparency, community collaboration, 
                      and making education tools accessible to all students regardless of their budget.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-6 font-medium gap-2 border-2"
                        asChild
                      >
                        <a 
                          href="https://github.com/umairrx/UniSync" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" /> Star on GitHub
                        </a>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-6 font-medium gap-2 border-2"
                        asChild
                      >
                        <a 
                          href="https://github.com/umairrx/UniSync/issues" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="h-5 w-5" /> Report an Issue
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-20 sm:py-28 px-4 scroll-mt-20">
            <div className="container mx-auto max-w-3xl">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 px-3 py-1">
                  FAQ
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Frequently Asked
                  <br />
                  <span className="text-primary">Questions</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Got questions? We've got answers.
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <Card 
                    key={index} 
                    className={`border-0 transition-all duration-300 cursor-pointer ${
                      expandedFaq === index ? 'bg-muted/50 shadow-lg' : 'bg-card hover:bg-muted/30'
                    }`}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                        <div className="flex-shrink-0 mt-0.5">
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-primary" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {expandedFaq === index && (
                        <p className="mt-4 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                          {faq.answer}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-24 sm:py-32 px-4 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-br from-primary/30 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-tl from-orange-500/20 to-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
            </div>

            <div className="container mx-auto max-w-5xl">
              <div className="relative">
                {/* Glassmorphism card */}
                <div className="relative backdrop-blur-xl bg-card/40 dark:bg-card/20 border border-white/10 dark:border-white/5 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 rounded-3xl" />
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-[100px]" />
                  
                  <div className="relative z-10 grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
                    {/* Left content - takes 3 columns */}
                    <div className="lg:col-span-3 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary tracking-wide uppercase">Get in Touch</span>
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                        Have Questions or
                        <span className="block bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent">
                          Feedback?
                        </span>
                      </h2>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                        We'd love to hear from you! Whether you have suggestions, found a bug, 
                        or just want to say hello—feel free to reach out.
                      </p>
                    </div>
                    
                    {/* Right content - email card - takes 2 columns */}
                    <div className="lg:col-span-2">
                      <a 
                        href="mailto:umairniazidev@gmail.com"
                        className="group relative block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                          {/* Animated mail icon container */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                              <Mail className="h-7 w-7 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">Email us at</p>
                            <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                              umairniazidev@gmail.com
                            </p>
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <span>Send a message</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-24 sm:py-32 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to Simplify
                <br />
                <span className="text-primary">Your Semester?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Join students worldwide who are already using UniSync to build their perfect schedules. 
                It takes less than a minute to get started.
              </p>
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-semibold gap-2 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link to="/table">
                  Create Your Timetable <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        {/* Enhanced Footer */}
        <footer className="border-t bg-card/50 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <img
                  src={resolvedTheme === "dark" ? "/unisync-full-white.svg" : "/unisync-full-dark.svg"}
                  alt="UniSync Logo"
                  className="h-8 w-auto object-contain mb-4"
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The open-source timetable scheduler for university students.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/table" className="hover:text-foreground transition-colors">Get Started</Link></li>
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                  <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://github.com/umairrx/UniSync" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/umairrx/UniSync/issues" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                      Report Issues
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/umairrx/UniSync/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                      License
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://github.com/umairrx" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} UniSync. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                <span>for students everywhere</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
