import type { Route } from "./+types/home";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "../utils";
import { Form, useNavigation, useActionData, useLoaderData } from "react-router";
import crypto from "crypto";

// Simple signing for captcha tokens (prevents tampering)
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || "fallback-secret-change-me";

function generateCaptcha() {
  const operations = [
    { op: "+", fn: (a: number, b: number) => a + b },
    { op: "-", fn: (a: number, b: number) => a - b },
    { op: "×", fn: (a: number, b: number) => a * b },
  ];
  const { op, fn } = operations[Math.floor(Math.random() * operations.length)];

  // Generate numbers that make sense for the operation
  let a: number, b: number;
  if (op === "×") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
  } else {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  }

  const answer = fn(a, b);
  const question = `What is ${a} ${op} ${b}?`;
  const timestamp = Date.now();

  // Create signed token: answer|timestamp|signature
  const data = `${answer}|${timestamp}`;
  const signature = crypto.createHmac("sha256", CAPTCHA_SECRET).update(data).digest("hex").slice(0, 16);
  const token = Buffer.from(`${data}|${signature}`).toString("base64");

  return { question, token };
}

function verifyCaptcha(token: string, userAnswer: string): { valid: boolean; error?: string } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [answer, timestampStr, signature] = decoded.split("|");

    // Verify signature
    const data = `${answer}|${timestampStr}`;
    const expectedSig = crypto.createHmac("sha256", CAPTCHA_SECRET).update(data).digest("hex").slice(0, 16);
    if (signature !== expectedSig) {
      return { valid: false, error: "Invalid verification token. Please refresh and try again." };
    }

    // Check if submission is too fast (< 3 seconds = likely bot)
    const timestamp = parseInt(timestampStr, 10);
    const elapsed = Date.now() - timestamp;
    if (elapsed < 3000) {
      return { valid: false, error: "Please take a moment to fill out the form." };
    }

    // Check if token is too old (> 30 minutes)
    if (elapsed > 30 * 60 * 1000) {
      return { valid: false, error: "Form expired. Please refresh the page and try again." };
    }

    // Check answer
    if (userAnswer.trim() !== answer) {
      return { valid: false, error: "Incorrect answer. Please solve the math problem correctly." };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid verification. Please refresh and try again." };
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jake Berg - Co-founder, Fractional CTO & Hands-on Engineer" },
    { name: "description", content: "Co-founder, CTO, and hands-on engineer helping startups build the product, scale the team, and grow the business. Strategy sessions, pair programming, hourly engineering, and fractional CTO leadership." },
    { name: "keywords", content: "Jake Berg, Fractional CTO, Principal Engineer, Technical Co-founder, Technical Leadership, CTO as a Service, Tech Strategy, Code Review, Pair Programming, Contract Engineering, React, Node.js, Claude Code, Software Architecture" },
    { property: "og:title", content: "Jake Berg - Co-founder, Fractional CTO & Hands-on Engineer" },
    { property: "og:description", content: "Co-founder, CTO, and hands-on engineer helping startups build the product, scale the team, and grow the business." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://jakeberg.xyz" },
    { property: "og:image", content: "https://jakeberg.xyz/me.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Jake Berg - Co-founder, Fractional CTO & Hands-on Engineer" },
    { name: "twitter:description", content: "Co-founder, CTO, and hands-on engineer helping startups build the product, scale the team, and grow the business." },
    { name: "twitter:image", content: "https://jakeberg.xyz/me.jpg" },
    { name: "author", content: "Jake Berg" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
}

export async function loader() {
  const { question, token } = generateCaptcha();
  return { captchaQuestion: question, captchaToken: token };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const verification = formData.get("verification") as string;
  const captchaToken = formData.get("captchaToken") as string;
  const honeypot = formData.get("website") as string;

  // Honeypot check - bots often fill hidden fields
  if (honeypot) {
    // Silently reject but pretend success to confuse bots
    return { success: true };
  }

  // Verify captcha (includes time-based check)
  const captchaResult = verifyCaptcha(captchaToken, verification);
  if (!captchaResult.valid) {
    return { error: captchaResult.error };
  }

  const telegramToken = process.env.TELEGRAM_TOKEN;
  const chatId = "-1002256047927";

  if (!telegramToken) {
    return { error: "Telegram configuration missing" };
  }

  const telegramMessage = `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Telegram message:", errorText);
      return { error: "Failed to send message. Please try again later or email directly." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return { error: "Failed to send message. Please check your connection and try again." };
  }
}

type Service = {
  name: string;
  tagline: string;
  price: string;
  prefix?: string;
  unit?: string;
  lead: string;
  points: string[];
  note: string;
  featured?: boolean;
};

const services: Service[] = [
  {
    name: "Strategy Session",
    tagline: "One-time consultation",
    price: "$1,500",
    lead: "Perfect for immediate guidance:",
    points: [
      "Architecture review & recommendations",
      "Technology stack evaluation",
      "Roadmap planning for future success",
      "Team structure recommendations",
    ],
    note: "Get clarity on your technical direction with actionable insights you can implement immediately.",
  },
  {
    name: "Development Session",
    tagline: "Weekly pair programming",
    price: "$500",
    unit: "/hour",
    lead: "Ship faster with hands-on guidance:",
    points: [
      "Pair code through your project together",
      "End each session with working code",
      "Clear next steps to work on between sessions",
      "Solve in 1 hour what takes weeks alone",
    ],
    note: "Walk away with a finished product, not just advice.",
    featured: true,
  },
  {
    name: "Engineering Hours",
    tagline: "Individual contributor work",
    price: "$350",
    unit: "/hour",
    lead: "I build it for you:",
    points: [
      "Features built end to end in your codebase",
      "Bug fixes, refactors, and performance work",
      "Integrations, APIs, and infrastructure",
      "Written handoff notes so your team can take it from there",
    ],
    note: "Senior engineering capacity without a full-time hire.",
  },
  {
    name: "Fractional CTO",
    tagline: "Hands-on leadership",
    price: "$15,000",
    prefix: "Starting at",
    unit: "/mo",
    lead: "Full technical leadership:",
    points: [
      "Active team management",
      "Hands-on coding & architecture",
      "Infrastructure deployment",
      "Executive alignment meetings",
      "Product vision to development bridge",
    ],
    note: "Get a seasoned CTO without the full-time commitment or cost.",
  },
];

const capabilities = [
  "Product engineering",
  "Architecture",
  "AI-driven development",
  "Claude Code",
  "React & Node.js",
  "Team building",
  "Operations",
  "Growth",
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Resume", href: "/resume" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

const fieldClass =
  "w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 transition focus:border-wine focus:ring-2 focus:ring-wine/20 focus:outline-none";

// Italic serif title trailed by a hairline, the same heading the resume uses
function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-10 flex items-center gap-5 font-display text-4xl leading-none font-medium text-stone-900 italic md:text-5xl">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-stone-300" />
    </h2>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const isSubmitting = navigation.state === "submitting";
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const totalCards = 2;
  const autoRotateInterval = useRef<NodeJS.Timeout | null>(null);

  // Minimum swipe distance to trigger card change
  const minSwipeDistance = 50;

  const startAutoRotate = useCallback(() => {
    if (autoRotateInterval.current) {
      clearInterval(autoRotateInterval.current);
    }
    autoRotateInterval.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % totalCards);
    }, 8000);
  }, [totalCards]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeCard < totalCards - 1) {
      setActiveCard(activeCard + 1);
      startAutoRotate(); // Reset timer on swipe
    }
    if (isRightSwipe && activeCard > 0) {
      setActiveCard(activeCard - 1);
      startAutoRotate(); // Reset timer on swipe
    }
  };

  useEffect(() => {
    // Detect if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  useEffect(() => {
    // Add keyboard shortcut for form submission
    const handleKeyDown = (e: KeyboardEvent) => {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      const isInForm = form?.contains(document.activeElement);

      if (isInForm && ((isMac && e.metaKey && e.key === 'Enter') || (!isMac && e.ctrlKey && e.key === 'Enter'))) {
        e.preventDefault();
        form?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Auto-rotate testimonial cards
  useEffect(() => {
    startAutoRotate();
    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [startAutoRotate]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-paper text-stone-600 antialiased">
      {/* ✨ Floating Navbar - like a spaceship control panel */}
      <nav
        className={cn(
          "fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
          "rounded-full px-6 py-3 sm:px-8",
          "bg-paper/75 ring-1 ring-stone-900/10 backdrop-blur-md",
          "shadow-[0_8px_24px_-8px_rgb(68_64_60/0.18)]",
          scrolled && "top-4 bg-paper/90 shadow-[0_12px_32px_-10px_rgb(68_64_60/0.25)]",
          !navVisible && "-translate-y-24 opacity-0"
        )}
      >
        <div className="flex items-center gap-6 sm:gap-8">
          <a href="#" className="font-display text-2xl leading-none font-semibold text-stone-900 transition-colors hover:text-wine">
            JB<span className="text-wine">.</span>
          </a>
          <div className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-stone-500 transition-colors hover:text-stone-900">
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-stone-50 transition-colors hover:bg-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            Let's talk
          </a>
        </div>
      </nav>

      {/* 🚀 Hero Section - where the magic begins */}
      <section className="px-6 pt-44 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium tracking-[0.14em] text-balance text-wine uppercase sm:tracking-[0.2em]">Co-founder · CTO · Hands-on engineer</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-balance text-stone-900 md:text-7xl">
            Build the product, scale the team, <em className="text-wine">grow the business.</em>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-stone-600 md:text-xl">
            I'm Jake Berg. AI can help you build an app, but when you hit walls that cost weeks of frustration—I solve
            them in a single session.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-10">
            <a
              href="#services"
              className="rounded-full bg-stone-900 px-8 py-4 font-medium text-stone-50 shadow-sm shadow-stone-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-wine active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              View services
            </a>
            <a
              href="/resume"
              className="rounded-full bg-paper px-8 py-4 font-medium text-stone-900 ring-1 ring-stone-300 transition duration-200 hover:-translate-y-0.5 hover:ring-stone-400 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              View CV
            </a>
          </div>
        </div>
      </section>

      {/* 👨‍💻 About Me Section - get to know me */}
      <section id="about" className="bg-linen px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading>About me</SectionHeading>
          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16">
            <figure className="mx-auto w-full max-w-md -rotate-1 bg-paper p-3 pb-4 shadow-[0_1px_2px_rgb(68_64_60/0.08),0_24px_48px_-20px_rgb(68_64_60/0.35)] ring-1 ring-stone-900/5 transition-transform duration-300 hover:rotate-0">
              <img src="/me.jpg" alt="Jake Berg" className="w-full" />
              <figcaption className="mt-3 text-center font-display text-lg text-stone-500 italic">Burbank, California</figcaption>
            </figure>
            <div className="space-y-6">
              <div className="space-y-5 text-[1.0625rem] leading-relaxed text-pretty">
                <p>
                  I've spent over a decade on every side of a software company. I co-founded Dubsado and grew it from{" "}
                  <strong className="font-semibold text-stone-900">$0 to $8M ARR</strong>, ran engineering as CTO, then
                  moved into operations and growth. Along the way I've built everything from scrappy MVPs that landed
                  funding to enterprise systems serving millions of users.
                </p>
                <p>
                  I'm focused on how AI is changing development. Tools like Claude Code are core to my workflow, letting me tackle problems that used to take days in hours. I help clients leverage these tools as a genuine multiplier for what small teams can accomplish.
                </p>
                <p>
                  What sets me apart is understanding that your software exists to serve your business. Shipping the right feature matters more than perfect architecture. I help you make trade-offs intelligently—moving fast without accumulating technical debt.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-md bg-paper px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.12em] text-stone-700 uppercase ring-1 ring-stone-900/10"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 💫 Services */}
      <section id="services" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading>Services</SectionHeading>
          <p className="-mt-4 mb-12 max-w-2xl text-lg text-pretty text-stone-600">
            From a single strategy call to hands-on build work to ongoing technical leadership. Choose the engagement
            that fits where you are.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.name}
                className={cn(
                  "relative flex flex-col rounded-xl bg-paper p-8 ring-1 transition duration-300 hover:-translate-y-0.5 md:p-10",
                  service.featured
                    ? "shadow-[0_24px_48px_-24px_rgb(139_44_58/0.35)] ring-wine/40"
                    : "ring-stone-900/10 hover:shadow-[0_24px_48px_-28px_rgb(68_64_60/0.35)]"
                )}
              >
                {service.featured && (
                  <p className="mb-3 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase md:absolute md:top-10 md:right-10 md:mb-0">
                    Most popular
                  </p>
                )}
                <h3 className="font-display text-3xl leading-tight font-semibold text-stone-900">{service.name}</h3>
                <p className="mt-1 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase">{service.tagline}</p>
                <p className="mt-6 font-display text-5xl leading-none font-medium text-stone-900 lining-nums">
                  {service.prefix && (
                    <span className="mr-2 font-sans text-sm font-normal text-stone-500">{service.prefix}</span>
                  )}
                  {service.price}
                  {service.unit && <span className="ml-1 font-sans text-base font-normal text-stone-500">{service.unit}</span>}
                </p>
                <div aria-hidden="true" className="my-6 h-px bg-stone-200" />
                <p className="font-medium text-stone-800">{service.lead}</p>
                <ul className="mt-3 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-wine" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-sm text-stone-500">{service.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 📬 Contact Section - let's connect */}
      <section id="contact" className="bg-linen px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-medium text-balance text-stone-900 italic md:text-5xl">
              Let's talk about what you're building
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Tell me where you're stuck or where you're headed. I'm just a message away.
            </p>
          </div>

          <Form method="post" id="contact-form" className="max-w-2xl mx-auto" key={showSuccess ? 'success' : 'form'}>
            {actionData?.error && !showSuccess && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">Failed to send message</p>
                <p className="text-red-600 text-sm mt-1">{actionData.error}</p>
              </div>
            )}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">Message sent.</p>
                <p className="text-green-600 text-sm mt-1">I'll get back to you as soon as possible.</p>
              </div>
            )}
            <div className="space-y-6 rounded-xl bg-paper p-8 shadow-[0_24px_48px_-28px_rgb(68_64_60/0.35)] ring-1 ring-stone-900/10">
              {/* Honeypot field - hidden from humans, bots will fill it */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] opacity-0 h-0 w-0"
              />
              {/* Captcha token - signed server-side */}
              <input type="hidden" name="captchaToken" value={loaderData.captchaToken} />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
                    Name
                  </label>
                  <input type="text" name="name" id="name" required className={fieldClass} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
                    Email
                  </label>
                  <input type="email" name="email" id="email" required className={fieldClass} placeholder="you@company.com" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-stone-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  required
                  className={cn(fieldClass, "resize-none")}
                  placeholder="Tell me about your project..."
                />
              </div>
              <div>
                <label htmlFor="verification" className="mb-2 block text-sm font-medium text-stone-700">
                  {loaderData.captchaQuestion} <span className="text-stone-500">(Anti-bot verification)</span>
                </label>
                <input
                  type="text"
                  name="verification"
                  id="verification"
                  required
                  className={fieldClass}
                  placeholder="Type your answer..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-stone-900 px-8 py-4 font-medium text-stone-50 transition duration-200 hover:-translate-y-0.5 hover:bg-wine active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-stone-900"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send message
                    <span className="text-xs font-normal opacity-60">
                      {isMac ? '⌘ + Return' : 'Ctrl + Enter'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </Form>

          <div className="flex gap-4 justify-center mt-8">
            <a
              href="https://github.com/wayjake"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-stone-600 ring-1 ring-stone-900/10 transition hover:text-wine hover:ring-stone-900/20"
            >
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jakedaneberg"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-stone-600 ring-1 ring-stone-900/10 transition hover:text-wine hover:ring-stone-900/20"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 🚀 Rotating Cards Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative overflow-hidden px-4 -mx-4 py-6 -my-6 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Cards Container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeCard * 100}%)` }}
            >
              {/* Card 1: Hey, I'm Jake Berg */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-paper p-10 shadow-[0_24px_48px_-28px_rgb(68_64_60/0.4)] ring-1 ring-stone-900/10 md:p-12">
                  <h2 className="mb-6 font-display text-3xl leading-tight font-medium text-stone-900 md:text-4xl">
                    Hey, I'm Jake Berg, and you're a startup—
                    <span className="mt-2 block text-wine italic">I help close the gap between ambitious goals and reality.</span>
                  </h2>
                  <div className="space-y-4 text-lg text-stone-600">
                    <p>
                      You need to focus on marketing and sales. I want you to know that your software is being handled
                      so you can focus on the parts that you do best.
                    </p>
                    <p className="font-medium text-stone-900">
                      I focus on the future and what you will need. From scalable code to hiring a team.
                    </p>
                  </div>

                  {/* Companies section */}
                  <div className="mt-12 border-t border-stone-200 pt-8">
                    <h3 className="mb-6 text-center text-[0.6875rem] font-medium tracking-[0.14em] text-stone-500 uppercase">
                      Companies I've worked with
                    </h3>
                    <div className="grid grid-cols-3 items-center gap-8">
                      {[
                        { name: "Dubsado", href: "https://www.dubsado.com/", logo: "/dubsado-logo.webp", height: "h-10" },
                        { name: "Social Curator", href: "https://www.socialcurator.com/", logo: "/social-curator-logo.png", height: "h-12" },
                        { name: "RoboLike", href: "https://www.robolike.com/", logo: "/robolike-logo.png", height: "h-10" },
                      ].map((company) => (
                        <div key={company.name} className="flex justify-center">
                          <a
                            href={company.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform hover:scale-105"
                          >
                            <img
                              src={company.logo}
                              alt={company.name}
                              className={cn(
                                company.height,
                                "object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                              )}
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Testimonial */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-paper p-10 shadow-[0_24px_48px_-28px_rgb(68_64_60/0.4)] ring-1 ring-stone-900/10 md:p-12">
                  <div className="relative flex h-full flex-col justify-center">
                    <div aria-hidden="true" className="font-display text-7xl leading-none text-wine/30">“</div>
                    <blockquote className="mb-8 font-display text-2xl leading-snug text-stone-700 italic md:text-[1.75rem]">
                      Jake helped us answer some big architectural decisions before we started coding. We were able to proceed through our first 3 months of development with a lot more confidence that we were on the right path. We appreciate Jake's guidance and continued support with one-off calls whenever we get stuck.
                    </blockquote>
                    <div className="mt-auto">
                      <p className="text-lg font-semibold text-stone-900">Michael T.</p>
                      <p className="text-stone-500">Founder, ShieldTrack Solutions</p>
                      <p className="mt-2 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase">Strategy Session Client</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalCards)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setActiveCard(index); startAutoRotate(); }}
                  className={cn(
                    "h-2 w-2 cursor-pointer rounded-full transition-all",
                    activeCard === index
                      ? "w-8 bg-wine"
                      : "bg-stone-300 hover:bg-stone-400"
                  )}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Footer - the sign-off */}
      <footer className="border-t border-stone-200 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Jake Berg. Crafted with passion and pixels.</p>
        </div>
      </footer>
    </div>
  );
}
