export type Review = {
  id: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  reviewer: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
};
