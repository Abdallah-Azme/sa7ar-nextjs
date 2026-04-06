import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerAuth } from "@/features/auth/queries";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/shared/header/Header";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sohar Water | مياه صحار",
  description: "Natural water products from Sohar, Oman. - أفضل مياه طبيعية من صحار، عمان.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch user data on server to hydrate AuthContext (Zero flash logic)
  const initialUser = await getServerAuth();

  return (
    <html
      lang="ar"
      dir="rtl" // Fixed to Arabic/RTL by default for Sohar project
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* State Providers */}
        <AuthProvider initialUser={initialUser}>
          <CartProvider>
            
            {/* Global UI Structure */}
            <Header>
              <Navbar />
            </Header>

            <main className="flex-1">
              {children}
            </main>

            <Footer />
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
