import Link from "next/link";
import { getAllLocationPages } from "@/lib/action/locationPage";

const LOCATION_ORDER = ["Mumbai", "Navi Mumbai", "Thane"];

function normalizeLocation(loc: string) {
  return loc.trim().toLowerCase().replace(/-/g, " ");
}

export async function QuickLinks() {
  const locationPagesRes = await getAllLocationPages(true);
  const locationPages = locationPagesRes.success && locationPagesRes.data ? locationPagesRes.data : [];

  const quickLinksByLocation: Record<string, { title: string; slug: string }[]> = {};
  const locationKeyMap: Record<string, string> = {}; // normalized -> actual

  for (const page of locationPages) {
    const normalizedLoc = page.location.trim();
    quickLinksByLocation[normalizedLoc] = quickLinksByLocation[normalizedLoc] || [];
    quickLinksByLocation[normalizedLoc].push({ title: page.title, slug: page.slug });
    locationKeyMap[normalizeLocation(normalizedLoc)] = normalizedLoc;
  }

  // Sort links for each location so "AC Service" comes first
  Object.keys(quickLinksByLocation).forEach((location) => {
    quickLinksByLocation[location].sort((a, b) => {
      const aIsAC = /ac/i.test(a.title);
      const bIsAC = /ac/i.test(b.title);
      if (aIsAC && !bIsAC) return -1;
      if (!aIsAC && bIsAC) return 1;
      return a.title.localeCompare(b.title);
    });
  });

  // Build sortedLocations as actual keys
  const sortedLocations = [
    ...LOCATION_ORDER
      .map((loc) => locationKeyMap[normalizeLocation(loc)])
      .filter(Boolean),
    ...Object.keys(quickLinksByLocation)
      .filter(
        (loc) =>
          !LOCATION_ORDER.some(
            (orderLoc) => normalizeLocation(orderLoc) === normalizeLocation(loc)
          )
      )
      .sort(),
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
                {quickLinksByLocation[location]?.map((page) => (
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