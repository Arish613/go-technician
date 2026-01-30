export const metadata = {
  title: "Disclaimer | Go Technicians",
  description: "Read the disclaimer for Go Technicians regarding service information, liability, and website usage.",
  alternates: {
    canonical: "https://www.gotechnicians.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  const lastUpdated = "December 29, 2025";

  const sections = [
    {
      title: "Service & Information Accuracy",
      body: "All service descriptions, pricing, and timelines are provided for general guidance. Actual scope and cost may vary after on-site inspection. While we strive for accuracy, errors or omissions may occur, and we reserve the right to correct them without prior notice.",
    },
    {
      title: "Third‑Party Technicians",
      body: "Go Technicians works with verified professionals but does not employ them directly in every city. Each technician is responsible for workmanship, safety, and adherence to local regulations. We act as a facilitator and are not liable for direct agreements made outside our platform.",
    },
    {
      title: "Liability Limitation",
      body: "To the fullest extent permitted by law, Go Technicians is not responsible for any indirect, incidental, or consequential damages resulting from service delays, cancellations, or third-party conduct. Any claim is limited to the amount paid for the affected booking.",
    },
    {
      title: "External Links & References",
      body: "Our website or app may contain links to third-party sites or resources. These are provided for convenience only; we do not endorse, control, or guarantee the content or availability of such resources.",
    },
    {
      title: "Policy Updates",
      body: "We may revise this Disclaimer periodically. Continued use of our services or website constitutes acceptance of the updated terms. Please review this page regularly for the latest information.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <section className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Disclaimer
          </span>
          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Important Information About Our Services
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Please read this page carefully before booking or using any Go
            Technicians service.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: {lastUpdated}
          </p>
        </section>

        <section className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl bg-linear-to-r from-blue-600/15 via-sky-500/15 to-indigo-500/15 p-6 text-sm text-slate-700">
          By continuing to browse or book through Go Technicians, you
          acknowledge that you have read and understood this Disclaimer, along
          with our Terms, Privacy Policy, and Refund Policy. For clarification,
          email compliance@go-technicians.com.
        </section>
      </div>
    </main>
  );
}
