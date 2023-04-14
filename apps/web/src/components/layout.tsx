import Head from "next/head";
import type { ReactNode } from "react";
import Navbar from "./navbar";

interface LayoutProps {
  children: ReactNode;
  token: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

const Layout = ({ children, token, seo }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{seo?.title ?? "ChunkTube"}</title>
        {seo?.description ? (
          <meta name="description" content={seo.description} />
        ) : null}
      </Head>

      <div>
        <Navbar token={token} />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
