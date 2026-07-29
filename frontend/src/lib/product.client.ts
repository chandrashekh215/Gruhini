import { fetchApi } from './api';

export interface Product {
  id: number;
  name: string;
  price: number;
  categories: string;
  subcategory: string;
  description: string;
  stock: number;
  status: string;
  rating: number;
  discount: number;
  verified: boolean;
  message: string;
  deliveryTime: string;
  badge: string;
  sellerId: number;
  image: string;
}

export async function getExploreProducts(): Promise<Product[]> {
  try {
    return await fetchApi('/explore');
  } catch (error) {
    console.error('Failed to fetch explore products:', error);
    return [];
  }
}

export async function getSingleProduct(id: number): Promise<Product | null> {
  try {
    return await fetchApi(`/products/${id}`);
  } catch (error) {
    console.error('Failed to fetch single product:', error);
    return null;
  }
}
