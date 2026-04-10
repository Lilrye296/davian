"use client";

import { useState, useEffect, useRef } from "react";

/* ─── In-memory waitlist (swap for Supabase later) ─────────────────────────── */
const waitlistEmails: string[] = [];

/* ─── Static data ──────────────────────────────────────────────────────────── */
const CHAT_MESSAGES = [
  {
    role: "davian" as const,
    text: "Hey! I'm Davian. Before we get started, I'd love to learn about you. What's the single biggest goal you're working toward right now?",
  },
  {
    role: "user" as const,
    text: "I want to save $15,000 for a house down payment by next year.",
  },
  {
    role: "davian" as const,
    text: "That's a great goal. Let's work backwards — that's about $1,250 per month. Do you currently track your spending?",
  },
  {
    role: "user" as const,
    text: "Not really, I just check my bank account sometimes.",
  },
  {
    role: "davian" as const,
    text: "No worries, that's exactly what I'm here for. I'll help you see where your money goes and connect it to this goal. Let me ask you a few more things...",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I've tried every productivity app. Davian is the first one that actually knows what I'm working toward.",
    name: "Alex R.",
    title: "Product Manager",
  },
  {
    quote:
      "The onboarding conversation alone was worth it. I realized things about my spending I'd never noticed.",
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
    description:
      "Davian interviews you about your life, goals, money, and what matters most.",
  },
  {
    num: "02",
    title: "Get your personal command center",
    description:
      "Your dashboard adapts to you — your goals, your tasks, your finances, all in one place.",
  },
  {
    num: "03",
    title: "Watch it get smarter every day",
    description:
      "Every check-in teaches Davian more about you. It spots patterns, flags risks, and keeps you on track.",
  },
];

/* ─── DavianLogo ───────────────────────────────────────────────────────────── */
function DavianLogo({ small = false }: { small?: boolean }) {
  const size = small ? 17 : 22;
  return (
    <div className={`flex items-center ${small ? "gap-2" : "gap-2.5"}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {/* North-star / compass mark */}
        <path
          d="M12 2 L13.6 9.4 L21 12 L13.6 14.6 L12 22 L10.4 14.6 L3 12 L10.4 9.4 Z"
          fill="#1B2A4A"
        />
        {/* Gold centre dot */}
        <circle cx="12" cy="12" r="2" fill="#C9A96E" />
      </svg>
      <span
        className={`font-semibold tracking-tight text-navy ${
          small ? "text-[15px]" : "text-xl"
        }`}
      >
        Davian
      </span>
    </div>
  );
}

/* ─── WaitlistForm ─────────────────────────────────────────────────────────── */
function WaitlistForm({
  id,
  showNote = false,
}: {
  id: string;
  showNote?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    waitlistEmails.push(email.trim().toLowerCase());
    setSubmitted(true);
    setError("");
  };

  if (submitted) {
    return (
      <div className="flex max-w-md items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="10" fill="#C9A96E" fillOpacity="0.2" />
          <path
            d="M6 10l3 3 5-5"
            stroke="#C9A96E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm font-medium text-navy">
          You&apos;re on the list. We&apos;ll be in touch when early access opens.
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email address"
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
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </form>
      {showNote && (
        <p className="mt-3 text-xs text-navy/40">
          Early access launching soon. Be first in line.
        </p>
      )}
    </div>
  );
}

/* ─── ChatMockup ───────────────────────────────────────────────────────────── */
function TypingDots({ role }: { role: "davian" | "user" }) {
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-center gap-[5px] rounded-2xl px-4 py-3 ${
          role === "user"
            ? "rounded-br-[4px] bg-[rgba(201,169,110,0.22)]"
            : "rounded-bl-[4px] bg-[rgba(255,255,255,0.12)]"
        }`}
      >
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="block h-[6px] w-[6px] animate-bounce rounded-full bg-white/50"
            style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingRole, setTypingRole] = useState<"davian" | "user" | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(0);
    setTypingRole(null);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let delay = 900;

    CHAT_MESSAGES.forEach((msg, i) => {
      // Typing duration scales with message length
      const typingDuration = Math.min(Math.max(msg.text.length * 22, 900), 2400);

      // Show typing indicator
      timeouts.push(setTimeout(() => setTypingRole(msg.role), delay));
      delay += typingDuration;

      // Reveal message, clear indicator
      timeouts.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          setTypingRole(null);
        }, delay)
      );
      delay += 650;
    });

    // Loop: restart after a pause
    timeouts.push(setTimeout(() => setAnimKey((k) => k + 1), delay + 4500));

    return () => timeouts.forEach(clearTimeout);
  }, [animKey]);

  // Auto-scroll to bottom as messages appear
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleCount, typingRole]);

  return (
    <div className="mx-auto w-[300px] sm:w-[320px]">
      {/* Phone shell */}
      <div
        className="overflow-hidden rounded-[2.75rem] bg-navy"
        style={{
          boxShadow:
            "0 50px 100px -20px rgba(27,42,74,0.5), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-[11px] font-medium text-white/40">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-gold/70" />
            <span className="text-[11px] font-medium text-white/40">
              Davian
            </span>
          </div>
          {/* Signal bars */}
          <div className="flex items-end gap-[2px]">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-sm bg-white"
                style={{ height: `${h}px`, opacity: i < 2 ? 0.7 : 0.25 }}
              />
            ))}
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/[0.18]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2 L13.6 9.4 L21 12 L13.6 14.6 L12 22 L10.4 14.6 L3 12 L10.4 9.4 Z"
                fill="#C9A96E"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Davian</p>
            <p className="text-[11px] text-white/40">AI Life Companion</p>
          </div>
        </div>

        {/* Message list */}
        <div
          ref={chatRef}
          className="hide-scrollbar h-[375px] overflow-y-auto px-4 py-4"
        >
          <div className="flex flex-col gap-2">
            {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animation: "msgIn 0.28s ease-out both" }}
              >
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-[4px] bg-[rgba(201,169,110,0.22)] text-white"
                      : "rounded-bl-[4px] bg-[rgba(255,255,255,0.12)] text-white/90"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typingRole && <TypingDots role={typingRole} />}
          </div>
        </div>

        {/* Fake input bar */}
        <div className="flex items-center gap-2 border-t border-white/[0.08] bg-white/[0.04] px-4 py-3">
          <div className="flex-1 rounded-full bg-white/[0.08] px-4 py-2 text-xs text-white/25">
            Message Davian...
          </div>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/80"
            aria-hidden="true"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-navy">
      {/* ── Nav ── */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <DavianLogo />
      </nav>

      {/* ── Hero ── */}
      <section
        id="waitlist"
        className="mx-auto max-w-4xl px-6 pb-20 pt-14 text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Now accepting early access signups
        </div>

        <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
          The AI that actually learns who you are.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-navy/55">
          Before Davian helps you, it interviews you. A personalized AI
          conversation maps your goals, finances, habits, and priorities —
          then connects the dots no other app can see.
        </p>

        <div className="flex justify-center">
          <WaitlistForm id="hero-form" showNote />
        </div>
      </section>

      {/* ── Chat Mockup ── */}
      <section className="px-6 py-16">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-gold">
          See it in action
        </p>
        <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-navy">
          Your onboarding starts with a real conversation.
        </h2>
        <ChatMockup />
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Built for people who want more than another app.
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-navy/[0.07] bg-[#F9F8F6] p-8 transition-all hover:border-gold/30 hover:shadow-sm"
              >
                {/* Opening quote */}
                <span className="mb-4 block font-serif text-5xl leading-none text-gold/45">
                  &ldquo;
                </span>
                <p className="mb-7 text-sm leading-relaxed text-navy/65">
                  {t.quote}
                </p>
                <div className="border-t border-navy/[0.06] pt-4">
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-navy/40">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-gold">
            How it works
          </p>
          <h2 className="mb-16 text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            From first conversation to full clarity.
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num}>
                <span className="mb-3 block select-none text-6xl font-extrabold leading-none text-navy/[0.06]">
                  {s.num}
                </span>
                <h3 className="mb-3 text-lg font-semibold text-navy">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-navy/55">
                  {s.description}
                </p>
              </div>
            ))}
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
