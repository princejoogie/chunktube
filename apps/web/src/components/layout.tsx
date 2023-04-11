import Head from "next/head";
import type { ReactNode } from "react";
import Navbar from "./navbar";

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
        <title>{seo?.title ?? "Conclusion"}</title>
        <meta name="description" content={seo?.description} />
      </Head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
