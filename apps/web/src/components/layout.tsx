import Head from "next/head";

import Navbar from "./navbar";
import Footer from "./footer";

import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  seo?: {
    title?: string;
    description?: string;
  };
};

const Layout = ({ children, seo }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{seo?.title ?? "ChunkTube"}</title>
        {seo?.description ? (
          <meta content={seo.description} name="description" />
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
