import { ApiResponse, postData } from "@/utils/api-utils";

export type ValidateCouponResponse = {
  message: string;
  statusCode: number;
  data: null;
};

export interface ApplyCouponResponse {
  message: string;
  statusCode: number;

  discountedAmount: number;
  discountValue: number;
  couponId: number;
}

export async function validateCoupon(
  code: string
): Promise<ApiResponse<ValidateCouponResponse>> {
  try {
    const response = await postData<ValidateCouponResponse>(
      `coupons/validate?code=${encodeURIComponent(code)}`
    );
    return response;
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw error;
  }
}

export async function applyCoupon(
  code: string,
  amount: number
): Promise<ApiResponse<ApplyCouponResponse>> {
  try {
    const response = await postData<ApplyCouponResponse>(
      `coupons/apply?code=${encodeURIComponent(code)}&amount=${amount}`
    );
    return response;
  } catch (error) {
    console.error("Error applying coupon:", error);
    throw error;
  }
}
