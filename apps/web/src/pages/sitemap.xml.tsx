import type { RouterOutputs } from "api";
import type { GetServerSideProps } from "next";
import { httpApi } from "~/utils/api";

type Post = RouterOutputs["list"]["getTopChunks"]["chunks"];

const generateSiteMap = (posts: Post, baseUrl: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${baseUrl}/</loc>
     </url>
     ${posts
       .map((e) => {
         return `
       <url>
           <loc>${baseUrl}/c/${`${encodeURIComponent(e.url)}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>

 `;
};

const SiteMap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (
    !req.headers.host ||
    !req.headers["x-forwarded-proto"] ||
    typeof req.headers["x-forwarded-proto"] !== "string"
  ) {
    const sitemap = generateSiteMap([], "https://chunktube.tech");
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
    return { props: {} };
  }

  const baseUrl = `${req.headers["x-forwarded-proto"]}://${req.headers.host}`;

  const posts = await httpApi.list.getTopChunks.query({
    filter: "newest",
  });

  const sitemap = generateSiteMap(posts.chunks, baseUrl);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return { props: {} };
};

export default SiteMap;
