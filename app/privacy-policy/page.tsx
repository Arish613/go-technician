export const metadata = {
  title: "Privacy Policy | Go Technicians",
  description: "Read our Privacy Policy to understand how Go Technicians collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://www.gotechnicians.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 09, 2025";

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <section className="mb-10 space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Privacy Policy
          </span>
          <h1 className="text-4xl font-bold text-slate-900">
            Privacy Policy - Gotechnicians
          </h1>
          <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
        </section>

        <section className="space-y-6">
          {/* Section 1: Introduction */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Welcome to Gotechnicians (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you visit www.gotechnicians.com (the &ldquo;Website&rdquo;), use our services, or interact with us.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              By accessing or using our Website and services, you consent to the practices described in this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
            </p>
          </article>

          {/* Section 2: Information We Collect */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We may collect the following types of information:
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 text-sm text-slate-600">
              <li>
                <span className="font-medium">Personal Information:</span> Information you provide directly such as your name, email address, phone number, service address, and other contact details.
              </li>
              <li>
                <span className="font-medium">Account Information:</span> Information collected when you register an account with us, including username and password.
              </li>
              <li>
                <span className="font-medium">Service Details:</span> Details about the services you request, including service type, technician preferences, booking details, and reviews/ratings.
              </li>
              <li>
                <span className="font-medium">Device & Log Data:</span> Automatically collected technical data such as IP address, browser type, device information, pages visited, and interaction details.
              </li>
              <li>
                <span className="font-medium">Payment Information:</span> We may collect payment details required to process a service transaction. We do not store payment card data — all payments are processed by secure third-party payment processors.
              </li>
              <li>
                <span className="font-medium">Location Data:</span> Information about your estimated location when using services to help match you with nearby technicians.
              </li>
              <li>
                <span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies and similar technologies to enhance user experience and track usage patterns. You may control cookies via your browser settings.
              </li>
            </ul>
          </article>

          {/* Section 3: How We Use Your Information */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Information</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We use your information for purposes including but not limited to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>To provide, operate, and improve our services.</li>
              <li>To communicate with you about bookings, support, and updates.</li>
              <li>To personalize your experience.</li>
              <li>To send promotional and marketing communications (only with your consent).</li>
              <li>To fulfill legal and regulatory obligations.</li>
              <li>To analyse trends and usage to enhance Website performance.</li>
            </ul>
          </article>

          {/* Section 4: Disclosure of Your Information */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">4. Disclosure of Your Information</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We may share your personal data in the following circumstances:
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 text-sm text-slate-600">
              <li>
                <span className="font-medium">Service Providers:</span> Third parties who assist in delivering our services (e.g., payment processors, hosting providers).
              </li>
              <li>
                <span className="font-medium">Legal Requirements:</span> When required by law, court order, or government request.
              </li>
              <li>
                <span className="font-medium">Security and Safety:</span> To prevent fraud or safety issues, or to protect rights, property, or safety of users.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In the event of merger, acquisition, or asset sale, information may be transferred with notice to users.
              </li>
            </ul>
          </article>

          {/* Section 5: Your Choices and Rights */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">5. Your Choices and Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              You have the following rights:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>
                <span className="font-medium">Access & Correction:</span> Update your personal information through account settings.
              </li>
              <li>
                <span className="font-medium">Opt-Out:</span> You can opt out of promotional communications.
              </li>
              <li>
                <span className="font-medium">Data Deletion:</span> Request deletion of your account and associated data by contacting us.
              </li>
              <li>
                <span className="font-medium">Cookies:</span> Manage or disable cookies via browser settings.
              </li>
            </ul>
          </article>

          {/* Section 6: Security */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">6. Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We implement reasonable security measures to protect your information. However, no online system is completely secure; we cannot guarantee absolute protection.
            </p>
          </article>

          {/* Section 7: Children's Privacy */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">7. Children&apos;s Privacy</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Our services are intended for users aged 18 years and above. We do not knowingly collect personal data from children under 18.
            </p>
          </article>

          {/* Section 8: Changes to This Policy */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">8. Changes to This Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo; date will change to indicate the revision date. Continued use of our Website after changes constitutes your acceptance of these changes.
            </p>
          </article>

          {/* Section 9: Contact Us */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">9. Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              If you have any questions about this Privacy Policy or wish to exercise your rights, contact us:
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:gotechnicians.com@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  gotechnicians.com@gmail.com
                </a>
              </p>
              <p>
                <span className="font-medium">Address:</span> 4th Floor &ldquo;C&rdquo; Wing, Fakir Shah Apartment,<br />
                Thane – 400612, Maharashtra, India
              </p>
            </div>
          </article>
        </section>

        <section className="mt-12 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-600/10 to-sky-500/10 p-6 text-sm text-slate-600">
          By using Go Technicians, you acknowledge and agree to this Privacy Policy. For additional policies, please visit our Terms & Conditions page.
        </section>
      </div>
    </main>
  );
}
