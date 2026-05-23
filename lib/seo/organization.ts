const BASE_URL = "https://www.gotechnicians.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Gotechnicians",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
          width: 130,
          height: 60,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-7977661546",
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "22:00",
          },
        },
        email: "gotechnicians.com@gmail.com",
        sameAs: [
          "https://www.instagram.com/gotechnician.in/",
          "https://www.facebook.com/Official.GoTechnicians/",
          "https://www.linkedin.com/in/gotechnician/",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "Gotechnicians",
        url: BASE_URL,
        image: `${BASE_URL}/logo.png`,
        telephone: "+91-7977661546",
        email: "gotechnicians.com@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: '4th Floor "C" Wing, Fakir Shah Apartment',
          addressLocality: "Thane",
          addressRegion: "Maharashtra",
          postalCode: "400612",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 19.2183,
          longitude: 72.9781,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:00",
          closes: "22:00",
        },
        areaServed: [
          { "@type": "City", name: "Mumbai" },
          { "@type": "City", name: "Thane" },
          { "@type": "City", name: "Navi Mumbai" },
        ],
        priceRange: "$$",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
        sameAs: [
          "https://www.instagram.com/gotechnician.in/",
          "https://www.facebook.com/Official.GoTechnicians/",
          "https://www.linkedin.com/in/gotechnician/",
        ],
      },
    ],
  };
}
