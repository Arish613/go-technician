import { AboutUs } from "@/components/homepage/AboutUs";
import { ACServices } from "@/components/homepage/ACServices";
import { FAQ } from "@/components/homepage/FAQ";
import HeroSSR from "@/components/homepage/hero/HeroSSR";
import { JoinProNetwork } from "@/components/homepage/Join";
import { Partners } from "@/components/homepage/Partners";
import { QuickRepairs } from "@/components/homepage/QuickRepairs";
import { RecentBlogs } from "@/components/blog/RecentBlogs";
import { CustomerReviews } from "@/components/homepage/Reviews";
import { SecondHandProducts } from "@/components/homepage/SecondHandProducts";
import { Services } from "@/components/homepage/Services";
import { WhyChooseUs } from "@/components/homepage/WhyChooseUs";
import { QuickLinks } from "@/components/homepage/QuickLinks";

export default function Page() {
  return (
    <div>
      <HeroSSR />
      <div className="md:mx-20">
        <Services />
        {/* <SecondHandProducts /> */}
        <ACServices />
        <QuickRepairs />
        <AboutUs />
        <Partners />
        <WhyChooseUs />
        <CustomerReviews />
        <RecentBlogs />
        <JoinProNetwork />
        <FAQ />
        <QuickLinks />
      </div>
    </div>
  );
}
