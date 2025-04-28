"use server";

import { logoutPost, postData } from "@/utils/api-utils";

import { authResponse } from "@/utils/types";
import { cookies } from "next/headers";
import { z } from "zod";
import { getUserFromToken } from "./jwt-utils";
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

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

export async function setUserCookies(userData: any) {
  const cookieStore = await cookies();

  const authToken = userData?.data?.accessToken || userData?.token;
  if (!authToken) {
    console.error("No auth token provided");
    return false;
  }

  cookieStore.set({
    name: "auth_token",
    value: authToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800,
    sameSite: "lax",
  });

  // Ensure user info is properly constructed
  let userInfo = {
    id: 0,
    name: "Customer",
    email: "",
    mobileNumber: "",
    roles: "",
    isAdmin: false,
    createdAt: "",
  };

  try {
    if (userData?.data) {
      userInfo = {
        id: userData.id || 0,
        name: userData.name || "Customer",
        email: userData.email || "",
        mobileNumber: userData.mobileNumber || "",
        roles: userData.roles || "",
        isAdmin: Boolean(
          userData.roles === "admin" || userData.roles === "superadmin"
        ),
        createdAt: userData?.createdAt,
      };
    } else if (userData?.mobileNo) {
      userInfo = {
        id: 0,
        name: userData.name || "Customer",
        email: userData.email || `${userData.mobileNo}@example.com`,
        mobileNumber: userData.mobileNo,
        roles: userData.roles?.rolename || "",
        isAdmin: false,
        createdAt: userData?.createdAt,
      };
    }

    const userJson = JSON.stringify(userInfo);
    if (!userJson) throw new Error("Failed to stringify user info");

    cookieStore.set({
      name: "user",
      value: userJson,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800,
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("Error setting user cookies:", error);
    // Clean up partial cookies
    cookieStore.delete("auth_token");
    cookieStore.delete("user");
    return false;
  }
}
export async function login(formData: LoginFormData) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await postData("auth/login", validatedFields.data);

    if (response?.data?.accessToken) {
      const tokenData = getUserFromToken(response.data.accessToken);
      const userData = {
        ...response,
        ...tokenData,
      };

      await setUserCookies(userData);
      const user = await getUser();

      const redirectPath = user?.isAdmin
        ? "/admin/dashboard"
        : "/user/dashboard";

      return {
        success: true,
        message: response?.message,
        redirect: redirectPath,
      };
    }

    return {
      success: false,
      message: response?.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }
}

export async function register(formData: RegisterFormData) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await postData("auth/register", validatedFields.data);

    return {
      success: true,
      message: response?.message || "Registration successful. Please login.",
      redirect: "/auth/sign-in",
    };
  } catch (error: any) {
    // Add type annotation here
    console.error("Registration error:", error);

    // Handle Axios error response
    if (error.response) {
      // Server responded with a status code outside 2xx range
      const errorData = error.response.data;
      return {
        success: false,
        message: errorData.message || "Registration failed",
        errors: errorData.errors || undefined,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "No response from server. Please try again.",
      };
    } else {
      // Something happened in setting up the request
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  }
}
export async function logout(): Promise<authResponse> {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get("auth_token");
    if (token?.value) {
      await logoutPost("auth/logout", token.value);
      return {
        statusCode: 200,
        message: "Logout successful",
      };
    }
  } catch (error) {
    console.error("Logout API error:", error);
    return {
      statusCode: 500,
      message: "Logout failed due to an error",
    };
  } finally {
    cookieStore.delete("auth_token");
    cookieStore.delete("user");
  }

  return {
    statusCode: 400,
    message: "No token found for logout",
  };
}
export async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore?.get("user");

  if (!userCookie?.value) return null; // Check for value existence

  try {
    const parsedValue = JSON.parse(userCookie.value);
    // Add basic validation
    if (typeof parsedValue !== "object" || parsedValue === null) {
      console.error("Invalid user data format");
      return null;
    }
    return parsedValue;
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clean up invalid cookie
    cookieStore.delete("user");
    return null;
  }
}

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token?.value) return null;

  try {
    return token.value;
  } catch (error) {
    console.error("Error parsing token data:", error);

    cookieStore.delete("auth_token");
    return null;
  }
}
export async function mobileLogin(mobileNumber: string) {
  try {
    const response = await postData("auth/mobile-login", { mobileNumber });
    return response;
  } catch (error) {
    console.error("Mobile login error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}

export async function verifyOtp(data: {
  mobileNumber: string;
  otp: string;
  otpExpiresAt?: string;
}) {
  try {
    const response = await postData("auth/verify-otp", data);

    if (response?.data?.accessToken) {
      const tokenData = getUserFromToken(response.data.accessToken);
      const userData = {
        ...response,
        ...tokenData,
      };

      await setUserCookies(userData);
      const user = await getUser();

      const redirectPath = user?.isAdmin
        ? "/admin/dashboard"
        : "/user/dashboard";

      return {
        success: true,
        message: response?.message,
        redirect: redirectPath,
      };
    }

    return {
      success: false,
      message: response?.message || "OTP verification failed",
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
