import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // Check authentication status

  // Define route types
  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  // 1. Always allow NextAuth API routes (/api/auth/*)
  if (isApiAuthRoutes) {
    return null;
  }

  // 2. Handle auth pages (login/signup)
  if (isAuthRoutes) {
    if (isLoggedIn) {
      // Redirect logged-in users away from login page
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null; // Allow access to login page
  }

  // 3. Protect all non-public routes
  if (!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  // 4. Allow everything else (public routes + authenticated users)
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
