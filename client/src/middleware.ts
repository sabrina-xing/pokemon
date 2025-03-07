// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const isAuthenticated = !!token;
//   const { pathname } = req.nextUrl;

//   if (!isAuthenticated && pathname !== "/login") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (isAuthenticated && pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// // Apply middleware to protected routes
// export const config = {
//   matcher: ["/", "/dashboard", "/login"], // Pages where middleware applies
// };
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  // Check if the user has visited before using a cookie
  const visited = req.cookies.get("visited");

  if (!visited) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("visited", "true", { path: "/", maxAge: 60 * 60 * 24 }); // Set for 24 hours
    return response;
  }

  return NextResponse.next();
}

// Apply middleware only to pages where the initial redirect is needed
export const config = {
  matcher: ["/", "/dashboard"], // Only check on first load
};
