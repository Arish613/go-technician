export const metadata = {
  title: "Refund Policy | Go Technicians",
  description: "Read our Refund Policy to understand the conditions under which refunds may be issued for our home services.",
  alternates: {
    canonical: "https://www.gotechnicians.com/refund-policy",
  },
};

export default function RefundPolicyPage() {
  const lastUpdated = "March 09, 2025";

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <section className="mb-10 space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Refund Policy
          </span>
          <h1 className="text-4xl font-bold text-slate-900">
            Refund Policy – Gotechnicians
          </h1>
          <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
        </section>

        <section className="space-y-6">
          {/* Section 1: Introduction */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              At Gotechnicians, customer satisfaction is our top priority. We aim to provide reliable and professional home services. However, if you are not satisfied with a service or if a booking is cancelled, this Refund Policy explains the conditions under which refunds may be issued.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              By using our website and services, you agree to this Refund Policy.
            </p>
          </article>

          {/* Section 2: Service Booking & Payments */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">2. Service Booking & Payments</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>All services are provided on an advance booking or pay-after-service basis.</li>
              <li>Payments can be made online or in cash, depending on the service.</li>
              <li>Online payments are processed securely through third-party payment gateways.</li>
              <li>Gotechnicians does not store customer payment card or UPI details.</li>
            </ul>
          </article>

          {/* Section 3: Cancellation Policy */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">3. Cancellation Policy</h2>
            
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-800">Customer-Initiated Cancellation</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                If a service is cancelled before the technician is assigned or dispatched, a refund may be issued.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>If the technician has already reached the service location, cancellation charges may apply.</li>
                <li>No refund will be provided if the service has already started.</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-800">Gotechnicians-Initiated Cancellation</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                If Gotechnicians cancels a service due to unavailability of technicians or operational issues, a full refund will be issued for prepaid services.
              </p>
            </div>
          </article>

          {/* Section 4: Refund Eligibility */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">4. Refund Eligibility</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Refunds may be applicable in the following cases:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Technician did not arrive for the scheduled service</li>
              <li>Service was cancelled after payment but before service commencement</li>
              <li>Service quality issues reported with valid evidence</li>
              <li>Incorrect or duplicate payment charged</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Refund approval is subject to internal verification by Gotechnicians.
            </p>
          </article>

          {/* Section 5: Non-Refundable Cases */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">5. Non-Refundable Cases</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Refunds will not be provided in the following situations:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Service has been successfully completed</li>
              <li>Customer was unavailable at the scheduled service time</li>
              <li>Incorrect address or contact details provided by the customer</li>
              <li>Cost of spare parts, consumables, or materials used</li>
              <li>Emergency or express service bookings</li>
            </ul>
          </article>

          {/* Section 6: Refund Request Process */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">6. Refund Request Process</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Refund requests must be raised within 24–48 hours of the service date.</li>
              <li>Customers must provide booking details and payment proof.</li>
              <li>Once approved, refunds will be processed within 7–10 working days.</li>
            </ul>
          </article>

          {/* Section 7: Mode of Refund */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">7. Mode of Refund</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Online payments will be refunded to the original payment method.</li>
              <li>For cash payments, refunds may be issued via bank transfer or digital wallet, as applicable.</li>
            </ul>
          </article>

          {/* Section 8: Changes to This Refund Policy */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">8. Changes to This Refund Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Gotechnicians reserves the right to update or modify this Refund Policy at any time. Any changes will be reflected on this page with an updated revision date.
            </p>
          </article>

          {/* Section 9: Contact Us */}
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">9. Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              For any refund-related questions or support, please contact us:
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
          By using Go Technicians, you acknowledge and agree to this Refund Policy. For additional policies, please visit our Terms & Conditions and Privacy Policy pages.
        </section>
      </div>
    </main>
  );
}
