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
  role: Role;
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
  sellingPrice: number;
  purchasePrice: number;
  unit: Unit;
  supplier: Supplier;
  productSku: string;
  stock: number;
  attachment: Attachment;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  createdBy: User;
  updatedBy: User;
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

export interface Unit {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedDate: string;
  createdBy: User;
  updatedBy: User;
}

export interface ApiResponseusers {
  message: string;
  statusCode: number;
  data: {
    customers: User[];
    others: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export type authResponse = {
  message: string;
  statusCode: number;
};

export interface MenuItem {
  parentId: number | null;
  id: number;
  name: string;
  icon: string | null;
  url: string;
  order: number;
  isMainMenu: boolean;
  isActive: boolean;
  isAdminMenu: boolean;
  children: MenuItem[];
}

export interface MenuTreeResponse {
  message: string;
  statusCode: number;
  data: MenuItem[];
}

export interface ApiResponse {
  data: [];
  message: string;
  statusCode: number;
}

export interface Role {
  id: number;
  rolename: string;
  description: string;
  isActive: boolean;
  createdAt: string;

  updatedDate: string;

  createdByUser: User;
  updatedBy: User;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;

  attachment: Attachment;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  targetUrl: string;
  position: string;
  type: string;
  isActive: boolean;

  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  image: Attachment;
  createdBy: User;
  updatedBy: User;
}

export interface Purchase {
  id: number;
  purchaseNumber: string;
  quantity: number;
  totalValue: string;
  purchaseDate: string;
  status: string;
  notes: string;
  paymentStatus: string;
  amountPaid: string;
  paymentDueDate: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  supplier: Supplier;
  createdBy: User;
  updatedBy: User;
}
