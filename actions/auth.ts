"use server";

import { postData } from "@/utils/api-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUserFromToken } from "./jwt-utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export async function setUserCookies(userData: any) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: userData?.data?.accessToken || userData?.token || "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800, // 7 days
    sameSite: "lax",
  });

  let userInfo = {
    id: 0,
    name: "Customer",
    email: "",
    mobileNumber: "",
    roles: [] as string[],
    isAdmin: false,
  };

  try {
    if (userData?.data) {
      userInfo = {
        id: userData.id || 0,
        name: userData.name || "",
        email: userData.email || "",
        mobileNumber: userData.mobileNumber || "",
        roles: userData.roles || [],
        isAdmin:
          userData.roles?.includes("admin") ||
          userData.roles?.includes("superadmin") ||
          false,
      };
    } else if (userData?.mobileNo) {
      userInfo = {
        id: 0,
        name: userData.name || "Customer",
        email: userData.email || `${userData.mobileNo}@example.com`,
        mobileNumber: userData.mobileNo,
        roles: [],
        isAdmin: false,
      };
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  cookieStore.set({
    name: "user",
    value: JSON.stringify(userInfo),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800, // 7 days
    sameSite: "lax",
  });

  return true;
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

      const redirectPath = user?.isAdmin ? "/admin" : "/user";

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

export async function logout(): Promise<void> {
  try {
    // First delete cookies immediately
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user");

    // Then make the API call (but don't wait for it to complete)
    // We use void to explicitly ignore the promise since we don't need to wait
    void postData("auth/logout").catch((e) =>
      console.error("Logout API error:", e)
    );

    const user = await getUser();
    const redirectPath = user?.isAdmin ? "/auth/sign-in" : "/";

    await new Promise((resolve) => setTimeout(resolve, 100));

    redirect(redirectPath);
  } catch (error) {
    console.error("Logout failed:", error);

    redirect("/");
  }
}

export async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has("auth_token");
}

// Create a server action for mobile login
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

      const redirectPath = user?.isAdmin ? "/admin" : "/user";

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
