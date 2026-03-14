export interface WhyChooseUsItem {
  icon?: string;
  title: string;
  description: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  image?: string;
  isVisible: boolean;
  content?: string;
  whyChooseUs?: WhyChooseUsItem[];
  faqs?: Faq[];
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  condition?: string;
  specifications?: string;
  price: number;
  discountPrice?: number;
  isAvailable: boolean;
  image?: string;
  location?: string;
  brand?: string;
  label?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}