import { Services, Faq, SubService } from "@prisma/client";

export type ServiceType = Services;

export type ServiceWithRelations = Services & {
  faqs: Faq[];
  subServices: SubService[];
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
  }[];
};

export type UpdateServiceInput = Partial<CreateServiceInput> & {
  id: string;
};
