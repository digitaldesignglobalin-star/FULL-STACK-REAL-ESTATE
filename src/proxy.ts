import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(pathname);
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/verify-phone",
    "/api/auth",
    "/favicon.ico",
    "/_next",
  ];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  /* GET TOKEN */
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log(token);
  console.log(req.url);

   /* NOT LOGGED IN */
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    console.log(loginUrl);

    return NextResponse.redirect(loginUrl);
  }

   /* ⭐ ROLE BASED ACCESS */
   const role = token.role as string;

  /* ADMIN ONLY */
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  /* EMPLOYEE ONLY */
  if (pathname.startsWith("/employee") && role !== "employee") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  /* NORMAL USER / BUILDER ONLY */
  if (pathname.startsWith("/dashboard")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "employee") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
