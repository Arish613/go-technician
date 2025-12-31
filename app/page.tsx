import { AboutUs } from "@/components/homepage/AboutUs";
import { FAQ } from "@/components/homepage/FAQ";
import { Hero } from "@/components/homepage/Hero";

export default function Page() {
  return (
    <div className="md:mx-20">
      <Hero />
      <AboutUs />
      <FAQ />
    </div>
  );
}
