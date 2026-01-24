import { ServiceForm } from "@/components/service/Form";
import { getServiceBySlug } from "@/lib/action/service";
import { notFound } from "next/navigation";

export default async function UpdateService({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getServiceBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Update Service</h1>
        <p className="text-muted-foreground">
          Edit service details, sub-services, and FAQs
        </p>
      </div>
      <ServiceForm mode="update" service={result.data} />
    </div>
  );
}