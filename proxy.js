import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const tokenName = process.env.AUTH_TOKEN_NAME || "kniholap_auth_token";
  const token = request.cookies.get(tokenName)?.value;
  const firstTime = request.cookies.get("firstTime")?.value;

  // Public routes (accessible without auth)
  const publicRoutes = [
    "/auth",
    "/auth/forgot_password",
    "/auth/forgot_password/reset_new_password",
    "/auth/forgot_password/success",
    "/auth/forgot_password/verify_otp",
    "/auth/signup",
    "/auth/signup/verify_otp",
  ];

  // Protected routes (require login)
  const protectedRoutes = [
    "/choose_interests",
    "/dashboard",
    "/bookmark",
    "/subscription/plan",
  ];

  const isPublicPath = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname); // optional: remember where user came from
    return NextResponse.redirect(loginUrl);
  }
  // Redirect to choose_interest if accessing public route while logged in and first time true
  if (token && isPublicPath && firstTime === "true") {
    return NextResponse.redirect(new URL("/choose_interests", request.url));
  }

  // Redirect to dashboard if accessing public route while logged in
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/choose_interests/:path*",
    "/bookmark/:path*",
    "/subscription/plan/:path*",
  ],
};
