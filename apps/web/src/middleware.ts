import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/c(.*)", "/api(.*)"],
});

export const config = {
  matcher:
    "/((?!_next/image|_next/static|api/og|favicon.ico|ads.txt|manifest.json|sitemap.xml|robots.txt|assets).*)",
};
