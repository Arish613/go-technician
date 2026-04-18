"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCw, Trash2, Eye, EyeOff, Pencil, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LocationPageItem {
  id: string;
  slug: string;
  serviceSlug: string;
  location: string;
  locality?: string | null;
  title: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  faqs: Array<{ id: string; question: string; answer: string }>;
}

interface CityMap {
  [citySlug: string]: string;
}

interface LocalityInfo {
  name: string;
  cityName: string;
}

interface LocalityMap {
  [localitySlug: string]: LocalityInfo;
}

interface GroupedPages {
  [serviceSlug: string]: {
    serviceName: string;
    locations: {
      [citySlug: string]: {
        cityName: string;
        cityPages: LocationPageItem[];
        localityPages: {
          [localitySlug: string]: LocationPageItem;
        };
      };
    };
  };
}

export default function AdminLocationPagesPage() {
  const [pages, setPages] = useState<LocationPageItem[]>([]);
  const [serviceMap, setServiceMap] = useState<{ [slug: string]: string }>({});
  const [cityMap, setCityMap] = useState<CityMap>({});
  const [localityMap, setLocalityMap] = useState<LocalityMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      const res = await fetch("/api/cities");
      const result = await res.json();
      if (res.ok && result.data) {
        const cMap: CityMap = {};
        const lMap: LocalityMap = {};
        for (const city of result.data) {
          cMap[city.slug] = city.name;
          for (const locality of city.localities || []) {
            lMap[locality.slug] = {
              name: locality.name,
              cityName: city.name,
            };
          }
        }
        setCityMap(cMap);
        setLocalityMap(lMap);
      }
    } catch {
      // non-critical
      console.error("Failed to fetch cities or localities");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/service");
      const result = await res.json();
      if (res.ok && result.data) {
        const map: { [slug: string]: string } = {};
        for (const svc of result.data) {
          map[svc.slug] = svc.name;
        }
        setServiceMap(map);
      }
    } catch {
      // non-critical
      console.error("Failed to fetch services");
    }
  };

  const fetchPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/location-page");
      const result = await response.json();

      if (response.ok && result.data) {
        setPages(result.data);
      } else {
        setError(result.error || "Failed to fetch location pages");
      }
    } catch (err) {
      setError("An error occurred while fetching location pages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchServices();
    fetchPages();
  }, []);

  const groupedPages = useMemo<GroupedPages>(() => {
    const grouped: GroupedPages = {};

    for (const page of pages) {
      const serviceSlug = page.serviceSlug;
      const citySlug = page.location;
      const localitySlug = page.locality;

      if (!grouped[serviceSlug]) {
        grouped[serviceSlug] = {
          serviceName:
            serviceMap[serviceSlug] ||
            serviceSlug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
          locations: {},
        };
      }

      if (!grouped[serviceSlug].locations[citySlug]) {
        const cityName =
          cityMap[citySlug] ||
          citySlug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        grouped[serviceSlug].locations[citySlug] = {
          cityName,
          cityPages: [],
          localityPages: {},
        };
      }

      if (localitySlug) {
        grouped[serviceSlug].locations[citySlug].localityPages[localitySlug] =
          page;
      } else {
        grouped[serviceSlug].locations[citySlug].cityPages.push(page);
      }
    }

    return grouped;
  }, [pages, serviceMap, cityMap]);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/location-page/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        fetchPages();
      } else {
        alert("Failed to update publish status");
      }
    } catch {
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/location-page/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPages();
      } else {
        alert("Failed to delete location page");
      }
    } catch {
      alert("An error occurred");
    }
  };

  const resolveLocationLabel = (
    locationSlug: string,
    localitySlug?: string | null
  ) => {
    if (localitySlug && localityMap[localitySlug]) {
      const { name: localityName, cityName } = localityMap[localitySlug];
      return `${cityName} › ${localityName}`;
    }
    if (cityMap[locationSlug]) {
      return cityMap[locationSlug];
    }
    return locationSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getPageLocationType = (page: LocationPageItem) => {
    return resolveLocationLabel(page.location, page.locality);
  };

  const getPageLocationBadge = (page: LocationPageItem) => {
    if (page.locality) {
      return (
        <Badge variant="outline" className="text-xs shrink-0">
          Locality
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs shrink-0">
        City
      </Badge>
    );
  };

  const countServicePages = (serviceData: GroupedPages[string]) => {
    let count = 0;
    for (const cityData of Object.values(serviceData.locations)) {
      count += cityData.cityPages.length;
      count += Object.keys(cityData.localityPages).length;
    }
    return count;
  };

  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Location Pages</h1>
          <p className="text-muted-foreground mt-1">
            Manage location-specific service pages for SEO
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPages}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Link href="/admin/location-pages/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Location Page
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground mt-2">
            Loading location pages...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchPages} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : pages.length > 0 ? (
        <Accordion type="single" collapsible className="border rounded-lg">
          {Object.entries(groupedPages).map(([serviceSlug, serviceData]) => {
            const pageCount = countServicePages(serviceData);
            return (
              <AccordionItem key={serviceSlug} value={serviceSlug}>
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 px-6">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-left">
                      {serviceData.serviceName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {pageCount} page{pageCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-4">
                    {Object.entries(serviceData.locations).map(
                      ([citySlug, cityData]) => {
                        const hasLocalities =
                          Object.keys(cityData.localityPages).length > 0;
                        const hasCityPage = cityData.cityPages.length > 0;

                        return (
                          <div key={citySlug} className="mb-6 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-sm">
                                {cityData.cityName}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {hasCityPage && "City-level"}
                                {hasCityPage && hasLocalities && " / "}
                                {hasLocalities &&
                                  `${Object.keys(cityData.localityPages).length} Localit${Object.keys(cityData.localityPages).length !== 1
                                    ? "ies"
                                    : "y"
                                  }`}
                              </Badge>
                            </div>

                            <div className="space-y-2 ml-4">
                              {cityData.cityPages.map((page) => (
                                <div
                                  key={page.id}
                                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <Link
                                          href={`/service/${page.slug}`}
                                          target="_blank"
                                          className="font-medium text-sm hover:text-blue-600 truncate"
                                        >
                                          {page.title}
                                        </Link>
                                        {getPageLocationBadge(page)}
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {getPageLocationType(page)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleTogglePublish(
                                          page.id,
                                          page.isPublished
                                        )
                                      }
                                      title={
                                        page.isPublished
                                          ? "Unpublish"
                                          : "Publish"
                                      }
                                    >
                                      {page.isPublished ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Link
                                      href={`/admin/location-pages/update/${page.id}`}
                                    >
                                      <Button variant="ghost" size="icon">
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDelete(page.id, page.title)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              {Object.entries(cityData.localityPages).map(
                                ([locSlug, page]) => (
                                  <div
                                    key={page.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/service/${page.slug}`}
                                            target="_blank"
                                            className="font-medium text-sm hover:text-blue-600 truncate"
                                          >
                                            {page.title}
                                          </Link>
                                          {getPageLocationBadge(page)}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                          {getPageLocationType(page)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleTogglePublish(
                                            page.id,
                                            page.isPublished
                                          )
                                        }
                                        title={
                                          page.isPublished
                                            ? "Unpublish"
                                            : "Publish"
                                        }
                                      >
                                        {page.isPublished ? (
                                          <EyeOff className="w-4 h-4" />
                                        ) : (
                                          <Eye className="w-4 h-4" />
                                        )}
                                      </Button>
                                      <Link
                                        href={`/admin/location-pages/update/${page.id}`}
                                      >
                                        <Button variant="ghost" size="icon">
                                          <Pencil className="w-4 h-4" />
                                        </Button>
                                      </Link>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDelete(page.id, page.title)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            No location pages found. Create your first one!
          </p>
          <Link href="/admin/location-pages/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Location Page
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
