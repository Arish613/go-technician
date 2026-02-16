import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Go Technicians",
  description: "Read the terms and conditions for using Go Technicians' services. Your trust and safety are our priority.",
  alternates: {
    canonical: "https://www.gotechnicians.com/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "July 09, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using Go Technicians’ website, mobile application, or services, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part, please discontinue use immediately.",
    },
    {
      title: "Services & Eligibility",
      content:
        "We connect customers with verified technicians for AC, appliance, laptop, cleaning, plumbing, and related services. You must be at least 18 years old and legally capable of entering into a binding contract. We reserve the right to refuse or cancel service at our discretion.",
    },
    {
      title: "Bookings & Cancellations",
      points: [
        "A booking is confirmed only after you receive a confirmation SMS/email.",
        "You may reschedule or cancel up to 2 hours before the appointment without charges.",
        "Late cancellations/no-shows may incur a visit fee to compensate the technician.",
        "We may reschedule due to unforeseen circumstances and will notify you promptly.",
      ],
    },
    {
      title: "Pricing & Payments",
      points: [
        "Prices shared before service are estimates; final charges depend on inspection and agreed scope.",
        "Payments can be made via UPI, cards, net banking, wallets, or cash (where allowed).",
        "Invoices are emailed/SMS’d within 24 hours of completion.",
        "Taxes and spare-part costs are extra unless stated otherwise.",
      ],
    },
    {
      title: "Warranty & Liability",
      points: [
        "Most services include a 30-day workmanship warranty unless otherwise communicated.",
        "Warranty is void if third-party tampering, misuse, or unpaid dues are detected.",
        "Go Technicians is not liable for indirect, incidental, or consequential damages.",
        "Maximum liability is limited to the amount paid for the specific service.",
      ],
    },
    {
      title: "User Responsibilities",
      points: [
        "Provide accurate contact, address, and service details.",
        "Ensure safe access to premises and disclose existing issues (power, water, prior repairs, etc.).",
        "Do not engage technicians for off-platform work; such engagements void warranties.",
        "Treat technicians with respect; abusive behavior will lead to service termination.",
      ],
    },
    {
      title: "Intellectual Property",
      content:
        "All trademarks, content, logos, and media on the platform belong to Go Technicians. You may not copy, reproduce, distribute, or exploit any content without prior written consent.",
    },
    {
      title: "Updates to Terms",
      content:
        "We may amend these Terms occasionally. Continued use after updates constitutes acceptance. Material changes will be notified via email, SMS, or app notifications.",
    },
    {
      title: "Contact",
      points: [
        "4th Floor “C” Wing, Fakir Shah Apartment, Thane – 400612, Maharashtra, India",
        "Email: gotechnicians.com@gmail.com"
      ]
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <section className="mb-10 space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Terms & Conditions
          </span>
          <h1 className="text-4xl font-bold text-slate-900">
            Service Terms & User Agreement
          </h1>
          <p className="text-base text-slate-600">
            These Terms govern your access to Go Technicians’ products, website,
            and services. Please read them carefully before booking or using our
            platform.
          </p>
          <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </section>

        <section className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {section.title}
              </h2>
              {section.content && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {section.content}
                </p>
              )}
              {section.points && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-600/10 to-sky-500/10 p-6 text-sm text-slate-600">
          By using Go Technicians, you acknowledge and agree to these Terms &
          Conditions. For additional policies, please visit our <Link href={"/privacy-policy"} className="hover:text-blue-500 hover:underline">Privacy Policy</Link> {" "}
          and {" "}<Link href={"/refund-policy"} className="hover:text-blue-500 hover:underline"> Refund Policy </Link> pages.
        </section>
      </div>
    </main>
  );
}
