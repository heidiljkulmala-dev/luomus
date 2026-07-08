import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromToken, COOKIE_NAME } from "@/lib/auth";

const protectedPaths = ["/projects"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await getSessionFromToken(token) : null;

  if (!session) {
    const signIn = new URL("/auth/sign-in", request.url);
    signIn.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
};
