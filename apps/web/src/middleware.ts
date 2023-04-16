import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* const assets = [ */
/*   "/android-chrome-192x192.png*", */
/*   "/android-chrome-512x512.png*", */
/*   "/apple-touch-icon.png*", */
/*   "/favicon-16x16.png*", */
/*   "/favicon-32x32.png*", */
/*   "/favicon.ico*", */
/*   "/manifest.json*", */
/*   "/ads.txt*", */
/*   "/assets*", */
/* ]; */

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher:
    "/((?!_next/image|_next/static|api/og|favicon.ico|ads.txt|manifest.json|sitemap.xml|robots.txt|assets).*)",
};
