"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAFAF8]/90 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img src="/logo.svg" alt="dineline" className="h-8" />
          </a>
          <div className="hidden md:flex items-center gap-8 text-[15px] text-[#666]">
            <a href="#features" className="hover:text-[#1a1a1a] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1a1a1a] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#1a1a1a] transition-colors">Pricing</a>
          </div>
          <a
            href="#get-started"
            className="bg-[#1a1a1a] hover:bg-[#333] text-white text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Book a demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[720px]">
            <p className="text-[14px] font-medium text-[#888] uppercase tracking-widest mb-6">
              For restaurants that pick up the phone
            </p>
            <h1
              className="text-[52px] md:text-[72px] leading-[1.05] font-normal mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Your restaurant is losing bookings right now.
            </h1>
            <p className="text-[19px] leading-[1.7] text-[#555] max-w-[540px] mb-10">
              Every missed call is a table that stays empty. DineLine answers your phone 24/7, takes bookings, and handles the questions your staff shouldn&apos;t have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#get-started"
                className="bg-[#1a1a1a] hover:bg-[#333] text-white font-medium px-8 py-4 rounded-full text-[16px] transition-colors inline-block text-center"
              >
                Start free trial
              </a>
              <a
                href="#how-it-works"
                className="text-[#1a1a1a] font-medium px-8 py-4 text-[16px] inline-flex items-center gap-2 group"
              >
                Watch it in action
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-[#e8e8e5] p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-[#e8e8e5]">
              <div className="md:pr-12">
                <div className="text-[42px] font-semibold tracking-tight text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif)" }}>60%</div>
                <p className="text-[15px] text-[#777] leading-relaxed mt-1">of restaurant calls go unanswered during peak hours. That&apos;s real money walking out the door.</p>
              </div>
              <div className="md:px-12">
                <div className="text-[42px] font-semibold tracking-tight text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif)" }}>23 sec</div>
                <p className="text-[15px] text-[#777] leading-relaxed mt-1">Average time DineLine takes to complete a booking. No hold music, no &quot;can you spell that again?&quot;</p>
              </div>
              <div className="md:pl-12">
                <div className="text-[42px] font-semibold tracking-tight text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif)" }}>24/7</div>
                <p className="text-[15px] text-[#777] leading-relaxed mt-1">Calls answered at 2am, on Christmas, during the lunch rush. Your phone never rings out again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[14px] font-medium text-[#888] uppercase tracking-widest mb-5">The problem</p>
              <h2
                className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your staff can&apos;t cook and answer phones at the same time.
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#555]">
                The dinner rush hits. The phone rings. And rings. Your sous chef picks up with one hand while plating with the other, gets the booking wrong, and the customer shows up to no table on Friday night.
              </p>
              <p className="text-[17px] leading-[1.7] text-[#555] mt-4">
                Or worse — nobody picks up at all. The customer calls the place down the road instead. You never even knew they tried.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e8e5] p-8">
              <div className="space-y-5">
                {[
                  { label: "Missed calls during service", value: "~15/day" },
                  { label: "Revenue lost per missed booking", value: "£80 avg" },
                  { label: "Monthly cost of missed calls", value: "£1,200+" },
                  { label: "Staff hours on phone per week", value: "21 hrs" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f0ed] last:border-0">
                    <span className="text-[15px] text-[#555]">{item.label}</span>
                    <span className="text-[15px] font-semibold text-[#1a1a1a] tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[540px] mb-16">
            <p className="text-[14px] font-medium text-[#888] uppercase tracking-widest mb-5">What you get</p>
            <h2
              className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Everything a great receptionist does. Without the salary.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
            {[
              {
                title: "Answers every call",
                description: "First ring. Every time. Weekdays, weekends, bank holidays, 3am — doesn't matter. Your customers always reach someone.",
              },
              {
                title: "Takes bookings instantly",
                description: "Checks your live availability, confirms the table, sends an SMS to the customer. Done in under 30 seconds.",
              },
              {
                title: "Handles cancellations & changes",
                description: "\"Can we move to 8pm?\" \"We need to add two people.\" \"Actually, cancel Thursday.\" All handled without bothering your staff.",
              },
              {
                title: "Knows your menu",
                description: "\"Do you have gluten-free options?\" \"What's the lunch deal?\" \"Is there parking nearby?\" Answers confidently, every time.",
              },
              {
                title: "Sends confirmations & reminders",
                description: "Automatic SMS after every booking. Reminder the day before. No-shows drop because customers actually remember.",
              },
              {
                title: "Dashboard you'll actually use",
                description: "See every call, every booking, every question asked. Know your peak times, busiest days, and what customers ask most.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 bg-[#f5f5f2] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[14px] font-semibold text-[#1a1a1a]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-[#666]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[14px] font-medium text-[#888] uppercase tracking-widest mb-5">How it works</p>
            <h2
              className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Live in a day. Not a month.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Tell us about your restaurant",
                description: "A 15-minute call. We learn your menu, hours, booking rules, and how you like things done. That's all we need.",
              },
              {
                step: "2",
                title: "We set everything up",
                description: "We configure your AI, connect it to your phone line (or give you a new number), and test it until it's perfect.",
              },
              {
                step: "3",
                title: "Calls start getting answered",
                description: "That's it. Bookings come in, confirmations go out, and you check your dashboard when you want to. No training needed.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e8e8e5] p-8">
                <div
                  className="text-[64px] font-normal text-[#e8e8e5] leading-none mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-[18px] font-semibold mb-3">{item.title}</h3>
                <p className="text-[15px] leading-[1.7] text-[#666]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-[800px] mx-auto text-center">
          <p
            className="text-[28px] md:text-[36px] leading-[1.4] font-normal mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &quot;We were losing about 15 bookings a week from calls we couldn&apos;t get to during service. First week with DineLine, every single one got answered. Paid for itself before the month was out.&quot;
          </p>
          <div>
            <p className="text-[15px] font-medium text-white/90">Marco Rossi</p>
            <p className="text-[14px] text-white/50">Owner, Trattoria Bella &middot; London</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[14px] font-medium text-[#888] uppercase tracking-widest mb-5">Pricing</p>
            <h2
              className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Less than a part-time host.
            </h2>
            <p className="text-[17px] text-[#666]">No setup fees. No contracts. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            <div className="bg-white rounded-2xl border border-[#e8e8e5] p-8 md:p-10">
              <p className="text-[14px] font-medium text-[#888] uppercase tracking-wider mb-1">Starter</p>
              <p className="text-[13px] text-[#aaa] mb-6">For single-location restaurants</p>
              <div className="mb-6">
                <span className="text-[48px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>£199</span>
                <span className="text-[15px] text-[#888]">/month</span>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  "Up to 200 calls per month",
                  "Bookings, cancellations & changes",
                  "SMS confirmations",
                  "Basic dashboard",
                  "Email support",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f5f5f2] flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-[15px] text-[#555]">{item}</span>
                  </div>
                ))}
              </div>
              <a href="#get-started" className="block text-center border-2 border-[#1a1a1a] text-[#1a1a1a] font-medium py-3.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors text-[15px]">
                Get started
              </a>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-8 md:p-10 text-white relative">
              <div className="absolute top-6 right-6 bg-white/10 text-white text-[12px] font-medium px-3 py-1 rounded-full">
                Popular
              </div>
              <p className="text-[14px] font-medium text-white/50 uppercase tracking-wider mb-1">Growth</p>
              <p className="text-[13px] text-white/30 mb-6">For busy, multi-line restaurants</p>
              <div className="mb-6">
                <span className="text-[48px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>£399</span>
                <span className="text-[15px] text-white/50">/month</span>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  "Unlimited calls",
                  "Everything in Starter",
                  "Multi-language support",
                  "Advanced analytics & reports",
                  "Priority support & onboarding",
                  "Custom voice & personality",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-[15px] text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <a href="#get-started" className="block text-center bg-white text-[#1a1a1a] font-medium py-3.5 rounded-full hover:bg-white/90 transition-colors text-[15px]">
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-[700px] mx-auto">
          <h2
            className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight mb-12 text-center"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Common questions
          </h2>
          <div className="divide-y divide-[#e8e8e5]">
            {[
              {
                q: "Will my customers know it's not a real person?",
                a: "Most won't. DineLine uses natural, conversational speech — not a robotic voice. It handles interruptions, clarifications, and even small talk. We always recommend transparency though, and can include a brief disclosure if you prefer.",
              },
              {
                q: "What if a caller has a complicated request?",
                a: "DineLine handles the vast majority of calls. For anything it can't resolve — a complaint, a large event inquiry, something unusual — it takes a message and texts you immediately so you can call back.",
              },
              {
                q: "How long does setup take?",
                a: "Typically under 24 hours. We need your menu, hours, and booking rules. We handle all the technical setup — you don't need to install anything or change your systems.",
              },
              {
                q: "Can I keep my existing phone number?",
                a: "Yes. We set up call forwarding from your current number, so nothing changes for your customers. Or we can give you a new dedicated line.",
              },
              {
                q: "What happens if I want to cancel?",
                a: "Cancel anytime from your dashboard. No contracts, no exit fees, no awkward phone call with a retention team. We'll even help you transition back.",
              },
            ].map((faq, i) => (
              <details key={i} className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer text-[17px] font-medium text-[#1a1a1a] list-none">
                  {faq.q}
                  <svg className="w-5 h-5 text-[#999] group-open:rotate-45 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <p className="text-[15px] leading-[1.7] text-[#666] mt-4 pr-10">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="px-6 py-24">
        <div className="max-w-[600px] mx-auto text-center">
          <h2
            className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to stop losing bookings?
          </h2>
          <p className="text-[17px] text-[#666] mb-10 leading-relaxed">
            Leave your email and we&apos;ll set up a quick demo tailored to your restaurant. Takes 15 minutes.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                className="flex-1 bg-white border border-[#ddd] rounded-full px-6 py-4 text-[15px] text-[#1a1a1a] placeholder:text-[#aaa] focus:outline-none focus:border-[#999] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#1a1a1a] hover:bg-[#333] text-white font-medium px-8 py-4 rounded-full text-[15px] transition-colors whitespace-nowrap"
              >
                Book demo
              </button>
            </form>
          ) : (
            <div className="bg-white border border-[#e8e8e5] rounded-2xl p-10">
              <p className="text-[18px] font-semibold mb-2">We&apos;ll be in touch shortly.</p>
              <p className="text-[15px] text-[#666]">Check your inbox — we&apos;ll reach out within a few hours to schedule your demo.</p>
            </div>
          )}
          <p className="text-[13px] text-[#aaa] mt-5">No commitment required. Free 14-day trial on all plans.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e8e5] py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="#" className="flex items-center">
            <img src="/logo.svg" alt="dineline" className="h-6" />
          </a>
          <div className="flex items-center gap-6 text-[13px] text-[#999]">
            <a href="#" className="hover:text-[#666] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#666] transition-colors">Terms</a>
            <a href="mailto:hello@dinelineai.com" className="hover:text-[#666] transition-colors">hello@dinelineai.com</a>
          </div>
          <p className="text-[13px] text-[#bbb]">&copy; 2026 DineLine</p>
        </div>
      </footer>
    </div>
  );
}
