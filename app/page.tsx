import { AboutUs } from "@/components/homepage/AboutUs";
import { ACServices } from "@/components/homepage/ACServices";
import { FAQ } from "@/components/homepage/FAQ";
import { Hero } from "@/components/homepage/Hero";
import { Partners } from "@/components/homepage/Partners";
import { QuickRepairs } from "@/components/homepage/QuickRepairs";
import { CustomerReviews } from "@/components/homepage/Reviews";
import { Services } from "@/components/homepage/Services";

export default function Page() {
  return (
    <div>
      <Hero />
      <div className="md:mx-20">
        <Services />
        <ACServices />
        <QuickRepairs />
        <AboutUs />
        <Partners />
        <CustomerReviews />
        <FAQ />
      </div>
    </div>
  );
}
