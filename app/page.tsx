import { AboutUs } from "@/components/homepage/AboutUs";
import { FAQ } from "@/components/homepage/FAQ";
import { Hero } from "@/components/homepage/Hero";
import { Partners } from "@/components/homepage/Partners";
import { CustomerReviews } from "@/components/homepage/Reviews";

export default function Page() {
  return (
    <div className="md:mx-20">
      <Hero />
      <AboutUs />
      <Partners />
      <CustomerReviews />
      <FAQ />
    </div>
  );
}
