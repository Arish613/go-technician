import { LocationPageForm } from "@/components/location/LocationPageForm";
import { getLocationPageById } from "@/lib/action/locationPage";
import { notFound } from "next/navigation";

export default async function UpdateLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLocationPageById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const locationPage = result.data;

  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Update Location Page</h1>
        <p className="text-muted-foreground">
          Edit location page content and FAQs
        </p>
      </div>
      <LocationPageForm
        mode="update"
        locationPage={{
          id: locationPage.id,
          slug: locationPage.slug,
          serviceSlug: locationPage.serviceSlug,
          location: locationPage.location,
          title: locationPage.title,
          metaTitle: locationPage.metaTitle,
          description: locationPage.description,
          content: locationPage.content,
          isPublished: locationPage.isPublished,
          faqs: locationPage.faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        }}
      />
    </div>
  );
}
