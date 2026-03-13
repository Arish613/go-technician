export interface City {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Locality {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  city?: City;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
