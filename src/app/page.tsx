"use client";

import { useState } from "react";

// In-memory waitlist store — replace with Supabase later
const waitlistEmails: string[] = [];

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
      <div className="flex items-center gap-3 max-w-md rounded-xl border border-gold/30 bg-navy/5 px-5 py-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="10" fill="#C9A96E" fillOpacity="0.15" />
          <path
            d="M6 10l3 3 5-5"
            stroke="#C9A96E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm font-medium text-navy">
          You&apos;re on the list! We&apos;ll reach out when early access launches.
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
            className="flex-1 rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder-navy/35 transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
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
        <p className="mt-3 text-xs text-navy/45">
          Early access launching soon. Be first in line.
        </p>
      )}
    </div>
  );
}

const features = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A96E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Personalized Onboarding",
    description:
      "Davian starts by getting to know you — your goals, values, habits, and financial situation — through a guided AI conversation.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A96E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Life Dashboard",
    description:
      "Track your goals, manage daily tasks, and get weekly AI-generated reviews that spot patterns you'd miss.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A96E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Smart Finance Tracking",
    description:
      "Log spending, set budgets, and get AI insights that connect your money habits to your life goals.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-navy">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold tracking-tight text-navy">
          Davian
        </span>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-28 pt-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Now accepting early access signups
        </div>

        <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
          Meet Davian. Your AI companion that knows your goals, your money, and
          your priorities.
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-navy/60">
          Davian learns who you are through a personalized onboarding
          conversation, then helps you stay on track across your entire life —
          finances, goals, and daily priorities — all connected by an AI that
          actually knows you.
        </p>

        <div className="flex justify-center">
          <WaitlistForm id="hero-form" showNote />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-navy/8 bg-[#F9F8F6] p-8 transition-all hover:border-gold/30 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-navy/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "One AI" Section */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <div className="mb-4 flex justify-center">
          <span className="h-px w-12 bg-gold/40 self-center" />
          <span className="mx-4 text-xs font-medium uppercase tracking-widest text-gold/70">
            The Davian difference
          </span>
          <span className="h-px w-12 bg-gold/40 self-center" />
        </div>
        <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          One AI. Your whole life. All connected.
        </h2>
        <p className="text-lg leading-relaxed text-navy/60">
          Most apps track one thing. Davian connects everything. It notices when
          your spending conflicts with your savings goals. It reminds you of
          priorities you set last month. It gets smarter about you every single
          day.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy/8 bg-white px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-1 text-2xl font-semibold text-navy">Davian</p>
          <p className="mb-8 text-sm text-navy/50">
            Be among the first to experience Davian when we launch.
          </p>
          <div className="flex justify-center">
            <WaitlistForm id="footer-form" showNote />
          </div>
          <p className="mt-10 text-xs text-navy/35">
            &copy; 2026 Davian. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
