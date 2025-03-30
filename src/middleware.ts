// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
  "/",                  // Home page
  "/about",             // Public about page
  "/sign-in(.*)",       // Clerk sign-in page
  "/sign-up(.*)",       // Clerk sign-up page
  "/api/public(.*)",    // Public API routes
]);

// Define protected routes (require auth)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/admin(.*)",
]);
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // ✅ await this

  // Now you can use userId safely
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl.toString());
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - static files
     * - Next.js internals
     */
    "/((?!api/webhooks|_next/|static/|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff2?|ttf|eot)).*)",
  ],
};
