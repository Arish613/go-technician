"use client";

import { useEffect, useState } from "react";
import { ServicesTable } from "@/components/service/ServiceTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import type { ServiceWithRelations } from "@/types/service";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/service");
      const result = await response.json();

      if (response.ok && result.data) {
        setServices(result.data);
      } else {
        setError(result.error || "Failed to fetch services");
      }
    } catch (err) {
      setError("An error occurred while fetching services");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your services
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchServices}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/service/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground mt-2">Loading services...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchServices} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : services.length > 0 ? (
        <ServicesTable services={services} onRefresh={fetchServices} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No services found</p>
        </div>
      )}
    </div>
  );
}