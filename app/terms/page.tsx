import Link from "next/link";
import { Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <nav className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          LearnEarn <span className="gradient-text">360</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using LearnEarn 360, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">2. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">3. Subscriptions & Billing</h2>
            <p>Premium subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis within 30 days of purchase.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">4. User Content</h2>
            <p>You retain ownership of content you post but grant LearnEarn 360 a license to display, distribute, and promote it within the platform. You agree not to post unlawful, abusive, or infringing content.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">5. Community Conduct</h2>
            <p>Harassment, spam, hate speech, and fraudulent earning claims are prohibited. Violations may result in account suspension or termination.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">6. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, at our discretion.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">7. Limitation of Liability</h2>
            <p>LearnEarn 360 is provided "as is" without warranties. We are not liable for indirect or consequential damages arising from your use of the platform.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">8. Contact</h2>
            <p>Questions about these terms can be sent to legal@learnearn360.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
