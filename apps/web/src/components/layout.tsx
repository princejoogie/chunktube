import Head from "next/head";
import type { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
  seo?: {
    title?: string;
    description?: string;
  };
}

const Layout = ({ children, seo }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{seo?.title ?? "ChunkTube"}</title>
        {seo?.description ? (
          <meta name="description" content={seo.description} />
        ) : null}
      </Head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>

      <Footer />
    </>
  );
};

export default Layout;
