const BASE_URL = "https://www.gotechnicians.com";

export interface ServiceSchemaInput {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
}

export function getServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${BASE_URL}/service/${service.slug}`,
    image: service.imageUrl ?? undefined,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Gotechnicians",
      url: BASE_URL,
      telephone: "+91-7977661546",
      address: {
        "@type": "PostalAddress",
        streetAddress: '4th Floor "C" Wing, Fakir Shah Apartment',
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        postalCode: "400612",
        addressCountry: "IN",
      },
    },
    areaServed: [
      { "@type": "City", name: "Mumbai" },
      { "@type": "City", name: "Thane" },
      { "@type": "City", name: "Navi Mumbai" },
    ],
    serviceType: service.name,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
  };
}
