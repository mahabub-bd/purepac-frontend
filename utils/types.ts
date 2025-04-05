type UserRole = "superadmin" | "admin" | "user"; // add other possible roles here

export type UserTypes = {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roles: UserRole[];
  isAdmin: boolean;
  image?: any;
};

export interface Brand {
  id: number;
  name: string;
  description: string;
  attachment: Attachment;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
}

// For API responses
export interface ProductResponse {
  message: string;
  statusCode: number;
  data: Product | Product[];
}
export interface BrandResponse {
  message: string;
  statusCode: number;
  data: Brand | Brand[];
}
export interface CategoryResponse {
  message: string;
  statusCode: number;
  data: Category | Category[];
}
export interface UserResponse {
  message: string;
  statusCode: number;
  data: UserTypes | UserTypes[];
}

export interface Attachment {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  key: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
