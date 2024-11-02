import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Array of public routes that don't require authentication
  publicRoutes: ["/", "/api/public"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 