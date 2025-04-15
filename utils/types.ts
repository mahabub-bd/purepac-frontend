type UserRole = "superadmin" | "admin" | "user";

export type UserTypes = {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roles: UserRole[];
  isAdmin: boolean;
  profilePhoto?: Attachment;
  createdAt: string;
  updatedAt: string;
};
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: ("superadmin" | "admin" | "user")[];
  isVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  mobileNumber: string;
  otp: string | null;
  otpExpiresAt: string;
  profilePhoto?: Attachment;
  isAdmin: boolean;
}
export interface Brand {
  id: number;
  name: string;
  slug?: string;
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
  slug?: string;
  description: string;
  attachment: Attachment;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  unitprice: number;
  unit: string;
  productSku: string;
  stock: number;
  attachment: Attachment;
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

export enum ProductUnit {
  PIECE = "piece",
  KILOGRAM = "kilogram",
  GRAM = "gram",
  LITER = "liter",
  MILLILITER = "milliliter",
  METER = "meter",
  CENTIMETER = "centimeter",
  SQUARE_METER = "square_meter",
  CUBIC_METER = "cubic_meter",
  PACK = "pack",
  BOX = "box",
  PAIR = "pair",
  SET = "set",
}

export enum Role {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
  EDITOR = "editor",
  MODERATOR = "moderator",
}

export type authResponse = {
  message: string;
  statusCode: number;
};
