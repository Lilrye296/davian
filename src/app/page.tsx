"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Waitlist store (swap for Supabase later) ──────────────────────────────── */
const waitlistEmails: string[] = [];

/* ─── Demo data ─────────────────────────────────────────────────────────────── */
const STEP1_CARDS = [
  { id: "save",     label: "Save more money"    },
  { id: "habits",   label: "Build better habits" },
  { id: "goal",     label: "Hit a big goal"      },
  { id: "organize", label: "Get organized"       },
];

const STEP2: Record<string, { question: string; cards: { id: string; label: string }[] }> = {
  save: {
    question: "How much are you looking to save?",
    cards: [
      { id: "u5k",   label: "Under $5k"   },
      { id: "5_15k", label: "$5k – $15k"  },
      { id: "15_50k",label: "$15k – $50k" },
      { id: "50k",   label: "$50k+"        },
    ],
  },
  habits: {
    question: "Which habit area matters most?",
    cards: [
      { id: "sleep",   label: "Sleep & energy"  },
      { id: "fitness", label: "Exercise"         },
      { id: "focus",   label: "Focus & work"     },
      { id: "mind",    label: "Mindfulness"       },
    ],
  },
  goal: {
    question: "What's your timeline?",
    cards: [
      { id: "1mo",  label: "This month"  },
      { id: "6mo",  label: "3–6 months"  },
      { id: "1yr",  label: "This year"   },
      { id: "long", label: "3+ years"    },
    ],
  },
  organize: {
    question: "Where do you feel most scattered?",
    cards: [
      { id: "work",  label: "Work tasks"     },
      { id: "fin",   label: "Finances"        },
      { id: "goals", label: "Personal goals"  },
      { id: "all",   label: "All of it"       },
    ],
  },
};

const DASHBOARD: Record<string, { title: string; items: string[]; stat: string }> = {
  save: {
    title: "Savings Dashboard",
    items: ["Monthly budget mapped", "$1,250/mo target set", "Spending tracked daily"],
    stat: "↑ 23% avg savings in month 1",
  },
  habits: {
    title: "Habit Tracker",
    items: ["Daily check-in routine", "3 keystone habits set", "Weekly streak review"],
    stat: "80% avg habit completion",
  },
  goal: {
    title: "Goal Roadmap",
    items: ["Milestones broken down", "Weekly actions set", "Progress tracked live"],
    stat: "3× more likely to succeed",
  },
  organize: {
    title: "Life Command Center",
    items: ["Daily priorities ready", "Projects organized", "Weekly review scheduled"],
    stat: "↓ 40% decision fatigue",
  },
};

const TESTIMONIALS = [
  {
    quote: "I've tried every productivity app. Davian is the first one that actually knows what I'm working toward.",
    name: "Alex R.",
    title: "Product Manager",
  },
  {
    quote: "The onboarding conversation alone was worth it. I realized things about my spending I'd never noticed.",
    name: "Sarah K.",
    title: "Freelance Designer",
  },
  {
    quote: "It's like having a personal advisor who remembers everything.",
    name: "Marcus T.",
    title: "Startup Founder",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Have a real conversation",
    desc: "Davian interviews you about your goals, money, and what matters most.",
  },
  {
    num: "02",
    title: "Get your command center",
    desc: "Your dashboard adapts to you — goals, tasks, and finances in one place.",
  },
  {
    num: "03",
    title: "Watch it get smarter",
    desc: "Every check-in teaches Davian more. It spots patterns and keeps you on track.",
  },
];

/* ─── Scroll-reveal component ────────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── DavianLogo ─────────────────────────────────────────────────────────────── */
// Uses the dotless-i character (ı, U+0131) with an SVG compass-star
// floating where the dot would normally be.
function DavianLogo({ small = false }: { small?: boolean }) {
  const fs   = small ? 15 : 21;
  const sw   = small ? 5  : 6.5;
  const st   = small ? -7 : -9;

  return (
    <span
      className="inline-flex select-none items-baseline text-navy"
      style={{ fontSize: fs, fontWeight: 500, letterSpacing: "-0.025em" }}
    >
      Dav
      <span className="relative inline-block">
        {/* Dotless i */}
        <span>ı</span>
        {/* Compass-star replaces the dot */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{ top: st, width: sw, height: sw }}
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M5 0.5 L6.1 3.9 L9.5 5 L6.1 6.1 L5 9.5 L3.9 6.1 L0.5 5 L3.9 3.9 Z"
            fill="#1B2A4A"
          />
        </svg>
      </span>
      an
    </span>
  );
}

/* ─── WaitlistForm ───────────────────────────────────────────────────────────── */
function WaitlistForm({
  id,
  showNote = false,
}: {
  id: string;
  showNote?: boolean;
}) {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim())       { setError("Please enter your email."); return; }
    if (!re.test(email.trim())) { setError("Please enter a valid email."); return; }
    waitlistEmails.push(email.trim().toLowerCase());
    setSubmitted(true);
    setError("");
  };

  if (submitted) {
    return (
      <div className="flex max-w-md items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="#C9A96E" fillOpacity="0.2" />
          <path d="M6 10l3 3 5-5" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-medium text-navy">
          You&apos;re on the list. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} id={id} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            placeholder="Enter your email"
            className="flex-1 rounded-xl border border-navy/20 bg-white px-4 py-3 text-sm text-navy placeholder-navy/35 transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#b8935a] active:scale-[0.98]"
          >
            Join the Waitlist
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500" role="alert">{error}</p>}
      </form>
      {showNote && (
        <p className="mt-3 text-xs text-navy/40">Early access launching soon. Be first.</p>
      )}
    </div>
  );
}

/* ─── Typing indicator ───────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-[5px] rounded-2xl rounded-bl-[4px] bg-[rgba(255,255,255,0.12)] px-4 py-3">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="block h-[6px] w-[6px] animate-bounce rounded-full bg-white/50"
            style={{ animationDelay: `${d}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Interactive onboarding demo ───────────────────────────────────────────── */
interface DemoMsg { role: "davian" | "user"; text: string; }

function OnboardingDemo() {
  const [messages,     setMessages]     = useState<DemoMsg[]>([
    { role: "davian", text: "Hey! Let's start with what matters most to you right now." },
  ]);
  const [step,         setStep]         = useState<0 | 1 | 2>(0);
  const [choice1,      setChoice1]      = useState("");
  const [isTyping,     setIsTyping]     = useState(false);
  const [cardsVisible, setCardsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleChoice = (label: string, id: string) => {
    setCardsVisible(false);
    setMessages((prev) => [...prev, { role: "user", text: label }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (step === 0) {
        const q = STEP2[id]?.question ?? "Tell me more about that.";
        setMessages((prev) => [...prev, { role: "davian", text: q }]);
        setChoice1(id);
        setStep(1);
        setTimeout(() => setCardsVisible(true), 80);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "davian",
            text: "Got it. Based on what you told me, here's what your Davian dashboard would focus on first:",
          },
        ]);
        setStep(2);
      }
    }, 1350);
  };

  const handleReset = () => {
    setMessages([{ role: "davian", text: "Hey! Let's start with what matters most to you right now." }]);
    setStep(0);
    setChoice1("");
    setIsTyping(false);
    setCardsVisible(true);
  };

  const currentCards = step === 0 ? STEP1_CARDS : (STEP2[choice1]?.cards ?? []);
  const dashboard    = DASHBOARD[choice1];
  const msgAreaH     = step === 2 ? "420px" : "310px";

  return (
    <div className="mx-auto w-[300px] sm:w-[320px]">
      <div
        className="overflow-hidden rounded-[2.75rem] bg-navy"
        style={{
          boxShadow: "0 50px 100px -20px rgba(27,42,74,0.52), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-[11px] font-medium text-white/40">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-gold/70" />
            <span className="text-[11px] font-medium text-white/40">Davian</span>
          </div>
          <div className="flex items-end gap-[2px]">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} className="w-[3px] rounded-sm bg-white"
                   style={{ height: `${h}px`, opacity: i < 2 ? 0.7 : 0.25 }} />
            ))}
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/[0.18]">
            <svg width="13" height="13" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 0.5 L6.1 3.9 L9.5 5 L6.1 6.1 L5 9.5 L3.9 6.1 L0.5 5 L3.9 3.9 Z" fill="#C9A96E" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Davian</p>
            <p className="text-[11px] text-white/40">AI Life Companion</p>
          </div>
          {step > 0 && (
            <button
              onClick={handleReset}
              className="ml-auto text-[11px] text-white/30 transition-colors hover:text-white/60"
            >
              Reset
            </button>
          )}
        </div>

        {/* Message thread */}
        <div
          ref={scrollRef}
          className="hide-scrollbar overflow-y-auto px-4 py-4"
          style={{ height: msgAreaH, transition: "height 0.4s ease" }}
        >
          <div className="flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                style={{ animation: "msgIn 0.28s ease-out both" }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-[4px] bg-[rgba(201,169,110,0.22)] text-white"
                      : "rounded-bl-[4px] bg-[rgba(255,255,255,0.12)] text-white/90"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && <TypingDots />}

            {/* Dashboard preview — step 2 */}
            {step === 2 && !isTyping && dashboard && (
              <div style={{ animation: "msgIn 0.35s ease-out both" }}>
                {/* Mini dashboard card */}
                <div className="mt-1 rounded-xl border border-white/[0.12] bg-white/[0.07] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-xs font-semibold text-gold">{dashboard.title}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {dashboard.items.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <circle cx="6" cy="6" r="5" stroke="#C9A96E" strokeWidth="1" />
                          <path d="M3.5 6l2 2 3-3" stroke="#C9A96E" strokeWidth="1"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[12px] text-white/75">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-white/[0.08] pt-2.5">
                    <span className="text-[11px] font-medium text-gold/80">{dashboard.stat}</span>
                  </div>
                </div>
                {/* CTA */}
                <button
                  onClick={() =>
                    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-3 w-full rounded-xl bg-gold py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#b8935a] active:scale-[0.98]"
                >
                  Want this for real? Join the waitlist →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Choice cards */}
        {step < 2 && !isTyping && (
          <div
            className="border-t border-white/[0.08] px-4 pb-5 pt-3"
            style={{ opacity: cardsVisible ? 1 : 0, transition: "opacity 0.18s ease" }}
          >
            <div className="grid grid-cols-2 gap-2">
              {currentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleChoice(card.label, card.id)}
                  className="rounded-xl border border-white/[0.14] bg-white/[0.06] px-3 py-2.5 text-left text-[12px] font-medium text-white/75 transition-all hover:border-gold/40 hover:bg-white/[0.12] hover:text-white active:scale-[0.96]"
                >
                  {card.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step icons ─────────────────────────────────────────────────────────────── */
function IconChat() {
  return (
    <div className="relative mb-5 h-12 w-12 shrink-0">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="34" height="26" rx="7" stroke="#C9A96E" strokeWidth="1.5" />
        <path d="M4 32 Q4 38 12 36" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
      {/* Animated dots inside bubble */}
      <div className="absolute left-[11px] bottom-[16px] flex gap-[5px]">
        {[0, 160, 320].map((d) => (
          <span
            key={d}
            className="block h-[5px] w-[5px] animate-bounce rounded-full bg-gold"
            style={{ animationDelay: `${d}ms`, animationDuration: "1.3s" }}
          />
        ))}
      </div>
    </div>
  );
}

function IconGrid() {
  return (
    <div className="mb-5 h-12 w-12 shrink-0">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="4"  y="4"  width="18" height="18" rx="4" stroke="#C9A96E" strokeWidth="1.5" />
        <rect x="26" y="4"  width="18" height="18" rx="4" stroke="#C9A96E" strokeWidth="1.5" />
        <rect x="4"  y="26" width="18" height="18" rx="4" stroke="#C9A96E" strokeWidth="1.5" />
        <rect x="26" y="26" width="18" height="18" rx="4" stroke="#C9A96E" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function IconSparkle() {
  return (
    <div className="mb-5 h-12 w-12 shrink-0">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="10" stroke="#C9A96E" strokeWidth="1.5" />
        {/* Cardinal rays */}
        <line x1="24" y1="4"  x2="24" y2="10" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="24" y2="44" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4"  y1="24" x2="10" y2="24" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="44" y2="24" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        {/* Diagonal rays (shorter) */}
        <line x1="10" y1="10" x2="14" y2="14" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="34" x2="38" y2="38" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="10" x2="34" y2="14" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="34" x2="10" y2="38" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const STEP_ICONS = [IconChat, IconGrid, IconSparkle];

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-navy">

      {/* ── Nav ── */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <DavianLogo />
      </nav>

      {/* ── Hero ── */}
      <section id="waitlist" className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Now accepting early access signups
        </div>

        {/* Headline with soft animated glow behind it */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(201,169,110,0.13) 0%, transparent 70%)",
              animation: "heroGlow 5s ease-in-out infinite",
            }}
          />
          <h1 className="mb-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            The AI that actually learns who you are.
          </h1>
        </div>

        <p className="mx-auto mb-10 max-w-sm text-lg leading-relaxed text-navy/55">
          It starts with a conversation. Then it changes everything.
        </p>

        <div className="flex justify-center">
          <WaitlistForm id="hero-form" showNote />
        </div>
      </section>

      {/* ── Interactive Demo ── */}
      <section className="px-6 py-12">
        <FadeIn className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Try it live
          </p>
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-navy">
            What matters most to you right now?
          </h2>
        </FadeIn>
        <FadeIn delay={80}>
          <OnboardingDemo />
        </FadeIn>
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h2 className="mb-14 text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Built for people who want more than another app.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                {/* Gold left border, more padding, bigger quote mark */}
                <div className="h-full rounded-2xl border-l-[3px] border-l-gold bg-[#F9F8F6] px-8 py-9 transition-all hover:shadow-md">
                  <span className="mb-4 block font-serif text-6xl leading-none text-gold/50">
                    &ldquo;
                  </span>
                  <p className="mb-8 text-sm leading-relaxed text-navy/65">{t.quote}</p>
                  <div className="border-t border-navy/[0.06] pt-4">
                    <p className="text-sm font-semibold text-navy">{t.name}</p>
                    <p className="text-xs text-navy/40">{t.title}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn className="mb-16 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
              How it works
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              From first conversation to full clarity.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <FadeIn key={s.num} delay={i * 130}>
                  <Icon />
                  <span className="mb-2 block select-none text-6xl font-extrabold leading-none text-navy/[0.06]">
                    {s.num}
                  </span>
                  <h3 className="mb-3 text-lg font-semibold text-navy">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-navy/55">{s.desc}</p>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-navy/[0.08] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <DavianLogo small />
          <p className="text-xs text-navy/35">&copy; 2026 Davian. All rights reserved.</p>
          <a
            href="#waitlist"
            className="text-xs font-medium text-gold transition-colors hover:text-[#b8935a]"
          >
            Join the waitlist &rarr;
          </a>
        </div>
      </footer>

    </div>
  );
}
