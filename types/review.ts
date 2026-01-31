export type Review = {
  id: string;
  rating: string;
  comment: string;
  imageUrl?: string;
  reviewer: string;
  serviceId: string | null;
  subServiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
};