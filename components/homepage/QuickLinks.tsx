import Link from "next/link";
import { getAllLocationPages } from "@/lib/action/locationPage";

const LOCATION_ORDER = ["Mumbai", "Thane", "Navi Mumbai"];

export async function QuickLinks() {
  const locationPagesRes = await getAllLocationPages(true);
  const locationPages = locationPagesRes.success && locationPagesRes.data ? locationPagesRes.data : [];

  const quickLinksByLocation: Record<string, { title: string; slug: string }[]> = {};
  for (const page of locationPages) {
    if (!quickLinksByLocation[page.location]) quickLinksByLocation[page.location] = [];
    quickLinksByLocation[page.location].push({ title: page.title, slug: page.slug });
  }

  const sortedLocations = [
    ...LOCATION_ORDER.filter((loc) => quickLinksByLocation[loc]),
    ...Object.keys(quickLinksByLocation).filter((loc) => !LOCATION_ORDER.includes(loc)).sort(),
  ];

  if (sortedLocations.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <h2 className="mb-10 text-3xl font-bold text-slate-900 text-center">Quick Links</h2>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-items-center">
          {sortedLocations.map((location) => (
            <div key={location} className="w-full">
              <h4 className="mb-4 text-lg font-semibold text-slate-800 text-center capitalize">{location}</h4>
              <ul className="space-y-2">
                {quickLinksByLocation[location].map((page) => (
                  <li key={page.slug} >
                    <Link
                      href={`/service/${page.slug}`}
                      prefetch={true}
                      className="text-sm text-slate-700 transition-colors hover:text-blue-600 hover:underline"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}