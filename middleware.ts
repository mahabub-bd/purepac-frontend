// middleware.js
import { NextResponse } from "next/server";
import { getUser } from "./actions/auth";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  const userProtectedRoutes = ["/user"];
  const adminProtectedRoutes = ["/admin"];

  const isUserProtected = userProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminProtected = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isUserProtected && !isAdminProtected) {
    return NextResponse.next();
  }

  try {
    const user = await getUser();

    if (!user) {
      const loginUrl = new URL("/auth/sign-in", req.url);

      return NextResponse.redirect(loginUrl);
    }

    if (isAdminProtected && !user.isAdmin) {
      return NextResponse.redirect(new URL("/user", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    const loginUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["user/:path*", "admin/:path*"],
};
