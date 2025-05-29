import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { MyFirebaseProvider } from "@/components/firebase-providers";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { ClientWrapper } from "@/components/client-wrapper";

const font = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jasper Luxury Boat Tours | Premium Gili Islands Experiences",
  description:
    "Experience the magic of Gili Islands with Jasper Luxury Boat Tours. Premium boat tours, snorkelling adventures, and unforgettable experiences in Indonesia.",
  keywords: "Gili Islands, boat tours, luxury tours, snorkelling, Indonesia, Lombok, premium experiences, water sports",
  authors: [{ name: "Jasper Luxury Boat Tours" }],
  openGraph: {
    title: "Jasper Luxury Boat Tours | Premium Gili Islands Experiences",
    description: "Experience the magic of Gili Islands with our premium luxury boat tours and unforgettable adventures.",
    images: ["/gili/jasperlogo.png"],
    url: "https://jasperluxury.com",
    siteName: "Jasper Luxury Boat Tours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasper Luxury Boat Tours | Premium Gili Islands Experiences",
    description: "Experience the magic of Gili Islands with our premium luxury boat tours and unforgettable adventures.",
    images: ["/gili/jasperlogo.png"],
  },
  icons: {
    icon: "/gili/jasperlogo.png",
    apple: "/gili/jasperlogo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(font.className)}>
        <ClientWrapper>
          <MyFirebaseProvider>
            {children}
            <Toaster />
          </MyFirebaseProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
