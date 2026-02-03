import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const serviceBenefits = [
  "High-Quality AC Repairs",
  "Experienced AC Service Engineers",
  "90-days warranty on spare parts",
  "AC AMC (Annual Maintenance) Plans Available",
  "30-days warranty on service",
];

export function Benefit() {
  return (
    <section className="py-8 md:py-10 px-4 md:px-0 max-w-xl mx-auto hidden md:block">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            AC Repairs &amp; Maintenance Service
          </h2>
          <ul className="space-y-3">
            {serviceBenefits.map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="text-teal-600 w-5 h-5" />
                <span className="text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-gray-600 mt-4">
          <p className="mt-2">
            Have questions on your mind?{" "}
            <Link href="#faqs" className="underline text-blue-700">
              Read The FAQs
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}