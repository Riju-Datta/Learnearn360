import Link from "next/link";
import { Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
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
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly (name, email, profile details) and information generated through your use of the platform (posts, course progress, XP activity).</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use your data to provide and improve the service, personalize your learning path, process payments, send notifications, and maintain platform safety.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">3. Data Sharing</h2>
            <p>We do not sell your personal data. We share data with service providers (Stripe for payments, Resend for email, hosting providers) strictly to operate the platform.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">4. Cookies</h2>
            <p>We use cookies for authentication sessions and basic analytics. You can control cookies through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">5. Data Retention</h2>
            <p>We retain your data while your account is active. You may request account deletion at any time from Settings.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">6. Your Rights</h2>
            <p>Depending on your location, you may have rights to access, correct, export, or delete your personal data. Contact privacy@learnearn360.com to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">7. Security</h2>
            <p>We use industry-standard encryption and access controls to protect your data, though no system is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">8. Contact</h2>
            <p>Questions about this policy can be sent to privacy@learnearn360.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
