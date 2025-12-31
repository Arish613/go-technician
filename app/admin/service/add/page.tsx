import { ServiceForm } from "@/components/service/Form";

export default function AddService() {
  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Service</h1>
        <p className="text-muted-foreground">
          Create a new service with sub-services and FAQs
        </p>
      </div>
      <ServiceForm mode="create" />
    </div>
  );
}