// import { NextResponse } from "next/server";
// import {
//   apiAuthPrefix,
//   authRoutes,
//   DEFAULT_LOGIN_REDIRECT,
//   publicRoutes,
// } from "./routes";
// import { auth } from "./auth";

// type AuthRequest = any;

// export default auth((req: AuthRequest) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

//   if (isApiAuthRoutes) {
//     return null;
//   }

//   if (isAuthRoutes) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return null;
//   }

//   if (!isLoggedIn && !isPublicRoutes) {
//     return NextResponse.redirect(new URL("/auth/sign-in", nextUrl));
//   }
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

export { auth as middleware } from "@/lib/auth";
