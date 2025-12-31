import { getServices } from "@/lib/action/service";
import { ServicesTable } from "@/components/service/ServiceTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminServicesPage() {
  const result = await getServices();

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your services
          </p>
        </div>
        <Link href="/admin/service/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        </Link>
      </div>

      {result.success && result.data ? (
        <ServicesTable services={result.data} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {result.error || "No services found"}
          </p>
        </div>
      )}
    </div>
  );
}
