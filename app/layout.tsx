import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import ReactQueryClientProvider from "@/src/core/api/ReactQueryClientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "HuaLamphongV0",
  description: "-",
};

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSansThai.className}>
      <ReactQueryClientProvider>
        <body className={`antialiased`}>
          {children}
          <ToastContainer />
        </body>
      </ReactQueryClientProvider>
    </html>
  );
}
