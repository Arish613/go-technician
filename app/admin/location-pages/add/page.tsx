"use client";
import { LocationPageForm } from "@/components/location/LocationPageForm";

export default function AddLocationPage() {
  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add Location Page</h1>
        <p className="text-muted-foreground">
          Create a new location-specific service page for SEO
        </p>
      </div>
      <LocationPageForm mode="create" />
    </div>
  );
}
