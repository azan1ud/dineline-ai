import Link from "next/link";

export const metadata = {
  title: "Terms of Service — DineLine",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]" style={{ fontFamily: "var(--font-sans)" }}>
      <nav className="border-b border-[#e8e8e5]">
        <div className="max-w-[800px] mx-auto px-6 py-5">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="DineLine" className="h-8" />
          </Link>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-6 py-16">
        <h1
          className="text-[36px] md:text-[44px] leading-[1.15] tracking-tight mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Terms of Service
        </h1>
        <p className="text-[14px] text-[#999] mb-12">Last updated: 26 March 2026</p>

        <div className="space-y-10 text-[16px] leading-[1.8] text-[#444]">
          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">1. Agreement</h2>
            <p>
              By using DineLine (&quot;the Service&quot;), you agree to these terms. The Service is provided by DineLine, contactable at hello@getdineline.com. If you do not agree with these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">2. What we provide</h2>
            <p>
              DineLine provides AI-powered phone answering, booking management, and customer communication services for restaurants. We handle incoming calls on your behalf, take reservations, answer common questions, and send confirmation messages to your customers.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">3. Your responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and up-to-date information about your restaurant (menu, hours, booking rules).</li>
              <li>Notify us promptly of any changes to your operating details.</li>
              <li>Ensure you have the right to use DineLine with your phone system.</li>
              <li>Comply with all applicable laws, including data protection regulations regarding your customers&apos; data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">4. Pricing and payment</h2>
            <p>
              Subscription fees are billed monthly in advance. Prices are listed on our website and may change with 30 days&apos; notice. All fees are in GBP and exclusive of VAT where applicable. Failure to pay may result in suspension of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">5. Free trial</h2>
            <p>
              We may offer a free trial period. During the trial, you have full access to the Service. At the end of the trial, your subscription will begin unless you cancel. No payment is taken during the trial period.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">6. Cancellation</h2>
            <p>
              You can cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. There are no exit fees or cancellation penalties. After cancellation, call forwarding will be deactivated and your data will be deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">7. Service availability</h2>
            <p>
              We aim to keep the Service available 24/7 but do not guarantee uninterrupted service. We are not liable for downtime caused by factors outside our control, including third-party telephony providers, internet outages, or force majeure events.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">8. AI limitations</h2>
            <p>
              DineLine uses artificial intelligence to handle calls. While we strive for accuracy, the AI may occasionally misunderstand callers or provide imperfect responses. We are not liable for errors made by the AI in handling bookings or answering questions. Complex or unusual requests are escalated to you via text notification.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">9. Liability</h2>
            <p>
              To the maximum extent permitted by law, DineLine&apos;s total liability to you for any claims arising from the Service is limited to the fees you have paid in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages, including lost revenue or missed bookings.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">10. Intellectual property</h2>
            <p>
              All content, software, and technology used to provide DineLine remains our property. You may not copy, modify, reverse-engineer, or resell any part of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">11. Changes to terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of material changes at least 14 days in advance via email. Continued use of the Service after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">12. Governing law</h2>
            <p>
              These terms are governed by the laws of England and Wales. Any disputes will be resolved in the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">13. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@getdineline.com" className="underline hover:text-[#1a1a1a]">hello@getdineline.com</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#e8e8e5] py-8 px-6">
        <div className="max-w-[800px] mx-auto flex items-center justify-between text-[13px] text-[#999]">
          <p>&copy; 2026 DineLine</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#666] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#666] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
