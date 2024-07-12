import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import {
//   getTranslations
// } from 'next-intl/server';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  // params: {locale: string};
};

export async function generateMetadata(): Promise<Metadata> {
  // const t = await getTranslations({locale, namespace: 'index'});

  return {
    // metadataBase: new URL('http://localhost:3000'),
    title: "Balance Management",
    description: "",
  };
}

export default function BasicLayout({ children }: Readonly<Props>) {
  return (
    <html>
      <head></head>
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
