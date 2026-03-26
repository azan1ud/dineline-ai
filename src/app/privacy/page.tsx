import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — DineLine",
};

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="text-[14px] text-[#999] mb-12">Last updated: 26 March 2026</p>

        <div className="space-y-10 text-[16px] leading-[1.8] text-[#444]">
          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">1. Who we are</h2>
            <p>
              DineLine (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides AI-powered phone answering and booking services for restaurants. Our website is getdineline.com. If you have questions about this policy, email us at hello@getdineline.com.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">2. Information we collect</h2>
            <p className="mb-3">We collect information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>When you contact us:</strong> name, email address, phone number, and any details you provide about your restaurant.</li>
              <li><strong>When you book a demo:</strong> name, email, and scheduling information via our booking platform (Cal.com).</li>
              <li><strong>When you use our service:</strong> call recordings, booking data, and caller information processed on behalf of your restaurant.</li>
              <li><strong>Automatically:</strong> basic analytics data such as page views, browser type, and referring pages. We do not use tracking cookies for advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">3. How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our AI phone answering service.</li>
              <li>To communicate with you about your account, demos, or support requests.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To send you service-related updates. We will not send marketing emails without your consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">4. Data sharing</h2>
            <p>
              We do not sell your data. We share information only with service providers that help us operate (payment processing, hosting, telephony), and only to the extent necessary. All providers are bound by data processing agreements.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">5. Call recordings</h2>
            <p>
              Calls handled by DineLine may be recorded to provide the service and for quality assurance. Callers are informed at the start of each call. Restaurant owners can access and delete recordings from their dashboard. Recordings are stored securely and retained for 90 days unless otherwise requested.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">6. Data retention</h2>
            <p>
              We keep your data for as long as your account is active or as needed to provide the service. If you cancel, we delete your data within 30 days unless we are required by law to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">7. Your rights</h2>
            <p>
              Under UK GDPR, you have the right to access, correct, delete, or export your personal data. You can also object to processing or withdraw consent at any time. To exercise these rights, email hello@getdineline.com.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">8. Security</h2>
            <p>
              We use industry-standard security measures including encryption in transit (TLS) and at rest. Access to personal data is restricted to authorised personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">9. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes by email or through our website. The &quot;last updated&quot; date at the top reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">10. Contact</h2>
            <p>
              For any privacy-related questions or requests, contact us at{" "}
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
