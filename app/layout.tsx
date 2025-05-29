import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MyFirebaseProvider } from "@/components/firebase-providers";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Venefish | Vercel Next.JS Firebase Shadcn/ui Tailwind Boilerplate",
  description: "Venefish is a Vercel Next.JS Firebase Shadcn/ui Tailwind Boilerplate project to help you get started with your next project.",
};

// Client-side error boundary wrapper
function ClientErrorWrapper({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    // Server-side rendering - render normally
    return <>{children}</>;
  }

  // Client-side - wrap in error boundary
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Client-side error in layout:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Loading Error</h2>
          <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientErrorWrapper>
          <MyFirebaseProvider>
            {children}
            <Toaster />
          </MyFirebaseProvider>
        </ClientErrorWrapper>
      </body>
    </html>
  );
}
