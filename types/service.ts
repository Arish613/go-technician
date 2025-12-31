import { Services, Faq } from "@prisma/client";

export type ServiceType = Services;

export type ServiceWithFaqs = Services & {
  faqs: Faq[];
};

export type CreateServiceInput = {
  name: string;
  description: string;
  slug: string;
  price: number;
  content: string;
  location?: string;
  imageUrl?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
};

export type UpdateServiceInput = Partial<CreateServiceInput> & {
  id: string;
};
