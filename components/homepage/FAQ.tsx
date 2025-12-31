import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "What services does SuperSavvy/Go Technicians offer?",
    answer:
      "We offer a wide range of home and office services including AC repair, laptop service, appliance repair, home cleaning, laundry, plumbing, electrical work, pest control, and more. All services are provided by verified and trained professionals.",
  },
  {
    question: "How do I book a service?",
    answer:
      "Booking is simple! Just search for the service you need, select your preferred time slot, provide your address, and confirm. You can track your technician in real-time once the booking is confirmed.",
  },
  {
    question: "Are the technicians verified?",
    answer:
      "Yes, all our technicians undergo thorough background verification, ID checks, and skill assessments before joining our platform. We ensure quality and safety for every service.",
  },
  {
    question: "What are the payment options?",
    answer:
      "We accept multiple payment methods including UPI, credit/debit cards, net banking, and digital wallets. You can pay online or opt for cash on delivery for select services.",
  },
  {
    question: "Is there a warranty on services?",
    answer:
      "Yes, we provide a 30-day service warranty on most repairs and installations. If you face any issues with the work done, we'll send a technician to fix it at no extra cost.",
  },
  {
    question: "How quickly can I get a service?",
    answer:
      "We offer same-day service in most metro cities. During booking, you'll see available time slots and can choose the one that works best for you. Emergency services are also available for urgent needs.",
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer:
      "Yes, you can reschedule or cancel your booking through the app or website. Cancellations made at least 2 hours before the scheduled time are free. Late cancellations may incur a small fee.",
  },
  {
    question: "Do you provide services in my area?",
    answer:
      "We currently operate in 30+ cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, and more. Enter your pincode during booking to check availability in your area.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-slate-200 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
          </div>
          <Link href={"/raise-a-complaint"}>
            <Button
              variant="outline"
              className="border-slate-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              Raise a complaint
            </Button>
          </Link>
        </div>

        <div className="mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="py-4 text-left text-base font-semibold text-slate-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Still have questions?{" "}
            <a
              href="#contact"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
