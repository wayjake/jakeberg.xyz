import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { cn } from "../utils";
import { Form, useNavigation, useActionData } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jake Berg - Fractional CTO | Technical Leadership & Strategic Guidance" },
    { name: "description", content: "Fractional CTO services providing technical leadership, code reviews, team management, and strategic guidance. I help close the gap between ambitious goals and reality. Expert in React, Node.js, and modern architectures." },
    { name: "keywords", content: "Jake Berg, Fractional CTO, Technical Leadership, CTO as a Service, Tech Strategy, Code Review, Team Management, React, Node.js, Infrastructure, Software Architecture" },
    { property: "og:title", content: "Jake Berg - Fractional CTO | Technical Leadership & Strategic Guidance" },
    { property: "og:description", content: "Fractional CTO services helping companies bridge the gap between vision and execution with hands-on technical leadership." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://jakeberg.xyz" },
    { property: "og:image", content: "https://jakeberg.xyz/me.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Jake Berg - Fractional CTO" },
    { name: "twitter:description", content: "Fractional CTO services helping companies bridge the gap between ambitious goals and reality with hands-on technical leadership." },
    { name: "twitter:image", content: "https://jakeberg.xyz/me.jpg" },
    { name: "author", content: "Jake Berg" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const verification = formData.get("verification") as string;

  // Check anti-bot verification
  if (verification?.trim() !== "7") {
    return { error: "Incorrect verification answer. Please solve the math problem correctly." };
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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMac, setIsMac] = useState(true);

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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ✨ Floating Navbar - like a spaceship control panel */}
      <nav
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          "px-8 py-4 rounded-full",
          "backdrop-blur-md bg-white/70 border border-gray-200/50",
          "shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
          scrolled && "top-4 bg-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
        )}
      >
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-900 font-bold text-lg hover:text-blue-600 transition-colors">
            JB<span className="text-blue-600">.</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <a href="#contact" className="ml-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors text-sm font-medium whitespace-nowrap">
            Let's Talk
          </a>
        </div>
      </nav>

      {/* 🚀 Hero Section - where the magic begins */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <span className="text-blue-600 text-sm font-medium">Fractional CTO</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
              Turning Ideas Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 leading-tight">
                Digital Reality
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              I help close the gap between ambitious goals and reality,
              providing technical leadership that scales with your business.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <a
                href="#services"
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                View Services
              </a>
              <a
                href="/resume"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all inline-block"
              >
                View CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 👨‍💻 About Me Section - get to know me */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            About Me <span className="text-blue-600">👋</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl blur-xl opacity-30"></div>
              <img
                src="/me.jpg"
                alt="Jake Berg"
                className="relative rounded-2xl shadow-xl w-full max-w-md mx-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-3 text-gray-700">
                <p className="text-xl font-medium text-gray-900">
                  Canadian turned American, builder at heart.
                </p>
                <p>
                  When I'm not crafting digital experiences, you'll find me in my workshop learning woodworking,
                  or outside spending way too much time perfecting my bermudagrass lawn. I'm currently dreaming
                  of that new reel mower.
                </p>
                <p>
                  I'm passionate about React and the whole Remix/React Router v7 movement, but I pride myself
                  on adapting to any stack or language. The best tool is the one that solves the problem. I'm also a big fan of AI and how it can be used to make our lives easier and more efficient.
                </p>
                <p>
                  Life outside code: Married with two energetic boys, one loyal dog, and one cat who thinks
                  they run the place. They keep me grounded and remind me why building great things matters.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  "🇨🇦 → 🇺🇸 Dual Citizen",
                  "🪵 Woodworking Enthusiast",
                  "⚛️ React Advocate",
                  "🏡 Lawn Perfectionist",
                  "👨‍💻 Nodejs Expert"
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💫 Fractional CTO Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            My services <span className="text-blue-600"> 🎯</span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Technical leadership that scales with your needs. Choose the engagement level that fits your business.
          </p>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Strategy Call */}
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-bl-full opacity-50" />
              <div className="relative">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Strategy Session</h3>
                <p className="text-blue-600 font-semibold mb-4">One-Time Consultation</p>
                <div className="space-y-3 text-gray-700">
                  <p className="font-medium">Perfect for immediate guidance:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Architecture review & recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Technology stack evaluation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Roadmap planning for future success</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Team structure recommendations</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 pt-4">
                    Get clarity on your technical direction with actionable insights you can implement immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Sessions */}
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-bl-full opacity-50" />
              <div className="relative">
                <div className="text-3xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Weekly Checkins</h3>
                <p className="text-blue-600 font-semibold mb-4">Ongoing Support</p>
                <div className="space-y-3 text-gray-700">
                  <p className="font-medium">Continuous technical oversight:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Weekly progress reviews</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Code review & quality assurance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Security vulnerability analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Process improvement suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Strategic technical guidance</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 pt-4">
                    Stay on track with regular check-ins and proactive problem-solving.
                  </p>
                </div>
              </div>
            </div>

            {/* Part-Time CTO */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                Flexible Hours
              </div>
              <div className="relative">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fractional CTO</h3>
                <p className="text-blue-600 font-semibold mb-4">Hands-On Leadership</p>
                <div className="space-y-3 text-gray-700">
                  <p className="font-medium">Full technical leadership:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Active team management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Hands-on coding & architecture</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Infrastructure deployment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Executive alignment meetings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Product vision to development bridge</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 pt-4">
                    Get a seasoned CTO without the full-time commitment or cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Startup Focus Section - direct message to founders */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-bl-full opacity-30" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hey, I'm Jake Berg, and you're a startup—
                <span className="block text-blue-600 mt-2">I help close the gap between ambitious goals and reality.</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  You need to focus on marketing and sales. I want you to know that your software is being handled
                  so you can focus on the parts that you do best.
                </p>
                <p className="font-semibold text-gray-900">
                  I focus on the future and what you will need. From scalable code to hiring a team.
                </p>
              </div>

              {/* Companies section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Companies I've worked with</h3>
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="flex justify-center">
                    <a
                      href="https://www.dubsado.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <img
                        src="/dubsado-logo.webp"
                        alt="Dubsado"
                        className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.socialcurator.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <img
                        src="/social-curator-logo.png"
                        alt="Social Curator"
                        className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.robolike.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <img
                        src="/robolike-logo.png"
                        alt="RoboLike"
                        className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📬 Contact Section - let's connect */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-600">
              Let's transform your vision into reality. I'm just a message away.
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
                <p className="text-green-700 font-medium">Message sent successfully!</p>
                <p className="text-green-600 text-sm mt-1">I'll get back to you as soon as possible.</p>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none placeholder-gray-400"
                  placeholder="Tell me about your project..."
                />
              </div>
              <div>
                <label htmlFor="verification" className="block text-sm font-medium text-gray-700 mb-2">
                  What is 3 + 4? (Anti-bot verification)
                </label>
                <input
                  type="text"
                  name="verification"
                  id="verification"
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Type your answer..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message
                    <span className="text-xs opacity-75 font-normal">
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
              className="w-12 h-12 flex items-center justify-center bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jakedaneberg"
              className="w-12 h-12 flex items-center justify-center bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 🌟 Footer - the sign-off */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} Jake Berg. Crafted with passion and pixels.</p>
        </div>
      </footer>
    </div>
  );
}