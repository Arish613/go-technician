export interface Category {
  id: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  image?: string;
  isVisible: boolean;
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
  createdAt: string;
  updatedAt: string;
}
