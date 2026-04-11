import { Services, Faq, SubService, SubServicePricing, City } from "@prisma/client";

export type ServiceType = Services;

export type SubServicePricingType = SubServicePricing;

type PricingWithCity = {
  id: string;
  subServiceId?: string;
  cityId: string;
  price: number;
  discountedPrice: number | null;
  city: {
    id: string;
    name: string;
    slug: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

export type SubServiceWithPricing = SubService & {
  pricings?: PricingWithCity[];
};

export type CityPricing = {
  cityId: string;
  cityName: string;
  citySlug: string;
  price: number;
  discountedPrice?: number;
};

export type ServiceWithRelations = Services & {
  faqs: Faq[];
  subServices: SubServiceWithPricing[];
};

export type WhyChooseUsItem = {
  icon?: string;
  title: string;
  description: string;
};

export type CreateServiceInput = {
  name: string;
  description: string;
  slug: string;
  content: string;
  location?: string;
  imageUrl?: string;
  type?: string[];
  isPublished?: boolean;
  whyChooseUs?: WhyChooseUsItem[];
  benefits?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  subServices?: {
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    type?: string;
    imageUrl?: string;
    whatIncluded?: string[];
    whatExcluded?: string[];
    duration?: string;
    isPopular?: boolean;
    isActive?: boolean;
    pricings?: {
      cityId: string;
      price: number;
      discountedPrice?: number;
    }[];
  }[];
};

export type UpdateServiceInput = Partial<CreateServiceInput> & {
  id: string;
};
