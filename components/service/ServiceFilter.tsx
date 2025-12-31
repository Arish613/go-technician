"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ServicesFilterProps {
  currentLocation?: string;
  locations: string[];
}

export function ServicesFilter({
  currentLocation,
  locations,
}: ServicesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocationChange = (location: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (location === "all") {
      params.delete("location");
    } else {
      params.set("location", location);
    }
    router.push(`/service?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/service");
  };

  const hasFilters = currentLocation || searchParams.get("search");

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter by:</span>

        {/* Location Filter */}
        <Select
          value={currentLocation || "all"}
          onValueChange={handleLocationChange}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}

      {/* Results Count */}
      <div className="ml-auto text-sm text-muted-foreground">
        {/* This will be updated by the parent component */}
      </div>
    </div>
  );
}
