import { z } from "zod";
import { BannerPosition, BannerType, DiscountType } from "./types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    mobileNumber: z.string().min(11, "Number should be 11 digit"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
});
const bannerSchema = z.object({
  title: z.string().min(1, "Banner title is required"),
  description: z.string().optional(),
  targetUrl: z.string().url("Please enter a valid URL"),
  position: z.nativeEnum(BannerPosition, {
    required_error: "Position is required",
  }),
  type: z.nativeEnum(BannerType, {
    required_error: "Type is required",
  }),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce
    .number()
    .int()
    .min(0, "Display order must be a positive number"),
  imageUrl: z.string().optional(),
});

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional()
    .or(z.literal("")),
  mobileNumber: z
    .string()
    .min(10, { message: "Please enter a valid mobile number" })
    .startsWith("+880", { message: "Mobile number must start with +880" }),
  roleId: z.string().min(1, { message: "Please select at least one role" }),
  isVerified: z.boolean().default(false),
});

const menuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().optional().nullable(),
  parentId: z.number().nullable().optional(),
  order: z.number().min(0, "Order must be a positive number"),
  isMainMenu: z.boolean().default(true),
  isActive: z.boolean().default(true),
  isAdminMenu: z.boolean().default(false),
});

const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  paymentMethodId: z.number().min(1, "Payment method is required"),

  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    sellingPrice: z.coerce
      .number()
      .min(0.01, "Unit price must be greater than 0"),
    purchasePrice: z.coerce
      .number()
      .min(0.01, "Unit price must be greater than 0"),
    stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
    unitId: z.number().min(1, "Unit is required"),
    productSku: z.string().min(1, "SKU is required"),
    imageUrl: z.string().optional(),
    weight: z.coerce.number().int(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    brandId: z.number().min(1, "Brand is required"),
    galleryId: z.number().optional(),
    categoryId: z.number().min(1, "Category is required"),
    supplierId: z.number().min(1, "Supplier is required"),
    hasDiscount: z.boolean().default(false),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.coerce.number().optional(),
    discountStartDate: z.date().optional(),
    discountEndDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasDiscount) {
      if (!data.discountType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount type is required",
          path: ["discountType"],
        });
      }
      if (data.discountValue === undefined || data.discountValue <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount value must be greater than 0",
          path: ["discountValue"],
        });
      }
      if (!data.discountStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount start date is required",
          path: ["discountStartDate"],
        });
      }
      if (!data.discountEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount end date is required",
          path: ["discountEndDate"],
        });
      }
      if (
        data.discountStartDate &&
        data.discountEndDate &&
        data.discountEndDate <= data.discountStartDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["discountEndDate"],
        });
      }
    }
  });
const purchaseSchema = z.object({
  supplierId: z.number().min(1, "Supplier is required"),
  items: z
    .array(
      z.object({
        productId: z.number().min(1, "Product is required"),
        quantity: z.number().min(1, "Minimum quantity is 1"),
        unitPrice: z.number().min(0.01, "Minimum price is 0.01"),
      })
    )
    .min(1, "At least one item required"),
  purchaseDate: z.date(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
});

const roleSchema = z.object({
  rolename: z
    .string()
    .min(2, { message: "Role name must be at least 2 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  isActive: z.boolean().default(true),
});
const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.coerce
    .number() // Convert string input to number
    .min(0.01, "Value must be greater than 0")
    .refine((val) => val >= 0, "Value cannot be negative"),
  maxDiscountAmount: z.coerce
    .number()
    .min(0, "Maximum discount amount cannot be negative")
    .optional()
    .nullable(),
  maxUsage: z.coerce
    .number() // Also fix maxUsage
    .min(1, "Max usage must be at least 1")
    .optional(),
  validFrom: z.date({ message: "Start date is required" }),
  validUntil: z.date({ message: "End date is required" }),
  isActive: z.boolean(),
});

const discountFormSchema = z.object({
  discountType: z.enum([DiscountType.PERCENTAGE, DiscountType.FIXED], {
    required_error: "Please select a discount type",
  }),
  discountValue: z.coerce
    .number({
      required_error: "Please enter a discount value",
      invalid_type_error: "Please enter a valid number",
    })
    .positive("Discount must be greater than 0"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  productIds: z.array(z.number()).min(1, "Please select at least one product"),
});

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),

    country: z.string().min(1, "Country is required"),
  }),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price must be at least 0"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
});

export {
  bannerSchema,
  brandSchema,
  couponSchema,
  discountFormSchema,
  loginSchema,
  menuSchema,
  orderSchema,
  paymentSchema,
  productSchema,
  purchaseSchema,
  registerSchema,
  roleSchema,
  supplierSchema,
  userSchema,
};
