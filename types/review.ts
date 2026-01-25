export type Review = {
  id: string;
  rating: string;
  comment: string;
  imageUrl?: string;
  reviewer: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
};
