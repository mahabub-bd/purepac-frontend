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
  parentId: number | null;
  name: string;
  slug?: string;
  description: string;
  isMainCategory: boolean;
  parent: Category;
  children: [Category];
  attachment: Attachment;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sellingPrice: number;
  purchasePrice: number;
  totalValueBySalePrice: number;
  totalValueByPurchasePrice: number;
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

  discountType?: DiscountType;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
}

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
  products: Product[];
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

export interface PurchaseItem {
  id: number;
  unitPrice: string;
  quantity: number;
  total: string;
  product: Product;
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
  items: PurchaseItem[];
  supplier: Supplier;
  payments: Payment;
  createdBy: User;
  updatedBy: User;
}

export interface Payment {
  id: number;
  paymentNumber: string;
  amount: string;
  paymentDate: string;
  referenceNumber: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  purchase: Purchase;
  createdBy: User;
  updatedBy: User;
  paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export enum BannerPosition {
  TOP = "top",
  MIDDLE = "middle",
  BOTTOM = "bottom",
  SIDEBAR = "sidebar",
}

export enum BannerType {
  MAIN = "main",
  PROMOTIONAL = "promotional",
  FEATURED = "featured",
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

export interface Cart {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: DiscountType;
  value: string;
  timesUsed: number;
  maxUsage: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  cost: string;
  deliveryTime: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface Address {
  id: number;
  street: string;
  area: string;
  division: string;
  city: string;
  type: string;
  isDefault: boolean;
}
